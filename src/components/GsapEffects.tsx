import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { preloaderFinished } from "../lib/loading";

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP owns the HERO animation system (Framer removed from hero):
 * 1. Preloader-synced master timeline — badge pop, masked headline lines,
 *    fade items, stat cards, robot slide-in
 * 2. Infinite GSAP floats — robot column + chips (yoyo, different rhythms)
 * 3. ScrollTrigger scrub parallax — blobs drift at different speeds
 * 4. Magnetic buttons — CTAs pull slightly toward the cursor
 * 5. Scroll-spy nav highlight — active section link glows
 */
export default function GsapEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tl!: gsap.core.Timeline;
    const ctx = gsap.context(() => {
      /* --- 1. hero master timeline (plays the moment the preloader lifts) --- */
      tl = gsap.timeline({ paused: true, defaults: { ease: "power4.out" } });

      tl.from("[data-gs-badge]", {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(1.8)",
      })
        .from(
          "[data-gs-line]",
          { yPercent: 120, duration: 1, stagger: 0.13 },
          "-=0.3"
        )
        .from(
          "[data-gs-fade]",
          { y: 36, opacity: 0, duration: 0.75, stagger: 0.1 },
          "-=0.65"
        )
        .from(
          "[data-gs-stat]",
          { y: 56, opacity: 0, scale: 0.88, duration: 0.7, stagger: 0.09 },
          "-=0.55"
        );

      /* --- 2. (chips removed — no infinite floats needed) --- */

      /* --- 3. parallax blobs (scrub with scroll) --- */
      gsap.utils.toArray<HTMLElement>(".gs-parallax").forEach((el) => {
        const speed = parseFloat(el.dataset.speed || "0.25");
        gsap.to(el, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });

      /* --- 4. magnetic buttons --- */
      gsap.utils.toArray<HTMLElement>(".magnetic").forEach((el) => {
        const strength = 8;
        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2);
          const y = e.clientY - (r.top + r.height / 2);
          gsap.to(el, {
            x: (x / r.width) * strength,
            y: (y / r.height) * strength,
            duration: 0.4,
            ease: "power2.out",
          });
        };
        const onLeave = () =>
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
      });

      /* --- 5. scroll-spy: highlight nav link of visible section --- */
      const links = gsap.utils.toArray<HTMLAnchorElement>("header nav a[href^='#']");
      links.forEach((link) => {
        const id = link.getAttribute("href");
        if (!id || id === "#") return;
        const section = document.querySelector(id);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            link.classList.toggle("!bg-white/10", self.isActive);
            link.classList.toggle("!text-white", self.isActive);
          },
        });
      });
    });
    // Start the hero choreography exactly when the splash lifts —
    // no guessing with fixed delays, no blank-hero gap on repeat views.
    let cancelled = false;
    void preloaderFinished.then(() => {
      if (!cancelled) tl.play();
    });
    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, []);

  return null;
}
