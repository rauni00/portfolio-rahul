import { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";

const SPLINE_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";
const LOCAL_SCENE = "/cached-spline/scene.splinecode";

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

export default function SplineHero({ height = 620, fill = false }: { height?: number; fill?: boolean }) {
  const [sceneUrl, setSceneUrl] = useState<string>();

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

  if (fill) {
    return (
      <div className="h-full w-full">
        {sceneUrl ? <Spline scene={sceneUrl} /> : <div className="h-full w-full animate-pulse" />}
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full" style={{ maxWidth: 760, width: "100%" }}>
      <div
        className="overflow-hidden rounded-[2rem] bg-transparent"
        style={{ height, width: "100%", minHeight: 520 }}
      >
        {sceneUrl ? <Spline scene={sceneUrl} /> : <div className="h-full w-full animate-pulse" />}
      </div>
    </div>
  );
}
