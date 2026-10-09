import { useEffect, useRef, useCallback } from "react";

/**
 * CustomCursor — Premium neon cursor with dot + ring + click ripple.
 * Only renders on devices with a fine pointer (mouse/trackpad).
 * Ring expands on interactive elements. Click creates ripple.
 * Tuned for speed: dot snaps almost instantly, ring follows with a
 * short premium trail (no slow/laggy feel).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const isDesktop = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  const animate = useCallback(() => {
    // Dot follows almost instantly (fast, no lag feel)
    dotPos.current.x += (mousePos.current.x - dotPos.current.x) * 0.65;
    dotPos.current.y += (mousePos.current.y - dotPos.current.y) * 0.65;

    // Ring follows quickly with a short smooth trail
    ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.35;
    ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.35;

    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px)`;
    }
    if (ringRef.current) {
      const isHovering = ringRef.current.classList.contains("hovering");
      const offset = isHovering ? 28 : 20;
      ringRef.current.style.transform = `translate(${ringPos.current.x - offset}px, ${ringPos.current.y - offset}px)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor-hover]");
      if (isInteractive) {
        ringRef.current?.classList.add("hovering");
        if (dotRef.current) {
          dotRef.current.style.background = "#6366f1";
          dotRef.current.style.boxShadow = "0 0 12px 4px rgba(99, 102, 241, 0.6)";
        }
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor-hover]");
      if (isInteractive) {
        ringRef.current?.classList.remove("hovering");
        if (dotRef.current) {
          dotRef.current.style.background = "#14b8a6";
          dotRef.current.style.boxShadow = "0 0 12px 4px rgba(20, 184, 166, 0.6)";
        }
      }
    };

    const onClick = (e: MouseEvent) => {
      // Create ripple effect
      const ripple = document.createElement("div");
      ripple.className = "ripple";
      ripple.style.left = `${e.clientX - 40}px`;
      ripple.style.top = `${e.clientY - 40}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("click", onClick);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isDesktop, animate]);

  if (!isDesktop) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
