import { useState, useCallback, useRef } from "react";

interface UseVoiceInputOptions {
  onResult?: (transcript: string) => void;
  defaultLang?: string;
}

export function useVoiceInput({ onResult, defaultLang = "vi-VN" }: UseVoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<string>(defaultLang);
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback((langToUse?: string) => {
    setError(null);
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Trình duyệt chưa hỗ trợ Web Speech API. Khuyên dùng Google Chrome hoặc Microsoft Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      const activeLang = langToUse || currentLang;
      recognition.lang = activeLang;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
        if (onResult) {
          onResult(currentText);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setError("Vui lòng cấp quyền truy cập Micro trên trình duyệt để sử dụng tính năng giọng nói.");
        } else {
          setError(`Lỗi micro: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setError("Không thể khởi động micro: " + err.message);
      setIsListening(false);
    }
  }, [currentLang, onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignored
      }
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening(currentLang);
    }
  }, [currentLang, isListening, startListening, stopListening]);

  const switchLanguage = (lang: "vi-VN" | "en-US") => {
    setCurrentLang(lang);
    if (isListening) {
      stopListening();
      setTimeout(() => startListening(lang), 300);
    }
  };

  return {
    isListening,
    transcript,
    error,
    currentLang,
    switchLanguage,
    startListening,
    stopListening,
    toggleListening,
  };
}
