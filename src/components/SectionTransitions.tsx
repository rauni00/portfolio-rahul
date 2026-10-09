import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * SectionDivider — Cinematic neon line that DRAWS itself continuously
 * as you scroll (scroll-linked scrub, not a one-time tween).
 */
export function SectionDivider({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={ref} className={`relative mx-auto max-w-6xl px-5 sm:px-8 ${className}`}>
      <motion.div style={{ scaleX }} className="section-divider origin-left" />
    </div>
  );
}

/**
 * SectionReveal — Wraps a section and reveals it with a punchy cinematic
 * rise + de-blur + settle animation. Fires when the section is genuinely
 * visible (amount-based) so you actually SEE it while scrolling.
 */
export function SectionReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 90, scale: 0.985, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * ParallaxSection — Adds parallax depth to any section wrapper.
 * Content moves slower than scroll for cinematic depth.
 */
export function ParallaxSection({
  children,
  className = "",
  speed = 0.05,
}: {
  children: React.ReactNode;
  className?: string;
  speed?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false }}
      style={{
        willChange: "transform",
      }}
      transition={{ ease: "linear" }}
    >
      <div
        className="gs-parallax"
        data-speed={speed}
      >
        {children}
      </div>
    </motion.div>
  );
}
