const CACHE_NAME = "rahul-portfolio-spline-scene-v1";
const LOCAL_SCENE_PATH = "/cached-spline/scene.splinecode";
const LOCAL_SCENE_URL = new URL(LOCAL_SCENE_PATH, self.location.origin).href;
const REMOTE_SCENE_URL = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("rahul-portfolio-spline-scene-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
    ]),
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== "GET" || requestUrl.pathname !== LOCAL_SCENE_PATH) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(LOCAL_SCENE_URL);
      if (cached) return cached;

      let response;
      try {
        response = await fetch(REMOTE_SCENE_URL, { mode: "cors" });
      } catch (error) {
        console.error("[spline-cache] remote scene request failed", error);
        return new Response("Unable to load Spline scene", { status: 502 });
      }
      if (!response.ok) return response;

      try {
        await cache.put(LOCAL_SCENE_URL, response.clone());
      } catch (error) {
        console.warn("[spline-cache] could not persist scene; serving network response", error);
      }
      return response;
    }),
  );
});
