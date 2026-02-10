# JSON Game Local

Browser slot games running locally with Express mock API servers. No external backend needed.

## Games

| Game | Port | Folder |
|------|------|--------|
| Rich Fruits | 8080 | `rich-fruits/` |
| Hot Sevens | 8081 | `hot-sevens/` |
| Tropical Fruits | 8082 | `tropical-fruit/` |
| Fire Rage | 8083 | `fire-rage/` |
| Hot Slot | 8084 | `hot-slot/` |

## Requirements

- Node.js >= 16
- npm

## Quick Start

```bash
# Pick any game folder
cd hot-sevens
npm install
node server.js
```

Open `http://localhost:8081` in a modern browser (Chrome, Firefox, Edge).

## Project Structure

Each game folder has the same layout:

```
game-name/
  index.html          Entry point (served at /)
  server.js           Express mock API server
  package.json        Dependencies & scripts
  mocks/              Mock JSON responses
    init.json          Game config (settings, reels, win table)
    start.json         Spin result template
    start_free.json    Free-spin result
    close.json         Close/collect winnings
    show_double.json   Enter gamble mode
    double.json        Gamble result
    info.json          Status update
    select_bonus_symbol.json   Bonus symbol
    jackpot-images.json        Jackpot celebration images
  static/
    compressed_js/     Game JavaScript bundle
    games/slots/       Game-specific CSS, images, gamble assets
    resources/         Shared UI sprites, fonts, stylesheets
```

## Mock API

Each Express server handles all game functions at `POST /gp2/app/`:

| Function | Description |
|----------|-------------|
| `init` | Game initialization - settings, win table, reel strips, credit |
| `start` | Spin - random symbol generation, 20-payline win detection |
| `start_free` | Free spin result |
| `close` | Close/collect winnings |
| `show_double` | Enter gamble mode |
| `double` | Gamble choice - color (2x) or suit (4x) |
| `select_bonus_symbol` | Select bonus symbol |
| `info` | Periodic status/heartbeat |

### Game Features

- 5 reels, 3 rows, 20 paylines
- 8 symbols per game (including scatter)
- Symbol 7 wins with 2+ matches; all others need 3+
- Gamble/Double feature with color and suit guesses
- Credit tracking across spins
- Dynamic jackpot and bonus values

## Running Multiple Games

Start each game on its own port:

```bash
# Terminal 1
cd rich-fruits && npm install && node server.js

# Terminal 2
cd hot-sevens && npm install && node server.js

# Terminal 3
cd tropical-fruit && npm install && node server.js

# Terminal 4
cd fire-rage && npm install && node server.js

# Terminal 5
cd hot-slot && npm install && node server.js
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Blank screen | Check browser console for errors. Make sure `node server.js` is running. |
| "Error loading" alert | An image asset failed to load. Check Network tab for the 404 URL. |
| No sound | Click "Yes" on the sound prompt. MP3 files must exist in the sounds folder. |
| Reels don't spin | Check console for API errors. Ensure `/gp2/app/` returns valid JSON. |
| Port already in use | Another instance is running. Kill it or change the PORT in server.js. |

## Known Limitations

- Scatter wins are intentionally disabled to prevent client-side crashes (bonus/free-spin flow not mocked)
- OGG audio fallbacks not included (MP3 only - works in all modern browsers)
- Some cosmetic panel images (jackpot animation frames, options panel patterns) are missing
- Variable names in game JS remain obfuscated from the original minified source
