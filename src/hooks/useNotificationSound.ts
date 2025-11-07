import { useRef } from "react";

export function useNotificationSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    try {
      if (!audioRef.current) {
        // Create audio element with notification sound
        // Using a simple beep/notification sound data URI
        const audioData =
          "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==";
        audioRef.current = new Audio(audioData);
      }
      audioRef.current.play().catch((err) => {
        console.warn("Could not play notification sound:", err);
      });
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  };

  return { playSound };
}
