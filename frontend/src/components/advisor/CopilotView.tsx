"use client";

import React, { useState } from "react";
import { 
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
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base">VinFast AI Copilot</h2>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
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

        {/* Category Tabs */}
        <div className="flex items-center gap-2 px-6 py-2.5 border-b border-slate-100 bg-white overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg font-medium transition ${
                activeCategory === cat.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "ai" && (
                <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex-shrink-0 flex items-center justify-center text-xs shadow-sm mt-1">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}

              <div className={`max-w-2xl space-y-3 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`p-5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-sm"
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
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                        <button className="hover:text-emerald-600 p-1 transition" title="Câu trả lời hữu ích">
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </button>
                        <button className="hover:text-red-600 p-1 transition" title="Chưa chính xác">
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
                      <FileText className="h-3.5 w-3.5 text-blue-600" />
                      <span>Căn cứ tài liệu chính thức (Grounded Citations):</span>
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {msg.citations.map((cit) => (
                        <div
                          key={cit.id}
                          onClick={() => handleSourceClick(cit.docTitle)}
                          className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs cursor-pointer hover:bg-blue-100/70 transition"
                        >
                          <div className="flex items-center justify-between font-semibold text-blue-900">
                            <span className="line-clamp-1">{cit.docTitle}</span>
                            <span className="px-1.5 py-0.5 rounded bg-blue-200/60 text-[10px] text-blue-800">
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
                  <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1.5">
                    <p className="font-bold flex items-center gap-1 text-amber-800">
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
                        className="text-xs px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition text-left"
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
              <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs shadow-sm">
                <Sparkles className="h-4 w-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2 shadow-sm">
                <span className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce"></span>
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
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
            <div className="mb-2 p-2.5 rounded-xl bg-red-500 text-white text-xs font-bold flex items-center justify-between animate-pulse">
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
                  ? "border-red-400 bg-red-50/20 text-red-900 placeholder-red-400 ring-2 ring-red-400/20"
                  : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-800 placeholder-slate-400 bg-slate-50/50"
              }`}
            />
            <button
              type="button"
              onClick={toggleListening}
              className={`p-3 rounded-xl transition shadow-sm active:scale-95 flex items-center justify-center flex-shrink-0 ${
                isListening
                  ? "bg-red-600 text-white ring-4 ring-red-400/30 animate-bounce"
                  : "bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200"
              }`}
              title={isListening ? "Dừng ghi âm" : "Nói bằng giọng nói tiếng Việt"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="rounded-xl bg-blue-600 p-3 text-white hover:bg-blue-500 disabled:opacity-50 transition shadow-sm active:scale-95 flex-shrink-0"
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
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <span>Câu hỏi thường gặp</span>
          </h3>

          <div className="space-y-2">
            {mockCopilotSuggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 transition text-xs text-slate-700 leading-snug group flex items-start justify-between gap-2"
              >
                <span>{q}</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition flex-shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Highlights */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 p-5 text-white shadow-md border border-slate-800 text-xs">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500 text-white uppercase tracking-wider">
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
    </div>
  );
};
