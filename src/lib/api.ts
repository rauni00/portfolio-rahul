/* Dynamic portfolio data from the email-bot backend.
   Set VITE_API_URL to the email-bot base URL (e.g. http://localhost:5000).
   When unset, the local data.ts fallback is used — the site never goes blank. */

const BASE = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_API_URL?.replace(/\/$/, "") || "";
const API_SECRET = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_PORTFOLIO_API_KEY || "";

export const apiBase = BASE;
export const isApiEnabled = BASE.length > 0;

let warnedNoCrypto = false;

/* AES-256-GCM encrypted token: { timestamp + random } sealed with
   SHA-256(API_SECRET). Server decrypts and rejects stale/forged tokens. */
async function portfolioToken(): Promise<string | null> {
  if (!API_SECRET) return null;
  try {
    const subtle = window.crypto?.subtle;
    if (!subtle) {
      if (!warnedNoCrypto) {
        warnedNoCrypto = true;
        console.warn("[portfolio] WebCrypto unavailable — API calls go without token");
      }
      return null;
    }
    const keyBytes = await subtle.digest("SHA-256", new TextEncoder().encode(API_SECRET));
    const key = await subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, ["encrypt"]);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const payload = JSON.stringify({ t: Date.now(), n: Math.random().toString(36).slice(2) });
    const ct = await subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(payload));
    const combined = new Uint8Array(12 + ct.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ct), 12);
    let bin = "";
    combined.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin);
  } catch (e) {
    console.warn("[portfolio] token encrypt failed:", e);
    return null;
  }
}

async function authedFetch(url: string, init?: RequestInit): Promise<Response> {
  const headers: Record<string, string> = { ...(init?.headers as Record<string, string> | undefined) };
  const token = await portfolioToken();
  if (token) headers["X-Portfolio-Token"] = token;
  return fetch(url, { ...init, headers });
}

let contentPromise: Promise<any | null> | null = null;

export function getPortfolioContent(): Promise<any | null> {
  if (!isApiEnabled) return Promise.resolve(null);
  if (!contentPromise) {
    contentPromise = authedFetch(`${BASE}/api/portfolio/content`)
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null);
  }
  return contentPromise;
}

export function refreshPortfolioContent() {
  contentPromise = null;
  return getPortfolioContent();
}

export async function submitPortfolioLead(payload: { name: string; email: string; company?: string; message: string }) {
  if (!isApiEnabled) return null;
  const res = await authedFetch(`${BASE}/api/portfolio/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Lead API ${res.status}`);
  return res.json();
}

/* One hit per portfolio open — saved as a visit log in email-bot.
   Once per tab session only: refreshes reuse the same sessionStorage,
   so hammering refresh no longer inflates "Visits today".
   A new tab/window counts as a new visit.
   Owner opt-out: open the site once with ?notrack=1 — this device's
   future visits are then marked internal and hidden from CMS stats. */
let visitSent = false;
const VISIT_KEY = "rr-visit-logged";
const NOTRACK_KEY = "rr-no-track";
export function logPortfolioVisit(page = "/") {
  if (!isApiEnabled || visitSent) return;
  let internal = false;
  try {
    if (new URLSearchParams(window.location.search).get("notrack") === "1") {
      localStorage.setItem(NOTRACK_KEY, "1");
    }
    internal = localStorage.getItem(NOTRACK_KEY) === "1";
    if (sessionStorage.getItem(VISIT_KEY)) {
      visitSent = true;
      return;
    }
    sessionStorage.setItem(VISIT_KEY, "1");
  } catch {
    /* storage unavailable — fall through, module flag still guards repeats */
  }
  visitSent = true;
  authedFetch(`${BASE}/api/portfolio/visits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ page, referrer: document.referrer || "", internal }),
  }).catch(() => {});
}

/* Chatbot session — saved in email-bot with company/detail.
   Fires immediately (keepalive so closing the tab doesn't lose it)
   and logs failures to the console instead of swallowing them. */
export function saveChatSession(messages: Array<{ from: "bot" | "user"; text: string }>, extra?: { visitorName?: string; visitorEmail?: string; company?: string; detail?: string }) {
  if (!isApiEnabled || messages.length === 0) return;
  authedFetch(`${BASE}/api/portfolio/chat/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: getChatSessionId(),
      page: window.location.pathname,
      messages: messages.slice(-100),
      ...extra,
    }),
    keepalive: true,
  })
    .then((r) => {
      if (!r.ok) console.warn("[portfolio] chat session save failed:", r.status);
    })
    .catch((e) => console.warn("[portfolio] chat session save error:", e));
}
/* Session id is stable per browser (localStorage) so all of a visitor's
   messages land in one email-bot inbox thread. */
export function getChatSessionId(): string {
  const KEY = "rr-chat-session";
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = `sess-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return `sess-${Date.now().toString(36)}`;
  }
}

/* Resume — downloads the PDF uploaded in email-bot Settings.
   Fetched with the encrypted token (plain anchor navigation can't
   send headers), saved via a blob URL so the filename is correct. */
export function resumeDownloadUrl(fallback: string): string {
  if (!isApiEnabled) return fallback;
  return `${BASE}/api/portfolio/resume`;
}

export async function downloadResume(filename = "Rahul-Rauniyar-Resume.pdf"): Promise<boolean> {
  if (!isApiEnabled) return false;
  try {
    const res = await authedFetch(`${BASE}/api/portfolio/resume`);
    if (!res.ok) return false;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 5000);
    return true;
  } catch {
    return false;
  }
}

export async function getResumeMeta(): Promise<{ filename: string; size: number } | null> {
  if (!isApiEnabled) return null;
  try {
    const r = await authedFetch(`${BASE}/api/portfolio/resume/meta`);
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}
