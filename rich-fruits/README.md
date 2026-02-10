# Rich Fruits

5-reel, 20-payline browser slot game running locally with a mock API server.

## Requirements

- Node.js >= 16
- npm

## Quick Start

```bash
npm install
npm start          # starts Express on http://localhost:8080
```

Open `http://localhost:8080` in a modern browser (Chrome, Firefox, Edge).

## Project Structure

```
rich-fruits/
  index.html                 Entry point (served at /)
  server.js                  Express mock API server
  package.json               Dependencies & scripts
  mocks/                     Mock JSON responses
    init.json                Game initialization (settings, reels, win table)
    start.json               Spin result (fallback; server generates dynamic results)
    start_free.json          Free-spin result
    close.json               Close/collect winnings
    show_double.json         Enter gamble mode
    double.json              Gamble result
    info.json                Heartbeat / status update
    select_bonus_symbol.json Bonus symbol assignment
    jackpot-images.json      Jackpot celebration image mapping
  static/
    compressed_js/games/rich-fruits/js/
      8e51b4b435aacf5477e30763c88aea12.js   Game logic (de-minified)
    games/slots/rich-fruits/
      style/                 Game-specific CSS & images
    resources/
      fonts/                 MyriadPro web fonts
      images/                Shared UI sprites & backgrounds
      stylesheets/           Shared CSS (panels, options, reset)
    sounds/                  Audio assets (MP3)
```

## Mock API

The Express server (`server.js`) handles:

| Endpoint | Method | Purpose |
|---|---|---|
| `/gp2/app/` | POST | Main game API router (dispatches by `query.1.func`) |
| `/play/game_transfer/` | GET | Returns credit balance |
| `/play/api_error/` | POST | Error reporting (no-op) |

### Supported `func` values

| Function | Description |
|---|---|
| `init` | Game initialization - returns settings, win table, reel strips, credit |
| `start` | Spin - dynamic random results (~30% win rate) |
| `start_free` | Free spin |
| `close` | Close/collect winnings |
| `show_double` | Enter gamble (double-or-nothing) mode |
| `double` | Make gamble choice (color or suit) |
| `select_bonus_symbol` | Select bonus symbol |
| `info` | Periodic heartbeat/status |

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Launch dev server on port 8080 |
| `npm run format` | Run js-beautify + prettier on all source files |

## Known Limitations

- **Missing font**: `MyriadPro-Cond.woff` is referenced in CSS but only `MyriadPro-BoldCond` and `MyriadPro-Regular` exist on disk. Some text may fall back to Tahoma.
- **Missing jackpot images**: `jp_1.png`, `jp_2.png`, `jp_3.png` referenced in CSS are not present. Jackpot panel backgrounds will be blank.
- **OGG audio missing**: HTML references `.ogg` format but only `.mp3` files exist. Browsers that don't support MP3 won't have audio.
- **Cross-game gamble assets**: `bars-styles.css` references images from `gates-of-avalon`, `book-of-winners`, `scatter-wins`, and `golden-harvest` sibling game directories. These must exist alongside `rich-fruits` under `static/games/slots/` for gamble-mode backgrounds to render.
- **Mock API is simplified**: Spin results use basic random generation. Win amounts, free spins, and gamble logic are approximations of the real server.
- **Obfuscated variable names**: The JS is de-minified but variable names remain obfuscated (e.g., `bf`, `fe`, `Lc`). Section comments identify major code areas.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Blank screen | Check browser console for 404 errors. Ensure `npm start` is running. |
| "Error loading" alert | An image asset failed to load. Check Network tab for the failing URL. |
| No sound | Click "Yes" on the sound prompt. Check that MP3 files exist in `static/sounds/`. |
| Reels don't spin | Open Console - look for API errors. Ensure `/gp2/app/` returns valid JSON. |
| Gamble backgrounds missing | Sibling game directories needed under `static/games/slots/`. |
