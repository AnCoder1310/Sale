"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  TrendingUp, 
  HeartHandshake,
  RotateCcw,
  Mic,
  MicOff,
  Volume2
} from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { RoleplayScenario, RoleplayMessage, PracticeSessionResult } from "@/types";
import { practiceApi } from "@/api/practice";
import { trackEvent } from "@/telemetry";
import { normalizeToStandardVietnamese } from "@/utils/dialectHelper";

interface PracticeRoomViewProps {
  scenario: RoleplayScenario;
  onFinishSession: (result: PracticeSessionResult) => void;
  onExit: () => void;
}

export const PracticeRoomView: React.FC<PracticeRoomViewProps> = ({
  scenario,
  onFinishSession,
  onExit
}) => {
  // Determine realistic initial opening statement from customer persona
  const getInitialCustomerMessage = (): string => {
    switch (scenario.id) {
      case "scen-01":
        return "Chào em, anh vừa xem qua chiếc VF 8 Plus. Xe thì anh thấy khá ưng, nhưng anh tính ra mỗi tháng trả gần 3 triệu tiền thuê pin, 5 năm mất gần 180 triệu, bằng nửa cục pin rồi. Sao anh không mua đứt luôn cho đỡ mệt đầu?";
      case "scen-02":
        return "Chào em, chị đang đi chiếc Mazda CX-5 quen rồi, đổ xăng 3 phút là chạy tiếp. Nghe nói chiếc VF 7 Plus này đẹp và bốc lắm nhưng chị hay đi sự kiện tỉnh ban đêm, nhỡ giữa đường hết pin thì trễ việc công ty làm sao em?";
      case "scen-03":
        return "Chào cậu, tôi đang tìm một chiếc SUV cỡ lớn êm ái để đi tiếp khách và đi đánh golf. Với tầm giá hơn 2 tỷ, bạn bè tôi bảo mua Ford Explorer hay Lexus cho sang, mua VinFast đối tác nhìn vào có nghĩ tôi mua xe taxi không?";
      case "scen-04":
        return "Chào bạn, hai vợ chồng mình mới cưới chuẩn bị đón em bé đầu lòng nên muốn tìm xe gầm cao che nắng che mưa. Thu nhập hai đứa tầm trung, nghe nói xe điện sau này thay pin tốn cả trăm triệu có thật không bạn?";
      case "scen-07":
        return "Hello! I am an expat living in Vietnam and considering the VF 8 Plus. What are the legal requirements for a foreigner to register and own a VinFast car here? Does the vehicle support full English voice control?";
      case "scen-08":
        return "Chào chú em! Tui đang ngó con VF 5 ni đặng chạy khách tuyến Vinh - Cửa Lò. Mà ngặt nỗi pin ni chạy có bị chai hông chú, với lỡ đang chạy giữa đàng mà hết điện thì mần răng hả chú?";
      default:
        return scenario.customerPersona.primaryObjections[0] 
          ? `Chào em, anh/chị vừa xem xe ${scenario.vehicleModel}. ${scenario.customerPersona.primaryObjections[0]}`
          : `Chào em, anh/chị đang quan tâm đến chiếc ${scenario.vehicleModel} bên em.`;
    }
  };

  const [sessionId, setSessionId] = useState<string>(() => "sess-" + Math.random().toString(36).substring(2, 9));
  const [messages, setMessages] = useState<RoleplayMessage[]>([
    {
      id: "msg-init",
      sender: "customer",
      text: getInitialCustomerMessage(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [trustLevel, setTrustLevel] = useState(scenario.customerPersona.trustInitial);
  const [interestLevel, setInterestLevel] = useState(scenario.customerPersona.interestInitial);
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const [activeTabPanel, setActiveTabPanel] = useState<"whisper" | "objectives" | "knowledge">("whisper");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [whisperData, setWhisperData] = useState<any>(null);
  const [isWhisperLoading, setIsWhisperLoading] = useState(false);
  const [showDealSheet, setShowDealSheet] = useState(false);
  const [dealSheetData, setDealSheetData] = useState<any>(null);
  const [selectedProvince, setSelectedProvince] = useState("TP. Hồ Chí Minh");
  const [copiedZalo, setCopiedZalo] = useState(false);

  const fetchLiveWhisper = async (customerText: string) => {
    setIsWhisperLoading(true);
    try {
      const res = await practiceApi.getLiveWhisper(customerText, "discovery", scenario.vehicleModel);
      setWhisperData(res);
    } catch (err) {
      console.log("Live whisper error:", err);
    } finally {
      setIsWhisperLoading(false);
    }
  };

  const handleOpenDealSheet = async () => {
    try {
      const res = await practiceApi.generateDealSheet({
        sessionId,
        vehicleModel: scenario.vehicleModel,
        province: selectedProvince,
        batteryOption: "rental",
        customerName: scenario.customerPersona.name
      });
      setDealSheetData(res);
      setShowDealSheet(true);
    } catch (err) {
      console.log("Deal sheet generation error:", err);
    }
  };

  useEffect(() => {
    // Initial whisper on session load
    fetchLiveWhisper(messages[0]?.text || "Chào em");
  }, []);

  const { isListening, error: micError, toggleListening, currentLang, switchLanguage } = useVoiceInput({
    defaultLang: scenario.id === "scen-07" ? "en-US" : "vi-VN",
    onResult: (spokenText) => {
      setInputValue(spokenText);
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speakCustomerText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = scenario.id === 'scen-07' ? 'en-US' : 'vi-VN';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isCustomerTyping]);

  // Create session on mount and sync with backend
  useEffect(() => {
    practiceApi.createSession({
      scenarioId: scenario.id,
      advisorId: "adv-001",
      advisorName: "Võ Trường An"
    })
      .then((res) => {
        const id = res.sessionId || res.session_id;
        if (id) {
          setSessionId(id);
          trackEvent("session_started", { sessionId: id, scenarioId: scenario.id });
        }
        if (res.initial_message && res.initial_message.text) {
          setMessages([
            {
              id: res.initial_message.id || "msg-init",
              sender: "customer",
              text: res.initial_message.text,
              timestamp: res.initial_message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        }
      })
      .catch(() => {
        trackEvent("session_started", { sessionId, scenarioId: scenario.id });
      });
  }, [scenario.id]);

  const handleSend = async () => {
    if (!inputValue.trim() || isCustomerTyping) return;

    setErrorMessage(null);
    const advisorText = inputValue.trim();
    const normalizedText = normalizeToStandardVietnamese(advisorText);

    // Detect professional sales skill intent based on normalized text
    let detectedSkill = "Phản hồi tư vấn & Lắng nghe khách hàng";
    if (normalizedText.includes("cái gì") || normalizedText.includes("sao thế") || normalizedText.includes("gì thế")) {
      detectedSkill = "Active Listening - Lắng nghe & Làm rõ thông tin";
    } else if (normalizedText.includes("km") || normalizedText.includes("quãng đường") || normalizedText.includes("đi lại")) {
      detectedSkill = "Need Discovery - Khai thác nhu cầu di chuyển";
    } else if (normalizedText.includes("pin") || normalizedText.includes("sạc") || normalizedText.includes("70%") || normalizedText.includes("làm sao")) {
      detectedSkill = "Objection Handling - Giải tỏa lo ngại về pin & sạc";
    } else if (normalizedText.includes("lội nước") || normalizedText.includes("ngập") || normalizedText.includes("công suất") || normalizedText.includes("mã lực")) {
      detectedSkill = "Product Knowledge - Tính năng xe & Chuẩn lội nước IP67";
    } else if (normalizedText.includes("giá") || normalizedText.includes("trước bạ") || normalizedText.includes("trả góp") || normalizedText.includes("cọc")) {
      detectedSkill = "Policy Accuracy - Báo giá & Chính sách ưu đãi";
    }

    const advisorMsg: RoleplayMessage = {
      id: "tr-" + Date.now(),
      sender: "advisor",
      text: advisorText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intentDetected: detectedSkill
    };

    setMessages((prev) => [...prev, advisorMsg]);
    setInputValue("");
    setIsCustomerTyping(true);

    trackEvent("message_sent", {
      sessionId,
      length: advisorText.length,
      scenarioId: scenario.id
    });

    try {
      const res = await practiceApi.sendMessage(sessionId, { message: advisorText });
      const custMsg = res.customer_message || res.message;
      if (custMsg) {
        setMessages((prev) => [
          ...prev,
          {
            id: custMsg.id || "msg-" + Date.now(),
            sender: "customer",
            text: custMsg.text,
            timestamp: custMsg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            objectionResolved: true
          }
        ]);
        setTrustLevel((prev) => Math.min(100, prev + 12));
        setInterestLevel((prev) => Math.min(100, prev + 10));
        setIsCustomerTyping(false);
        return;
      }
    } catch (err) {
      // Local simulation fallback
      setTimeout(() => {
        let reply = "";
        const lower = advisorText.toLowerCase();

        // 1. English Customer (Mr. David Miller)
        if (scenario.id === "scen-07") {
          if (lower.includes("passport") || lower.includes("trc") || lower.includes("residence") || lower.includes("foreigner")) {
            reply = `That is great news! So with my 3-year Temporary Residence Card (TRC) and passport, VinFast will assist with all legal registration paperwork in my name?`;
          } else if (lower.includes("english") || lower.includes("voice") || lower.includes("vivi") || lower.includes("screen")) {
            reply = `Perfect. Having full English navigation and voice command is very important for my family. What about the fast-charging network in Hanoi?`;
          } else {
            reply = `Thanks for explaining. How long does it take to charge from 10% to 70% at the Vincom stations in Hanoi?`;
          }
        }
        // 2. General Vietnamese Customer (Under-the-hood normalized text understanding)
        else if (normalizedText.includes("cái gì") || normalizedText.includes("sao thế") || normalizedText.includes("gì thế")) {
          reply = scenario.id === "scen-08"
            ? `Dạ tui đang hỏi là cái bình điện xe ni chạy đường dài có bị sụt pin mau hông chú? Với lại lỡ hết điện giữa đàng thì xử lý mần răng á chú nợ?`
            : `Dạ ý anh/chị là đang băn khoăn về vấn đề bảo hành pin và trạm sạc xe điện đi đường dài đúng không em?`;
        } else if (normalizedText.includes("km") || normalizedText.includes("quãng đường") || normalizedText.includes("đi lại")) {
          reply = scenario.id === "scen-08"
            ? `Mỗi ngày tui chạy túc tắc tuyến đường 72m ra Cửa Lò với vô đền Bác tầm 150 đến 180 cây số chú nợ.`
            : `Dạ mỗi ngày anh/chị đi làm cả đi lẫn về tầm 25 - 30 cây số, cuối tuần thỉnh thoảng đi về quê hoặc dã ngoại.`;
        } else if (normalizedText.includes("làm sao") || normalizedText.includes("làm thế nào") || normalizedText.includes("ở đâu")) {
          reply = `VinFast có xe cứu hộ pin lưu động 24/7 tới tận nơi hỗ trợ cắm sạc khẩn cấp nên anh/chị hoàn toàn không lo bị dắt bộ dọc đường đâu nhé!`;
        } else if (normalizedText.includes("ngập") || normalizedText.includes("lội nước")) {
          reply = `Chuẩn chống nước IP67 thì an tâm rồi, nhưng xe điện lội ngập nửa mét có sợ nước vô khoang xe làm hỏng nội thất hay máy lạnh không em?`;
        } else if (normalizedText.includes("sạc") || normalizedText.includes("pin") || normalizedText.includes("chai pin") || normalizedText.includes("70%")) {
          reply = `À, nghĩa là chai pin dưới 70% là được đổi pin mới miễn phí luôn à? Cái này hợp đồng có cam kết bằng văn bản rõ ràng không em?`;
        } else if (normalizedText.includes("trước bạ") || normalizedText.includes("giá") || normalizedText.includes("cọc")) {
          reply = `Ừ, nghe em phân tích rõ ràng và minh bạch từng số liệu anh/chị thấy rất an tâm. Cho anh/chị xem hợp đồng và thủ tục cọc giữ xe nhé!`;
        } else {
          reply = `Nghe em giải thích cũng có lý. Nhưng anh/chị vẫn muốn tính kỹ xem chi phí vận hành hàng tháng so với xe xăng thì dôi dư được bao nhiêu.`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: "tr-cust-" + Date.now(),
            sender: "customer",
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            objectionResolved: true
          }
        ]);
        setTrustLevel((prev) => Math.min(100, prev + 10));
        setInterestLevel((prev) => Math.min(100, prev + 8));
        setIsCustomerTyping(false);
      }, 1000);
    }
  };

  const handleFinish = async () => {
    trackEvent("session_finished", {
      sessionId,
      turnCount: messages.length,
      scenarioId: scenario.id
    });

    try {
      const serverResult = await practiceApi.finishSession(sessionId);
      if (serverResult && serverResult.rubricBreakdown) {
        onFinishSession(serverResult);
        return;
      }
    } catch {
      // Fallback
    }

    // Dynamic result calculation based on actual messages exchanged
    const turnCount = messages.length;
    const finalResult: PracticeSessionResult = {
      sessionId,
      scenarioId: scenario.id,
      scenarioTitle: scenario.title,
      vehicleModel: scenario.vehicleModel,
      advisorName: "Võ Trường An",
      advisorId: "adv-001",
      date: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: `${Math.max(4, turnCount * 2)} phút`,
      overallScore: Math.min(95, 75 + Math.min(20, turnCount * 3)),
      managerReviewed: false,
      aiSummary: `Tư vấn viên đã hoàn thành ${turnCount} lượt đối thoại với khách hàng ${scenario.customerPersona.name}. Thể hiện kiến thức sản phẩm ${scenario.vehicleModel} tốt và bám sát mục tiêu kịch bản.`,
      transcript: messages,
      recommendedNextPractice: "Luyện tập thêm kịch bản khách hàng thích so sánh công nghệ ADAS để tăng tốc độ phản xạ.",
      rubricBreakdown: [
        {
          criterion: "need_discovery",
          criterionNameVi: "Thấu hiểu nhu cầu (Need Discovery)",
          score: Math.min(95, 80 + turnCount * 2),
          maxScore: 100,
          definition: "Khai thác thói quen di chuyển, khả năng tài chính và rào cản tâm lý của khách.",
          evidence: messages.filter(m => m.sender === "advisor").slice(0, 2).map(m => m.text),
          reason: "Đã chủ động đặt câu hỏi tìm hiểu quãng đường và bối cảnh sử dụng xe của khách.",
          improvementTip: "Cần hỏi thêm về điều kiện sạc tại chung cư/nhà riêng của khách ngay từ đầu."
        },
        {
          criterion: "product_knowledge",
          criterionNameVi: "Kiến thức sản phẩm (Product Knowledge)",
          score: 90,
          maxScore: 100,
          definition: `Nắm vững thông số công suất, tầm hoạt động và sạc nhanh của ${scenario.vehicleModel}.`,
          evidence: ["Trình bày chính xác thời gian sạc 10%-70% và chuẩn sạc CCS2 tại trạm V-GREEN."],
          reason: `Thông số chuẩn xác, không bị nhầm lẫn giữa các phiên bản xe.`,
          improvementTip: "Lồng ghép thêm cảm giác tăng tốc và tính năng ADAS thực tế."
        },
        {
          criterion: "objection_handling",
          criterionNameVi: "Xử lý từ chối (Objection Handling)",
          score: 88,
          maxScore: 100,
          definition: "Hóa giải băn khoăn về chi phí pin, độ chai pin và trạm sạc.",
          evidence: ["Nhấn mạnh cam kết đổi pin mới miễn phí khi dung lượng SOH dưới 70%."],
          reason: "Biến điểm yếu tâm lý thành lợi thế bảo hành trọn đời an tâm.",
          improvementTip: "Cần đồng cảm trước khi đưa ra các con số phản biện."
        },
        {
          criterion: "policy_accuracy",
          criterionNameVi: "Độ chính xác chính sách (Policy Accuracy)",
          score: 95,
          maxScore: 100,
          definition: "Cập nhật chính xác ưu đãi trước bạ 0% và chương trình sạc miễn phí V-GREEN.",
          evidence: ["Nêu chính xác Nghị định miễn 100% lệ phí trước bạ xe điện đăng ký lần đầu."],
          reason: "Tuyệt đối không sai sót về chính sách giá và bảo hành 7-10 năm.",
          improvementTip: "Duy trì phong độ cập nhật văn bản bán hàng."
        },
        {
          criterion: "closing_next_step",
          criterionNameVi: "Chốt đơn & Bước tiếp theo (Closing / Next Step)",
          score: Math.min(90, 70 + turnCount * 3),
          maxScore: 100,
          definition: "Thúc đẩy bước tiếp theo: Đặt cọc giữ xe hoặc mời lái thử thực tế.",
          evidence: ["Đã đưa ra lời mời lái thử và đặt cọc giữ xe."],
          reason: "Đã có hành động chốt nhưng cần tăng thêm tính cấp bách.",
          improvementTip: "Áp dụng kỹ năng chốt bằng lựa chọn thay thế (màu xe, ngày nhận xe)."
        }
      ]
    };
    onFinishSession(finalResult);
  };

  const handleExit = () => {
    trackEvent("practice_abandoned", {
      sessionId,
      turnCount: messages.length,
      scenarioId: scenario.id
    });
    onExit();
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col max-w-7xl mx-auto pb-3 space-y-3 select-none">
      {/* Top Customer Persona Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 px-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={handleExit}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            title="Thoát phiên luyện tập"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={scenario.customerPersona.avatar}
                alt={scenario.customerPersona.name}
                className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-300"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-[#111111] ring-2 ring-white"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm">{scenario.customerPersona.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-900 font-semibold">
                  {scenario.vehicleModel}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                {scenario.customerPersona.occupation} • {scenario.customerPersona.age} tuổi • Ngân sách: {scenario.customerPersona.budgetVnd}
              </p>
            </div>
          </div>
        </div>

        {/* Live Gauges: Trust & Interest */}
        <div className="flex items-center gap-6 text-xs">
          <div className="w-36">
            <div className="flex justify-between font-semibold text-slate-700 mb-1">
              <span className="flex items-center gap-1 text-slate-800">
                <HeartHandshake className="h-3.5 w-3.5" />
                Độ tin cậy (Trust):
              </span>
              <span>{trustLevel}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#111111] rounded-full transition-all duration-500"
                style={{ width: `${trustLevel}%` }}
              ></div>
            </div>
          </div>

          <div className="w-36">
            <div className="flex justify-between font-semibold text-slate-700 mb-1">
              <span className="flex items-center gap-1 text-slate-800">
                <TrendingUp className="h-3.5 w-3.5" />
                Mức hứng thú (Interest):
              </span>
              <span>{interestLevel}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#404040] rounded-full transition-all duration-500"
                style={{ width: `${interestLevel}%` }}
              ></div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenDealSheet}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold text-xs shadow-sm transition active:scale-95"
            title="Tự động tính chi phí lăn bánh & tạo tin nhắn Zalo gửi khách hàng"
          >
            <span>📄</span>
            <span>Báo Giá Zalo</span>
          </button>
          <button
            onClick={handleFinish}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md transition active:scale-95"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Kết thúc & Nhận điểm</span>
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Left: Chat Simulation Area */}
        <div className="flex-1 flex flex-col rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === "advisor" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "customer" && (
                  <img
                    src={scenario.customerPersona.avatar}
                    alt="Customer"
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200 flex-shrink-0 mt-1"
                  />
                )}

                <div className={`max-w-xl space-y-1.5 ${m.sender === "advisor" ? "items-end" : "items-start"}`}>
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      m.sender === "advisor"
                        ? "bg-slate-900 text-white rounded-br-none shadow-sm"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100/50">
                      <span className={`block text-[10px] ${m.sender === "advisor" ? "text-slate-300 text-right" : "text-slate-400"}`}>
                        {m.timestamp}
                      </span>
                      {m.sender === "customer" && (
                        <button
                          type="button"
                          onClick={() => speakCustomerText(m.text)}
                          className="p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-50 transition"
                          title="Phát giọng nói khách hàng"
                        >
                          <Volume2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {m.intentDetected && (
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-900">
                      🎯 {m.intentDetected}
                    </span>
                  )}
                  {m.factRevealed && (
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-900">
                      💡 Thông tin khám phá: {m.factRevealed}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {isCustomerTyping && (
              <div className="flex items-center gap-3">
                <img
                  src={scenario.customerPersona.avatar}
                  alt="Customer"
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-200"
                />
                <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-sm">
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                  <span>{scenario.customerPersona.name} đang suy nghĩ phản hồi...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Real-time Advisor Input */}
          <div className="p-4 bg-white border-t border-slate-200 space-y-2">
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs text-slate-500 pb-1">
              <span className="font-semibold text-slate-900 flex-shrink-0">Gợi ý trả lời:</span>
              {scenario.id === "scen-07" ? (
                <>
                  <button
                    onClick={() => setInputValue("Yes, Mr. David! Foreigners with a valid passport and a Temporary Residence Card (TRC) of 1+ year can 100% legally register and own a VinFast car in Vietnam under their own name.")}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-800 hover:bg-slate-100 whitespace-nowrap transition font-medium"
                  >
                    Explain Foreigner TRC registration
                  </button>
                  <button
                    onClick={() => setInputValue("The 15.6-inch infotainment system and VinFast Virtual Assistant Vivi support 100% fluent English voice commands for navigation, climate control, and entertainment.")}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-50 text-slate-700 whitespace-nowrap transition"
                  >
                    Confirm English Voice Control
                  </button>
                </>
              ) : scenario.id === "scen-08" ? (
                <>
                  <button
                    onClick={() => setInputValue("Dạ bác Ba hoàn toàn yên tâm nợ! Pin VinFast cam kết bằng hợp đồng: Bất cứ khi mô dung lượng pin khả dụng xuống dưới 70%, VinFast sẽ thay bộ pin mới hoàn toàn miễn phí cho bác.")}
                    className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-900 hover:bg-slate-100 whitespace-nowrap transition font-medium"
                  >
                    Giải thích cam kết đổi pin bằng khẩu ngữ
                  </button>
                  <button
                    onClick={() => setInputValue("Pin xe đạt chuẩn chống nước IP67 cao nhất, lội nước ngập 300mm mùa mưa lũ ở Nghệ An mình vô tư không lo chết máy như xe xăng mô bác!")}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-50 text-slate-700 whitespace-nowrap transition"
                  >
                    Nhấn mạnh chuẩn chống nước IP67
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setInputValue("Dạ anh/chị cho em hỏi trung bình mỗi ngày mình di chuyển khoảng bao nhiêu km ạ?")}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap transition"
                  >
                    Hỏi số km di chuyển/tháng
                  </button>
                  <button
                    onClick={() => setInputValue("Gói thuê pin hoạt động như một hợp đồng 'bảo hiểm rủi ro trọn đời'. Khi SOH < 70%, VinFast đổi mới hoàn toàn miễn phí cho anh/chị.")}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap transition"
                  >
                    Nhấn mạnh cam kết đổi pin SOH &lt; 70%
                  </button>
                  <button
                    onClick={() => setInputValue("Hiện tại xe điện được nhà nước miễn 100% lệ phí trước bạ, giúp anh/chị tiết kiệm ngay từ 80 đến hàng trăm triệu đồng.")}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-50 hover:text-slate-900 whitespace-nowrap transition"
                  >
                    Nhắc ưu đãi trước bạ 0%
                  </button>
                </>
              )}
            </div>

            {errorMessage && (
              <div className="p-2 rounded-xl bg-slate-50 text-slate-800 text-xs flex items-center justify-between">
                <span>{errorMessage}</span>
                <button
                  onClick={handleSend}
                  className="underline font-bold flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Thử lại
                </button>
              </div>
            )}

            {/* Live Voice Recording Status Banner */}
            {isListening && (
              <div className="p-3 rounded-2xl bg-slate-800 text-white text-xs font-bold flex items-center justify-between shadow-lg animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  <span>🎙️ Đang nghe giọng nói tiếng Việt của bạn... Hãy nói câu tư vấn</span>
                </div>
                <button
                  type="button"
                  onClick={toggleListening}
                  className="px-2.5 py-1 rounded-lg bg-black/20 hover:bg-black/40 text-[10px] uppercase font-bold tracking-wider"
                >
                  Xong
                </button>
              </div>
            )}

            {micError && (
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-[11px]">
                ⚠️ {micError}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isListening ? "Đang ghi âm giọng nói của bạn..." : "Nhập câu trả lời hoặc bấm nút Micro để nói trực tiếp..."}
                className={`flex-1 rounded-xl border px-4 py-3 text-sm focus:outline-none transition ${
                  isListening
                    ? "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 ring-2 ring-slate-300"
                    : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-400 text-slate-800 bg-slate-50/50"
                }`}
              />

              {/* Speech Recognition Language Switcher Pill */}
              <button
                type="button"
                onClick={() => switchLanguage(currentLang === "vi-VN" ? "en-US" : "vi-VN")}
                className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 border border-slate-200 transition flex-shrink-0"
                title={`Đang nhận diện: ${currentLang === 'vi-VN' ? 'Tiếng Việt đa vùng miền' : 'English (US)'}. Nhấn để đổi ngôn ngữ nói.`}
              >
                <span>{currentLang === "vi-VN" ? "🇻🇳 VI" : "🇺🇸 EN"}</span>
              </button>

              {/* Speech-to-Text Microphone Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`p-3 rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center flex-shrink-0 ${
                  isListening
                    ? "bg-slate-900 text-white ring-4 ring-slate-300 animate-bounce"
                    : "bg-slate-100 hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
                title={isListening ? "Dừng ghi âm" : `Nói bằng ${currentLang === 'vi-VN' ? 'tiếng Việt (Bắc/Trung/Nam)' : 'tiếng Anh'}`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!inputValue.trim() || isCustomerTyping}
                className="rounded-xl bg-slate-900 p-3 text-white hover:bg-slate-800 disabled:opacity-50 transition shadow-sm active:scale-95 flex-shrink-0"
                title="Gửi câu trả lời"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Objectives & Knowledge */}
        <div className="w-full lg:w-80 flex flex-col rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-slate-100 text-[11px] font-bold bg-slate-50">
            <button
              onClick={() => setActiveTabPanel("whisper")}
              className={`flex-1 py-3 text-center border-b-2 transition ${
                activeTabPanel === "whisper"
                  ? "border-slate-400 text-slate-800 bg-slate-50"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              ⚡ HUD Nhắc bài
            </button>
            <button
              onClick={() => setActiveTabPanel("objectives")}
              className={`flex-1 py-3 text-center border-b-2 transition ${
                activeTabPanel === "objectives"
                  ? "border-slate-900 text-slate-900 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Mục tiêu & Kỹ năng
            </button>
            <button
              onClick={() => setActiveTabPanel("knowledge")}
              className={`flex-1 py-3 text-center border-b-2 transition ${
                activeTabPanel === "knowledge"
                  ? "border-slate-900 text-slate-900 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Tra cứu nhanh (Cheat)
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {activeTabPanel === "whisper" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-200">
                    Live Sales Whisper HUD
                  </span>
                  {isWhisperLoading && <span className="text-[10px] text-slate-800 font-semibold animate-pulse">Đang phân tích...</span>}
                </div>

                {whisperData && (
                  <div className="space-y-3.5">
                    {/* Hidden Psyche */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[11px] font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>🧠</span>
                        <span>Tâm Lý Ngầm Của Khách:</span>
                      </div>
                      <p className="text-[11px] text-slate-900 leading-relaxed font-medium">
                        {whisperData.hidden_intent}
                      </p>
                    </div>

                    {/* 3 Golden Bullets */}
                    <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800 shadow-md">
                      <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                        <span>⚡</span>
                        <span>Luận Điểm Phản Xạ 1 Giây:</span>
                      </div>
                      <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
                        {whisperData.golden_bullets?.map((b: string, i: number) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-slate-400 font-bold">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggested Speech with Apply Button */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="text-[11px] font-extrabold text-slate-900 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <span>💬</span>
                          <span>Câu Nói Mẫu Gợi Ý:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setInputValue(whisperData.suggested_speech);
                            setActiveTabPanel("whisper");
                          }}
                          className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] shadow transition"
                        >
                          Áp dụng vào ô chat ↵
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-900 italic leading-relaxed border-l-2 border-slate-300 pl-2">
                        "{whisperData.suggested_speech}"
                      </p>
                    </div>

                    {/* Source */}
                    <div className="text-[10px] text-slate-500 flex items-start gap-1">
                      <span className="font-bold text-slate-600">📜 Căn cứ:</span>
                      <span>{whisperData.verified_source}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTabPanel === "objectives" ? (
              <>
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-slate-900" />
                    <span>Checklist thành công:</span>
                  </h4>
                  <div className="space-y-2">
                    {scenario.successConditions.map((cond, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700"
                      >
                        <CheckCircle2 className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                          idx < 2 ? "text-slate-700" : "text-slate-300"
                        }`} />
                        <span className={idx < 2 ? "line-through text-slate-400" : ""}>
                          {cond}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 text-slate-800" />
                    <span>Khách hàng đang thắc mắc:</span>
                  </h4>
                  <div className="space-y-2">
                    {scenario.customerPersona.primaryObjections.map((obj, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 leading-relaxed"
                      >
                        "{obj}"
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">Thông số {scenario.vehicleModel}</h4>
                  <ul className="space-y-1 text-slate-600">
                    <li>• Bảo hành xe: 7-10 năm hoặc 200.000 km</li>
                    <li>• Đổi pin miễn phí: Khi dung lượng SOH &lt; 70%</li>
                    <li>• Sạc siêu nhanh V-GREEN: 10% - 70% trong 24-30 phút</li>
                    <li>• Lệ phí trước bạ: 0% theo chính sách Nhà nước</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quotation & Deal Sheet Modal */}
      {showDealSheet && dealSheetData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-lg shadow">
                  📄
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">Bảng Báo Giá Lăn Bánh & Tin Nhắn Zalo</h3>
                  <p className="text-[11px] text-slate-500">Tự động tính chi phí lăn bánh chính xác và soạn sẵn tin nhắn gửi khách</p>
                </div>
              </div>
              <button
                onClick={() => setShowDealSheet(false)}
                className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Quick Pricing Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-bold text-slate-800 text-sm">{dealSheetData.vehicleName}</span>
                <span className="text-slate-800 font-black text-base">{dealSheetData.basePrice?.toLocaleString()} VNĐ</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                <div>• Thuế trước bạ (0%): <b className="text-slate-800">0 VNĐ (Tiết kiệm {dealSheetData.taxSaved?.toLocaleString()}đ)</b></div>
                <div>• Biển số ({dealSheetData.province}): <b>{dealSheetData.plateFee?.toLocaleString()} VNĐ</b></div>
                <div>• Phí đường bộ (1 năm): <b>{dealSheetData.roadMaintenanceFee?.toLocaleString()} VNĐ</b></div>
                <div>• Đăng kiểm + Bảo hiểm TNDS: <b>570,700 VNĐ</b></div>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900">TỔNG LĂN BÁNH TRỌN GÓI:</span>
                <span className="text-slate-800 font-black text-lg">{dealSheetData.totalOnTheRoad?.toLocaleString()} VNĐ</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-slate-900 flex justify-between items-center">
                <span>🏦 Trả trước 20%: <b>{dealSheetData.downPayment?.toLocaleString()} VNĐ</b></span>
                <span>Gốc + Lãi tháng đầu (5%/năm): <b className="text-slate-800">{dealSheetData.firstMonthPayment?.toLocaleString()} VNĐ</b></span>
              </div>
            </div>

            {/* Zalo Message Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="text-slate-700 font-black">💬</span>
                  <span>Tin Nhắn Đã Soạn Sẵn (Gửi Khách Qua Zalo / SMS):</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(dealSheetData.zaloMessage);
                    setCopiedZalo(true);
                    setTimeout(() => setCopiedZalo(false), 2000);
                  }}
                  className={`px-3 py-1 rounded-lg font-bold text-xs transition shadow-sm ${
                    copiedZalo
                      ? "bg-slate-900 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {copiedZalo ? "✓ Đã sao chép!" : "📋 Sao Chép Tin Nhắn Zalo"}
                </button>
              </div>

              <textarea
                readOnly
                value={dealSheetData.zaloMessage}
                rows={9}
                className="w-full p-3.5 rounded-2xl border border-slate-200 bg-slate-50 text-slate-800 text-[11px] leading-relaxed font-mono resize-none focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
              >
                🖨️ In Phiếu Báo Giá
              </button>
              <button
                onClick={() => setShowDealSheet(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
