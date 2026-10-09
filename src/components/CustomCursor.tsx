import { useEffect, useRef, useCallback } from "react";

/**
 * CustomCursor — Premium neon cursor with physics feel.
 * - Dot snaps exactly to the pointer (zero lag = the "real" cursor).
 * - Ring trails on a spring AND stretches along movement direction (slime effect).
 * - Ring expands + turns iris over interactive elements, dot punches on click.
 * - Fades out when the pointer leaves the window.
 * Only renders on devices with a fine pointer (mouse/trackpad).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const prevPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const pressedRef = useRef(false);
  const rafRef = useRef<number>(0);

  const isDesktop = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  const animate = useCallback(() => {
    const mx = mousePos.current.x;
    const my = mousePos.current.y;

    // Velocity → stretch the ring along the direction of travel.
    const vx = mx - prevPos.current.x;
    const vy = my - prevPos.current.y;
    prevPos.current.x = mx;
    prevPos.current.y = my;
    const speed = Math.hypot(vx, vy);
    const angle = speed > 0.5 ? (Math.atan2(vy, vx) * 180) / Math.PI : 0;
    const stretch = Math.min(speed * 0.022, 0.5);

    // Dot = exact pointer (plus press punch).
    if (dotRef.current) {
      const s = pressedRef.current ? 0.65 : 1;
      dotRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px) scale(${s})`;
    }

    // Ring = springy trail with directional stretch.
    ringPos.current.x += (mx - ringPos.current.x) * 0.24;
    ringPos.current.y += (my - ringPos.current.y) * 0.24;
    if (ringRef.current) {
      const isHovering = ringRef.current.classList.contains("hovering");
      const base = isHovering ? 1.45 : 1;
      const offset = isHovering ? 28 : 20;
      ringRef.current.style.transform = `translate(${ringPos.current.x - offset}px, ${
        ringPos.current.y - offset
      }) rotate(${angle}deg) scale(${base * (1 + stretch)}, ${base * (1 - stretch * 0.55)})`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    // Start at screen center so the cursor never swoops in from (0, 0).
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    mousePos.current = { x: cx, y: cy };
    prevPos.current = { x: cx, y: cy };
    ringPos.current = { x: cx, y: cy };

    const setVisible = (v: boolean) => {
      if (dotRef.current) dotRef.current.style.opacity = v ? "1" : "0";
      if (ringRef.current) ringRef.current.style.opacity = v ? "1" : "0";
    };

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
          dotRef.current.style.boxShadow = "0 0 12px 4px rgba(99, 102, 241, 0.55)";
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
          dotRef.current.style.boxShadow = "0 0 12px 4px rgba(20, 184, 166, 0.45)";
        }
      }
    };

    const onMouseDown = () => {
      pressedRef.current = true;
    };
    const onMouseUp = () => {
      pressedRef.current = false;
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const onClick = (e: MouseEvent) => {
      // Click ripple.
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
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.addEventListener("click", onClick);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
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
