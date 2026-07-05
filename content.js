(() => {
  "use strict";
  const BLOCK_PREFIXES = ["bbc", "itv", "channel4", "all4", "4od"];
  const BLOCK_EXACT = new Set([
    // "gogglebox", "hollyoaks", "loveisland", "emmerdale", "coronationstreet", "thismorning", "lorraine",
  ]);
  const BLOCK_NAME_PATTERNS = [/^bbc\b/i, /^itv/i, /^channel\s?4\b/i, /^all\s?4\b/i, /^4od\b/i];

  let enabled = true;
  const CARD_SELECTOR = [
    "ytd-rich-item-renderer", "ytd-video-renderer", "ytd-compact-video-renderer",
    "ytd-grid-video-renderer", "ytd-reel-item-renderer", "ytd-playlist-renderer",
    "ytd-compact-playlist-renderer", "ytd-radio-renderer", "ytd-channel-renderer",
    "ytd-movie-renderer", "ytd-compact-movie-renderer"
  ].join(",");
  const CHECKED = "antiuktvChecked";
  const MAX_TRIES = 5;

  function handleFromHref(href) {
    if (!href) return null;
    let m = href.match(/^\/@([^/?#]+)/);
    if (m) return decodeURIComponent(m[1]).toLowerCase();
    m = href.match(/^\/(?:c|user)\/([^/?#]+)/);
    if (m) return decodeURIComponent(m[1]).toLowerCase();
    return null;
  }
  function isBlocked(handle, name) {
    if (handle) {
      if (BLOCK_EXACT.has(handle)) return true;
      for (const p of BLOCK_PREFIXES) if (handle.startsWith(p)) return true;
    }
    if (name) for (const re of BLOCK_NAME_PATTERNS) if (re.test(name)) return true;
    return false;
  }
  function findChannelLink(card) {
    return card.querySelector("ytd-channel-name a[href]")
        || card.querySelector("#channel-name a[href]")
        || card.querySelector('a[href^="/@"]')
        || card.querySelector('a[href^="/channel/"]')
        || card.querySelector('a[href^="/c/"]')
        || card.querySelector('a[href^="/user/"]');
  }
  function evaluate(card) {
    if (card.dataset[CHECKED]) return;
    const link = findChannelLink(card);
    if (!link) {
      const tries = (parseInt(card.dataset.antiuktvTries || "0", 10) || 0) + 1;
      card.dataset.antiuktvTries = String(tries);
      if (tries >= MAX_TRIES) card.dataset[CHECKED] = "1";
      return;
    }
    const handle = handleFromHref(link.getAttribute("href"));
    const name = (link.textContent || "").trim();
    card.dataset[CHECKED] = "1";
    if (isBlocked(handle, name)) card.classList.add("antiuktv-hidden");
  }
  function scan(root) {
    if (!enabled) return;
    for (const card of (root || document).querySelectorAll(CARD_SELECTOR)) evaluate(card);
  }
  let scheduled = false;
  function scheduleScan() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; scan(); });
  }
  function unhideAll() {
    for (const el of document.querySelectorAll(".antiuktv-hidden")) el.classList.remove("antiuktv-hidden");
    for (const el of document.querySelectorAll("[data-antiuktv-checked]")) {
      delete el.dataset[CHECKED]; delete el.dataset.antiuktvTries;
    }
  }
  try {
    chrome.storage?.sync.get({ enabled: true }, (res) => { enabled = res.enabled !== false; if (enabled) scan(); });
    chrome.storage?.onChanged.addListener((changes, area) => {
      if (area === "sync" && "enabled" in changes) {
        enabled = changes.enabled.newValue !== false;
        if (enabled) scan(); else unhideAll();
      }
    });
  } catch (_) {}
  new MutationObserver(scheduleScan).observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", scheduleScan);
  window.addEventListener("load", scheduleScan);
  window.addEventListener("yt-navigate-finish", scheduleScan);
  scheduleScan();
})();
