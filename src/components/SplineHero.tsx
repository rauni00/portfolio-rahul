import { useEffect, useRef, useState } from "react";
import Spline from "@splinetool/react-spline";

const SPLINE_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";
const LOCAL_SCENE = "/cached-spline/scene.splinecode";

/* Head-tracking range (radians): yaw ±~31°, pitch ±~22° */
const YAW_RANGE = 0.55;
const PITCH_RANGE = 0.38;
/* Dance tempo: ~100 BPM groove */
const BEAT = (Math.PI * 2 * 100) / 60;

function waitForController(timeoutMs: number): Promise<boolean> {
  if (navigator.serviceWorker.controller) return Promise.resolve(true);

  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      resolve(false);
    }, timeoutMs);
    const onControllerChange = () => {
      window.clearTimeout(timeout);
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
      resolve(true);
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange, { once: true });
  });
}

interface Tracked {
  obj: any;
  baseX: number;
  baseY: number;
  baseZ: number;
}

const HEAD_RE = /head|face|skull|helmet|eye|neck/i;
/* Never rotate these — lights/cameras would wreck the scene look */
const SKIP_RE = /camera|light|directional|environment|sky/i;
const DANCER_RE = /robot|character|mascot|rig|root|_root|group|all|body/i;

function trackOf(o: any): Tracked {
  return {
    obj: o,
    baseX: o.rotation?.x ?? 0,
    baseY: o.rotation?.y ?? 0,
    baseZ: o.rotation?.z ?? 0,
  };
}

export default function SplineHero({ height = 620, fill = false }: { height?: number; fill?: boolean }) {
  const [sceneUrl, setSceneUrl] = useState<string>();
  const heads = useRef<Tracked[]>([]);
  const dancer = useRef<Tracked | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const dancing = useRef(false);
  const danceBlend = useRef(0);

  useEffect(() => {
    let active = true;

    const configureScene = async () => {
      if (!("serviceWorker" in navigator)) {
        if (active) setSceneUrl(SPLINE_SCENE);
        return;
      }

      try {
        await navigator.serviceWorker.register("/spline-cache-sw.js");
        await navigator.serviceWorker.ready;
        const controlled = await waitForController(2000);
        if (active) setSceneUrl(controlled ? LOCAL_SCENE : SPLINE_SCENE);
      } catch (error) {
        console.warn("[spline] local scene cache unavailable; using published URL", error);
        if (active) setSceneUrl(SPLINE_SCENE);
      }
    };

    void configureScene();
    return () => {
      active = false;
    };
  }, []);

  /* Party sections: the robot grooves while Projects / Contact are on screen */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = ["projects", "contact"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        dancing.current = entries.some((e) => e.isIntersecting);
      },
      { threshold: 0.25 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  /* Head tracking + whole-body groove. The body moves as ONE unit, so no
     part can ever detach — only the head joints get extra rotation. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Head tracking is desktop-only (fine pointer + wide screen).
    // On mobile the head stays straight — no cursor to follow.
    const mqFine = window.matchMedia("(pointer: fine)");
    const mqWide = window.matchMedia("(min-width: 640px)");
    const enabled = { current: mqFine.matches && mqWide.matches };
    const sync = () => {
      enabled.current = mqFine.matches && mqWide.matches;
      if (!enabled.current) {
        target.current.x = 0;
        target.current.y = 0;
      }
    };
    const onMove = (e: MouseEvent) => {
      if (!enabled.current) return;
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const look = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      look.x += (target.current.x - look.x) * 0.08;
      look.y += (target.current.y - look.y) * 0.08;
      // Ease the dance in/out so the robot never snaps between poses
      danceBlend.current += ((dancing.current ? 1 : 0) - danceBlend.current) * 0.06;
      const d = danceBlend.current;
      const t = performance.now() / 1000;

      try {
        // Groove: sway + lean + bounce-turn on the whole character
        const g = dancer.current;
        if (g && d > 0.001) {
          g.obj.rotation.z = g.baseZ + Math.sin(t * BEAT * 0.5) * 0.1 * d;
          g.obj.rotation.y = g.baseY + Math.sin(t * BEAT * 0.25) * 0.3 * d;
          g.obj.rotation.x = g.baseX + Math.abs(Math.sin(t * BEAT * 0.5)) * 0.06 * d;
        } else if (g && danceBlend.current <= 0.001) {
          g.obj.rotation.x = g.baseX;
          g.obj.rotation.y = g.baseY;
          g.obj.rotation.z = g.baseZ;
        }
        // Head: keeps watching the cursor + nods to the beat while dancing
        for (const h of heads.current) {
          h.obj.rotation.y = h.baseY + look.x * YAW_RANGE;
          h.obj.rotation.x = h.baseX + look.y * PITCH_RANGE + Math.sin(t * BEAT) * 0.07 * d;
        }
      } catch {
        /* rig detached mid-frame — next tick recovers */
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove);
    mqFine.addEventListener?.("change", sync);
    mqWide.addEventListener?.("change", sync);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      mqFine.removeEventListener?.("change", sync);
      mqWide.removeEventListener?.("change", sync);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* On scene load: rig the head joints + pick ONE top-level character group
     for the groove. Individual limbs are never touched (pivot mismatch made
     parts fly off the body). */
  const handleLoad = (app: any) => {
    try {
      const all: any[] = typeof app?.getAllObjects === "function" ? app.getAllObjects() : [];
      const nameOf = (o: any) => String(o?.name ?? "");
      heads.current = all
        .filter((o) => HEAD_RE.test(nameOf(o)) && !SKIP_RE.test(nameOf(o)) && typeof o.rotation === "object")
        .slice(0, 4)
        .map(trackOf);
      const isTop = (o: any) => !o.parent || o.parent === app || o.parent?.name === "Scene";
      const candidates = all.filter(
        (o) => DANCER_RE.test(nameOf(o)) && !SKIP_RE.test(nameOf(o)) && typeof o.rotation === "object"
      );
      const pick = candidates.find(isTop) ?? candidates[0] ?? null;
      dancer.current = pick ? trackOf(pick) : null;
      console.info(
        `[spline] rigged heads:${heads.current.length} dancer:${pick ? nameOf(pick) : "none"}`
      );
      if (!pick) console.warn("[spline] no character group found — groove disabled");
    } catch (e) {
      console.warn("[spline] rig unavailable", e);
    }
  };

  if (fill) {
    return (
      <div className="h-full w-full">
        {sceneUrl ? <Spline scene={sceneUrl} onLoad={handleLoad} /> : <div className="h-full w-full animate-pulse" />}
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 760, width: "100%" }}>
      <div
        className="overflow-hidden rounded-[2rem] bg-transparent"
        style={{ height, width: "100%", minHeight: 520 }}
      >
        {sceneUrl ? <Spline scene={sceneUrl} onLoad={handleLoad} /> : <div className="h-full w-full animate-pulse" />}
      </div>
    </div>
  );
}
