"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  className?: string;
  /** Sem label, o vídeo é tratado como decorativo. */
  label?: string;
  preload?: "auto" | "metadata" | "none";
};

// Clipe curto em loop que só toca enquanto está na tela. Nem o pôster baixa
// antes de o vídeo chegar perto da tela, para não disputar a rede com o topo.
// Com "reduzir movimento" ativo, fica parado no primeiro quadro.
export function LoopVideo({ name, className, label, preload = "none" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [perto, setPerto] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const aproxima = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPerto(true);
        aproxima.disconnect();
      },
      { rootMargin: "600px" },
    );
    aproxima.observe(video);
    return () => aproxima.disconnect();
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !perto) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [perto]);

  return (
    <video
      ref={ref}
      className={className}
      src={perto ? `/media/${name}.mp4` : undefined}
      poster={perto ? `/media/${name}.jpg` : undefined}
      muted
      loop
      playsInline
      preload={preload}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
