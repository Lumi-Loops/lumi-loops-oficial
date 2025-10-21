"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface TurnstileWidgetProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
  className?: string;
}

/**
 * Componente Turnstile Widget
 * Renderiza el widget de Cloudflare Turnstile para protección contra bots
 */
export function TurnstileWidget({
  siteKey,
  onVerify,
  onError,
  onExpire,
  theme = "auto",
  size = "normal",
  className = "",
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Renderizar el widget cuando el script esté cargado
  useEffect(() => {
    if (!isScriptLoaded || !containerRef.current || !window.turnstile) {
      return;
    }

    // Evitar renderizar múltiples veces
    if (widgetIdRef.current) {
      return;
    }

    try {
      // Renderizar el widget
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme,
        size,
        callback: (token: string) => {
          onVerify(token);
        },
        "error-callback": () => {
          onError?.();
        },
        "expired-callback": () => {
          onExpire?.();
          // Auto-reset cuando expira
          if (widgetIdRef.current && window.turnstile) {
            window.turnstile.reset(widgetIdRef.current);
          }
        },
      });
    } catch (error) {
      console.error("Error rendering Turnstile widget:", error);
      onError?.();
    }

    // Cleanup: remover el widget al desmontar
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch (error) {
          console.error("Error removing Turnstile widget:", error);
        }
        widgetIdRef.current = null;
      }
    };
  }, [isScriptLoaded, siteKey, theme, size, onVerify, onError, onExpire]);

  /**
   * Método público para resetear el widget
   */
  const reset = () => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  // Exponer el método reset (opcional, para uso avanzado)
  useEffect(() => {
    if (containerRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (containerRef.current as any).resetTurnstile = reset;
    }
  }, []);

  return (
    <>
      {/* Cargar el script de Turnstile */}
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={() => setIsScriptLoaded(true)}
        onError={() => {
          console.error("Failed to load Turnstile script");
          onError?.();
        }}
      />

      {/* Contenedor del widget */}
      <div ref={containerRef} className={className} />
    </>
  );
}
