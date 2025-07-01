import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";

export interface VoiceDictationHandle {
  startListening: () => void;
  stopListening: () => void;
  listening: boolean;
}

interface VoiceDictationProps {
  onResult: (text: string) => void;
}

const VoiceDictation = forwardRef<VoiceDictationHandle, VoiceDictationProps>(({ onResult }, ref) => {
  const recognitionRef = useRef<any>(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech Recognition not supported in this browser.");
      return;
    }
    setError(null);
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      onResult(transcript);
    };
    recognitionRef.current.onerror = (event: any) => {
      setError(event.error || "Unknown error");
      setListening(false);
    };
    recognitionRef.current.onend = () => {
      setListening(false);
    };
    recognitionRef.current.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  useImperativeHandle(ref, () => ({
    startListening,
    stopListening,
    listening,
  }), [listening]);

  return (
    error ? <div style={{ color: 'red', marginTop: 8 }}>{error}</div> : null
  );
});

export default VoiceDictation; 