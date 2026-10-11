/* Preloader coordination: the hero GSAP timeline must start when the
   preloader lifts — not after a hardcoded delay. A shared promise solves
   mount-order issues (resolving before anyone awaits still fires .then). */

let _resolve!: () => void;

export const preloaderFinished: Promise<void> = new Promise<void>((r) => {
  _resolve = r;
});

let _marked = false;

export function markPreloaderDone(): void {
  if (_marked) return;
  _marked = true;
  _resolve();
}

export const PRELOADER_SEEN_KEY = "rr-preloader-seen";
