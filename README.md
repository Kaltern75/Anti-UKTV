# AntiUKTV

A lightweight Chrome/Edge extension that **hides BBC, ITV and Channel 4 channels from YouTube** - the home feed, search results, the watch-page sidebar, recommendations, and featured shelves. It works independently of YouTube''s own "Don''t recommend channel" option, and it can''t be overridden by the algorithm.

## Why

UK public-service broadcasters (BBC, ITV, Channel 4) are being given increasing **mandatory prominence** on connected-TV and streaming platforms. The concern that motivated this project: if YouTube is required to *promote* terrestrial channels, ordinary viewers may lose the ability to simply hide or de-prioritise them. This will adversly affect UK content creators from growing their OWN channels, and also push down channels that might otherwise provide more... balanced news reporting.

AntiUKTV sidesteps that entirely. It filters by **channel identity**, not by ranking or position - so it doesn''t matter how high the algorithm pushes a BBC/ITV/C4 video, or which shelf it''s placed in: if the card belongs to one of those broadcasters, it''s removed before you see it.

This is a personal tool for curating your own feed. It is not affiliated with, or endorsed by, YouTube, Google, or any broadcaster.

## What it hides

- Any channel whose handle starts with `bbc`, `itv`, `channel4`, `all4`, or `4od` (auto-catches new sub-channels).
- Any card or shelf whose channel byline/header matches those broadcasters by name.
- Entire featured **shelves / rows** headed by a blocked broadcaster.

It deliberately leaves alone third-party channels that merely re-broadcast clips, unless you add them yourself.

## How it works

Every YouTube card carries a channel link such as `/@BBCNews`. A content script reads that handle (and the visible name as a fallback) and adds a `display:none` class to any matching card or shelf. A `MutationObserver` keeps it working as YouTube lazy-loads content and navigates between pages.

## Install (unpacked)

1. Download this repo: **Code → Download ZIP**, then unzip it (or `git clone`).
2. Open `chrome://extensions` (or `edge://extensions`).
3. Turn on **Developer mode** (top-right).
4. Click **Load unpacked** and select the `AntiUKTV` folder.
5. Open YouTube - BBC / ITV / Channel 4 content is gone. Use the toolbar icon to toggle it on/off.

## Tuning what gets hidden

All rules are at the top of `content.js`:

- **`BLOCK_PREFIXES`** - handle prefixes to hide (`bbc`, `itv`, `channel4`, `all4`, `4od`).
- **`BLOCK_EXACT`** - exact handles for show channels with no obvious brand token (e.g. `gogglebox`, `hollyoaks`, `loveisland`). Add as you spot them.
- **`BLOCK_NAME_PATTERNS`** - name matches for cards that use a `/channel/UC...` link instead of a `/@handle`.

After editing, click the reload icon on the extension card in `chrome://extensions`.

## Known limitations

- **Shorts** on the home shelf often don''t expose a channel byline, so they can''t always be filtered by channel.
- The currently-playing video isn''t blocked - only feeds, search, recommendations and shelves are filtered.
- If YouTube ever ships an unusual DOM structure for a mandated "prominence" unit, a selector may need adding - open an issue with a screenshot.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | MV3 manifest |
| `content.js` | Detection + hiding logic (edit the blocklist here) |
| `hide.css` | The single `display:none` rule |
| `popup.html` / `popup.js` | Toolbar on/off toggle |
| `icons/` | Extension icons |

## License

MIT
