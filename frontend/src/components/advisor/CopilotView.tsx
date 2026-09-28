"use client";

import React, { useState } from "react";
import { 
  Calculator,
  Send, 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  ThumbsUp, 
  ThumbsDown, 
  HelpCircle, 
  ChevronRight, 
  RotateCcw,
  BadgeCheck,
  Mic,
  MicOff
} from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { 
  mockCopilotInitialMessages, 
  mockCopilotSuggestedQuestions 
} from "@/data/mockCopilot";
import { CopilotMessage } from "@/types";
import { copilotApi } from "@/api/copilot";
import { trackEvent } from "@/telemetry";

interface CopilotViewProps {
  onNavigate?: (tab: string) => void;
}

export const CopilotView: React.FC<CopilotViewProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<CopilotMessage[]>(mockCopilotInitialMessages);
  const [inputValue, setInputValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcTab, setCalcTab] = useState<"loan" | "tco">("loan");
  const [calcCarPrice, setCalcCarPrice] = useState(850000000);
  const [calcDownPayment, setCalcDownPayment] = useState(20);
  const [calcYears, setCalcYears] = useState(5);
  const [calcInterest, setCalcInterest] = useState(5.0);
  const [loanResult, setLoanResult] = useState<any>(null);

  const [tcoVfModel, setTcoVfModel] = useState("VF 7");
  const [tcoCompModel, setTcoCompModel] = useState("Mazda CX-5");
  const [tcoMonthlyKm, setTcoMonthlyKm] = useState(1500);
  const [tcoYears, setTcoYears] = useState(5);
  const [tcoResult, setTcoResult] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculateLoan = async () => {
    setIsCalculating(true);
    try {
      const res = await copilotApi.calculateLoan({
        carPrice: calcCarPrice,
        downPaymentPct: calcDownPayment,
        annualInterestRatePct: calcInterest,
        loanYears: calcYears,
      });
      setLoanResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleCalculateTCO = async () => {
    setIsCalculating(true);
    try {
      const res = await copilotApi.calculateTCO({
        vehicleModel: tcoVfModel,
        competitorModel: tcoCompModel,
        monthlyKm: tcoMonthlyKm,
        periodYears: tcoYears,
      });
      setTcoResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCalculating(false);
    }
  };

  const { isListening, error: micError, toggleListening } = useVoiceInput({
    onResult: (spokenText) => {
      setInputValue(spokenText);
    },
  });

  const categories = [
    { id: "all", label: "Tất cả lĩnh vực" },
    { id: "specs", label: "Thông số & Công nghệ" },
    { id: "policy", label: "Chính sách & Ưu đãi" },
    { id: "battery", label: "Pin & Trạm sạc V-GREEN" },
    { id: "comparison", label: "So sánh đối thủ" },
  ];

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: CopilotMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    trackEvent("copilot_query", { query, category: activeCategory });

    try {
      const res = await copilotApi.query({ query, category: activeCategory });
      const aiMsg: CopilotMessage = {
        id: "ai-" + Date.now(),
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: res.answer,
        citations: res.citations,
        recommendedTalkingPoints: res.recommendedTalkingPoints,
        followUpQuestions: res.followUpQuestions,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Local fallback simulation
      setTimeout(() => {
        const aiResponseText = `### Phân tích kiến thức tư vấn: "${query}"\n\n* **Chính sách ưu đãi**: Miễn 100% lệ phí trước bạ xe điện đăng ký lần đầu, tiết kiệm từ 80 - 250 triệu đồng.\n* **Hạ tầng trạm sạc**: Mạng lưới V-GREEN phủ khắp 63 tỉnh thành, sạc siêu nhanh 10%-70% trong 20-30 phút.\n* **Cam kết Pin**: Đổi mới hoàn toàn miễn phí khi dung lượng SOH giảm xuống dưới 70%.`;

        const aiMsg: CopilotMessage = {
          id: "ai-" + Date.now(),
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: aiResponseText,
          citations: [
            {
              id: "cit-pol-01",
              docTitle: "Quy chuẩn tư vấn Pin & Bảo hành VinFast 2026",
              version: "v2.6.2",
              effectiveDate: "2026-01-01",
              confidence: 0.98,
              snippet: "Bất kỳ khi nào dung lượng pin khả dụng (SOH) xuống dưới 70%, VinFast cam kết thay thế bộ pin mới hoàn toàn miễn phí."
            }
          ],
          recommendedTalkingPoints: [
            "Hỏi quãng đường khách di chuyển trung bình hàng tháng",
            "Nhấn mạnh chi phí nuôi xe điện chỉ bằng 1/3 xe xăng",
            "Mời khách đăng ký lái thử trải nghiệm ADAS thực tế"
          ],
          followUpQuestions: [
            "Chính sách bảo hành pin xe điện VinFast khi nào được đổi mới?",
            "So sánh chi phí sạc pin V-GREEN với đổ xăng xe cùng phân khúc?",
            "Thời gian sạc siêu nhanh của các dòng VF 7, VF 8, VF 9?"
          ]
        };
        setMessages((prev) => [...prev, aiMsg]);
      }, 600);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSourceClick = (docTitle: string) => {
    trackEvent("source_clicked", { docTitle });
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto pb-4 select-none">
      {/* Left Chat Area (Main) */}
      <div className="flex-1 flex flex-col rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base">VinFast AI Copilot</h2>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-800 border border-slate-200">
                  <BadgeCheck className="h-3 w-3" />
                  RAG Grounded
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Truy vấn tài liệu chính thức, thông số kỹ thuật xe và chính sách bán hàng 2026
              </p>
            </div>
          </div>

          <button
            onClick={() => setMessages(mockCopilotInitialMessages)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 p-2 rounded-lg hover:bg-slate-100 transition"
            title="Xóa ngữ cảnh hội thoại"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Làm mới phiên chat</span>
          </button>
        </div>

        {/* Category Tabs & Calculator Trigger */}
        <div className="flex items-center justify-between gap-2 px-6 py-2.5 border-b border-slate-100 bg-white overflow-x-auto text-xs">
          <div className="flex items-center gap-2">
            {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition ${
                activeCategory === cat.id
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowCalculator(true)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold transition border border-slate-200 shadow-sm"
            title="Mở công cụ tính toán tài chính & so sánh chi phí TCO"
          >
            <Calculator className="h-3.5 w-3.5 text-slate-900" />
            <span>Máy tính Trả góp & TCO</span>
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex-shrink-0 flex items-center justify-center text-xs shadow-sm mt-1">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-3 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`p-5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-slate-900 text-white rounded-br-none shadow-sm"
                      : "bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {msg.sender === "ai" && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                      <span>{msg.timestamp}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 hover:text-slate-700 p-1 rounded transition"
                          title="Sao chép nội dung"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-slate-900" />
                              <span className="text-slate-900">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                        <button className="hover:text-slate-900 p-1 transition" title="Câu trả lời hữu ích">
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button className="hover:text-slate-700 p-1 transition" title="Chưa chính xác">
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Grounded Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-slate-900" />
                      <span>Căn cứ tài liệu chính thức (Grounded Citations):</span>
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.citations.map((cit) => (
                        <div
                          key={cit.id}
                          onClick={() => handleSourceClick(cit.docTitle)}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs cursor-pointer hover:bg-slate-100/70 transition"
                        >
                          <div className="flex items-center justify-between font-semibold text-slate-900">
                            <span className="line-clamp-1">{cit.docTitle}</span>
                            <span className="px-1.5 py-0.5 rounded bg-slate-200 text-[10px] text-slate-900">
                              {cit.version} • Độ tin cậy: {(cit.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1 italic leading-relaxed">
                            "{cit.snippet}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended Talking Points */}
                {msg.recommendedTalkingPoints && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 space-y-1.5">
                    <p className="font-bold flex items-center gap-1 text-slate-900">
                      <span>💡 Gợi ý luận điểm thuyết phục khách hàng:</span>
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700 pl-1">
                      {msg.recommendedTalkingPoints.map((tp, idx) => (
                        <li key={idx}>{tp}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow up questions */}
                {msg.followUpQuestions && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.followUpQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 transition text-left"
                      >
                        + {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs shadow-sm">
                <Sparkles className="h-4 w-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-sm">
                <span className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-slate-800 animate-bounce"></span>
                  <span className="h-2 w-2 rounded-full bg-slate-800 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-2 w-2 rounded-full bg-slate-800 animate-bounce [animation-delay:0.4s]"></span>
                </span>
                <span>Copilot đang truy xuất cơ sở dữ liệu và tổng hợp căn cứ...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          {/* Voice recording wave */}
          {isListening && (
            <div className="mb-2 p-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-white animate-ping"></span>
                <span>🎙️ Đang nghe giọng nói tiếng Việt... Hãy đặt câu hỏi tra cứu</span>
              </div>
              <button
                type="button"
                onClick={toggleListening}
                className="px-2 py-0.5 rounded bg-black/20 text-[10px] uppercase font-bold"
              >
                Xong
              </button>
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
              placeholder={isListening ? "Đang lắng nghe giọng nói..." : "Hỏi về thông số xe, pin thuê vs mua, ưu đãi trước bạ (hoặc bấm Micro nói)..."}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm focus:outline-none transition ${
                isListening
                  ? "border-slate-300 bg-slate-50 text-slate-900 placeholder-slate-400 ring-2 ring-slate-300"
                  : "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-400 text-slate-800 placeholder-slate-400 bg-slate-50/50"
              }`}
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center flex-shrink-0 ${
                isListening
                  ? "bg-slate-900 text-white ring-4 ring-slate-300 animate-bounce"
                  : "bg-slate-100 hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
              title={isListening ? "Dừng ghi âm" : "Nói bằng giọng nói tiếng Việt"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="rounded-xl bg-slate-900 p-3 text-white hover:bg-slate-800 disabled:opacity-50 transition shadow-sm active:scale-95 flex-shrink-0"
              title="Gửi câu hỏi"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 space-y-4">
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-slate-900" />
            <span>Câu hỏi thường gặp</span>
          </h3>

          <div className="space-y-2">
            {mockCopilotSuggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition text-xs text-slate-700 leading-snug group flex items-start justify-between gap-2"
              >
                <span>{q}</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition flex-shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="rounded-2xl bg-[#111111] p-5 text-white shadow-sm border border-[#262626] text-xs">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-white uppercase tracking-wider">
            Quick Cheat-sheet 2026
          </span>
          <h4 className="font-bold text-white text-sm mt-2">Bảo hành VinFast</h4>
          <ul className="mt-2 space-y-1.5 text-slate-300 leading-relaxed">
            <li>• Xe: <strong>7 - 10 năm hoặc 200.000 km</strong></li>
            <li>• Pin mua đứt: <strong>8 - 10 năm không giới hạn km</strong></li>
            <li>• Pin thuê: <strong>Đổi mới khi SOH &lt; 70%</strong></li>
            <li>• Trạm sạc V-GREEN: <strong>150.000+ cổng sạc</strong></li>
          </ul>
        </div>
      </div>

      {/* Financial & TCO Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
                  <Calculator className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Công Cụ Tính Toán Tài Chính Bán Xe</h3>
                  <p className="text-[11px] text-slate-500">Dự toán gốc lãi ngân hàng & so sánh chi phí TCO với xe xăng</p>
                </div>
              </div>
              <button
                onClick={() => setShowCalculator(false)}
                className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-100 gap-4 text-xs font-bold">
              <button
                onClick={() => setCalcTab("loan")}
                className={`pb-2 border-b-2 transition ${
                  calcTab === "loan" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                🏦 Dự Toán Vay Trả Góp
              </button>
              <button
                onClick={() => setCalcTab("tco")}
                className={`pb-2 border-b-2 transition ${
                  calcTab === "tco" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                ⚡ So Sánh TCO (Xe Điện vs Xe Xăng)
              </button>
            </div>

            {calcTab === "loan" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Giá niêm yết (VNĐ):</label>
                    <input
                      type="number"
                      value={calcCarPrice}
                      onChange={(e) => setCalcCarPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                      step={10000000}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tỷ lệ trả trước (%):</label>
                    <input
                      type="number"
                      value={calcDownPayment}
                      onChange={(e) => setCalcDownPayment(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                      min={10}
                      max={80}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Thời hạn vay (Năm):</label>
                    <select
                      value={calcYears}
                      onChange={(e) => setCalcYears(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                    >
                      <option value={3}>3 năm (36 tháng)</option>
                      <option value={5}>5 năm (60 tháng)</option>
                      <option value={7}>7 năm (84 tháng)</option>
                      <option value={8}>8 năm (96 tháng)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Lãi suất ưu đãi (%/năm):</label>
                    <input
                      type="number"
                      value={calcInterest}
                      onChange={(e) => setCalcInterest(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                      step={0.5}
                    />
                  </div>
                </div>

                <button
                  onClick={handleCalculateLoan}
                  disabled={isCalculating}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition"
                >
                  {isCalculating ? "Đang tính toán..." : "Tính Toán Bảng Trả Góp"}
                </button>

                {loanResult && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                    <p className="font-bold text-slate-900 leading-relaxed">{loanResult.summaryVi}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                      <div>Số tiền vay: <b>{loanResult.loanAmount?.toLocaleString()} VNĐ</b></div>
                      <div>Tháng đầu trả: <b className="text-slate-800">{loanResult.firstMonthPayment?.toLocaleString()} VNĐ</b></div>
                    </div>
                    <button
                      onClick={() => {
                        setInputValue(`Tư vấn giúp anh bài toán vay mua xe giá ${calcCarPrice.toLocaleString()}đ, trả trước ${calcDownPayment}%, vay ${calcYears} năm.`);
                        setShowCalculator(false);
                      }}
                      className="mt-2 w-full py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 transition"
                    >
                      Chèn nội dung vào chat với Copilot
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Xe điện VinFast:</label>
                    <select
                      value={tcoVfModel}
                      onChange={(e) => setTcoVfModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                    >
                      <option value="VF 3">VinFast VF 3 (Mini eSUV)</option>
                      <option value="VF 5">VinFast VF 5 Plus (A-SUV)</option>
                      <option value="VF 6">VinFast VF 6 Plus (B-SUV)</option>
                      <option value="VF 7">VinFast VF 7 Plus (C-SUV)</option>
                      <option value="VF 8">VinFast VF 8 Plus (D-SUV)</option>
                      <option value="VF 9">VinFast VF 9 Plus (E-SUV)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Xe xăng đối thủ so sánh:</label>
                    <select
                      value={tcoCompModel}
                      onChange={(e) => setTcoCompModel(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                    >
                      <option value="Mazda CX-5">Mazda CX-5 2.0</option>
                      <option value="Hyundai Santa Fe">Hyundai Santa Fe 2.5</option>
                      <option value="Ford Explorer">Ford Explorer 2.3 EcoBoost</option>
                      <option value="Toyota Raize">Toyota Raize 1.0 Turbo</option>
                      <option value="Toyota Vios">Toyota Vios 1.5</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Quãng đường hàng tháng (km):</label>
                    <input
                      type="number"
                      value={tcoMonthlyKm}
                      onChange={(e) => setTcoMonthlyKm(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                      step={100}
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Chu kỳ so sánh (Năm):</label>
                    <select
                      value={tcoYears}
                      onChange={(e) => setTcoYears(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800"
                    >
                      <option value={3}>3 năm</option>
                      <option value={5}>5 năm</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleCalculateTCO}
                  disabled={isCalculating}
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition"
                >
                  {isCalculating ? "Đang so sánh..." : "So Sánh Tổng Chi Phí Sở Hữu"}
                </button>

                {tcoResult && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <p className="font-bold text-slate-900 leading-relaxed">{tcoResult.summaryVi}</p>
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px]">
                      <div>Miễn trước bạ tiết kiệm: <b>{tcoResult.taxSavings?.toLocaleString()} VNĐ</b></div>
                      <div>Tiết kiệm mỗi tháng: <b className="text-slate-800">{tcoResult.savingsPerMonth?.toLocaleString()} VNĐ</b></div>
                    </div>
                    <button
                      onClick={() => {
                        setInputValue(`Phân tích giúp anh bài toán kinh tế so sánh ${tcoVfModel} và ${tcoCompModel} khi chạy ${tcoMonthlyKm} km/tháng trong ${tcoYears} năm.`);
                        setShowCalculator(false);
                      }}
                      className="mt-2 w-full py-1.5 rounded-lg bg-slate-900 text-white font-bold text-[11px] hover:bg-slate-800 transition"
                    >
                      Chèn nội dung vào chat với Copilot
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
