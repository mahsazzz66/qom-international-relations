"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * Ports the source's `initReveal` behaviour: content is always present in
 * the DOM (never hidden), and simply replays a fade/slide-up animation the
 * first time it scrolls into view, via IntersectionObserver.
 */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver !== "function") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          setAnimate(true);
          io.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ ...style, ...(animate ? { animation: "qomReveal 0.8s cubic-bezier(.22,.61,.36,1) both" } : {}) }}
    >
      {children}
    </Tag>
  );
}
