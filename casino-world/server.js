const express = require("express");
const path = require("path");
const app = express();
const PORT = 8092;

// Track game state across requests
let credit = 100000;
let doubleWin = 0; // Current win amount being gambled
let doubleStep = 0; // Gamble step counter (max 5)
let doubleHist = []; // Card history for current gamble session

// Parse request bodies
// The game sends JSON as raw text with Content-Type: application/x-www-form-urlencoded
// so we capture the raw body first, then try to JSON.parse it
app.use(express.json());
app.use(express.text({ type: "application/x-www-form-urlencoded" }));

// Serve static files - mount at /static/ to match game's path expectations
app.use("/static", express.static(path.join(__dirname, "static")));
// Also serve from root for index.html and other root-level files
app.use(express.static(__dirname));

// Preloader compatibility: the JS preloader (ja function) strips all "../" from
// CSS url() paths and resolves them from host root. So url("../images/foo.png")
// in a CSS file at /static/resources/stylesheets/ becomes /images/foo.png.
// These routes serve images at the preloader-resolved paths.
app.use(
  "/images",
  express.static(path.join(__dirname, "static/resources/images"))
);
app.use(
  "/images",
  express.static(
    path.join(__dirname, "static/games/slots/casino-world/style/images")
  )
);

// Load mock response templates
const initResponse = require("./mocks/init.json");
const startFreeResponse = require("./mocks/start_free.json");
const showDoubleResponse = require("./mocks/show_double.json");
const closeResponse = require("./mocks/close.json");
const infoResponse = require("./mocks/info.json");
const selectBonusResponse = require("./mocks/select_bonus_symbol.json");

// Load bars (reel strips) from init.json for consistent symbol generation
const BARS = initResponse.result[0].data.bars;

// Main game API endpoint - all game functions POST here
app.post("/gp2/app/", (req, res) => {
  let body = req.body;

  // The game sends JSON.stringify({query:..., sid:...}) as raw text
  // with Content-Type: application/x-www-form-urlencoded
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (e) {
      console.log("[API] Failed to parse body string:", body.substring(0, 200));
    }
  }

  // Fallback: if urlencoded parser mangled it into {jsonString: ''}
  if (body && typeof body === "object" && !body.query) {
    const keys = Object.keys(body);
    if (keys.length >= 1) {
      try {
        body = JSON.parse(keys[0]);
      } catch (e) {
        // ignore
      }
    }
  }

  const query = (body && body.query) || {};
  const funcData = query["1"] || {};
  const func = funcData.func;
  const params = funcData.par;

  console.log(`[API] func=${func}`, params ? JSON.stringify(params) : "");

  switch (func) {
    case "init":
      // Return fresh init response with current credit
      const initResp = JSON.parse(JSON.stringify(initResponse));
      initResp.result[0].info.credit = credit;
      return res.json(initResp);

    case "start":
      return res.json(generateSpinResponse(params));

    case "start_free": {
      const freeResp = JSON.parse(JSON.stringify(startFreeResponse));
      freeResp.result[0].info.credit = credit;
      return res.json(freeResp);
    }

    case "show_double": {
      // Enter gamble mode - initialize gamble state from last spin win
      doubleStep = 0;
      doubleHist = [];
      // doubleWin was set by generateSpinResponse()
      return res.json({
        result: [
          {
            data: {
              state: "double",
              card: 0,
              win: doubleWin,
              double: { step: 0 },
              double_hist: [],
            },
            info: {
              credit: credit,
              jackpot: 1500000 + Math.floor(Math.random() * 5000),
              bonus: 500000 + Math.floor(Math.random() * 2000),
              min_bet_jackpot: 2000,
              min_bet_bonus: 1000,
            },
          },
        ],
      });
    }

    case "double":
      return res.json(generateDoubleResponse(params));

    case "close": {
      const closeResp = JSON.parse(JSON.stringify(closeResponse));
      closeResp.result[0].info.credit = credit;
      return res.json(closeResp);
    }

    case "info": {
      const infoResp = JSON.parse(JSON.stringify(infoResponse));
      infoResp.result[0].info.credit = credit;
      infoResp.result[0].info.jackpot += Math.floor(Math.random() * 1000);
      infoResp.result[0].info.bonus += Math.floor(Math.random() * 500);
      return res.json(infoResp);
    }

    case "select_bonus_symbol": {
      const bonusResp = JSON.parse(JSON.stringify(selectBonusResponse));
      bonusResp.result[0].info.credit = credit;
      return res.json(bonusResp);
    }

    default:
      console.log("[API] Unknown func:", func, "body:", JSON.stringify(body));
      return res.json({ result: [{ data: {}, info: { credit: credit } }] });
  }
});

// Game transfer endpoint
app.get("/play/game_transfer/", (req, res) => {
  res.json({
    result: [{ data: {}, info: { credit: credit } }],
  });
});

// Error reporting endpoint - just acknowledge
app.post("/play/api_error/", (req, res) => {
  console.log("[API] Error report:", req.body);
  res.json({ status: "ok" });
});

// Jackpot images JSON - the game fetches this for the jackpot celebration
app.get("/static/resources/images/jackpot/j-ims.json", (req, res) => {
  res.json(require("./mocks/jackpot-images.json"));
});

// Menu redirect - game calls this when clicking MENU button
app.get("/menu/", (req, res) => {
  res.redirect("/");
});

// 20 payline definitions: each array = [reel1_row, reel2_row, reel3_row, reel4_row, reel5_row]
// Row 1=top, 2=middle, 3=bottom
const PAYLINES = [
  [2, 2, 2, 2, 2], // line 1  - middle
  [1, 1, 1, 1, 1], // line 2  - top
  [3, 3, 3, 3, 3], // line 3  - bottom
  [1, 2, 3, 2, 1], // line 4  - V down
  [3, 2, 1, 2, 3], // line 5  - V up
  [2, 1, 1, 1, 2], // line 6
  [2, 3, 3, 3, 2], // line 7
  [1, 1, 2, 3, 3], // line 8
  [3, 3, 2, 1, 1], // line 9
  [2, 1, 2, 3, 3], // line 10
  [2, 3, 2, 3, 2], // line 11
  [2, 1, 2, 1, 2], // line 12
  [1, 2, 1, 2, 1], // line 13
  [3, 2, 3, 2, 3], // line 14
  [2, 2, 1, 2, 2], // line 15
  [2, 2, 3, 2, 2], // line 16
  [1, 1, 2, 1, 1], // line 17
  [3, 3, 2, 3, 3], // line 18
  [1, 2, 2, 2, 1], // line 19
  [3, 2, 2, 2, 3], // line 20
];

// Win table: multipliers per symbol per match count
// Symbol 1 = joker (wild) - excluded from line wins
// Symbol 13 = scatter - excluded from line wins
const WIN_TABLE = {
  2: { 2: 2, 3: 30, 4: 120, 5: 800 },
  3: { 2: 2, 3: 30, 4: 120, 5: 800 },
  4: { 3: 20, 4: 100, 5: 400 },
  5: { 3: 20, 4: 70, 5: 250 },
  6: { 3: 20, 4: 70, 5: 250 },
  7: { 3: 10, 4: 50, 5: 120 },
  8: { 3: 10, 4: 50, 5: 120 },
  9: { 3: 4, 4: 30, 5: 100 },
  10: { 3: 4, 4: 30, 5: 100 },
  11: { 3: 4, 4: 30, 5: 100 },
  12: { 2: 2, 3: 4, 4: 30, 5: 100 },
};

const SCATTER_SYMBOL = 13; // scatter
const SPECIAL_SYMBOLS = [1, 13]; // joker + scatter: max 1 per column

// Helper: get symbol from bars at position (1-based, wraps around reel strip length)
function getBarSymbol(reel, position) {
  const reelBars = BARS[String(reel)];
  const barLen = Object.keys(reelBars).length;
  const wrappedPos = ((position - 1) % barLen) + 1;
  return reelBars[String(wrappedPos)];
}

// Generate randomized spin result
function generateSpinResponse(params) {
  const bet = (params && params.bet) || 100;
  const den = (params && params.den) || 1;
  const lines = (params && params.lines) || 20;

  // Deduct bet from credit
  credit -= bet * lines;
  if (credit < 0) credit = 100000; // Reset if broke

  // Generate symbols by picking random positions on the reel strips (bars)
  // This ensures symbols are consistent with pos and bars data
  const symbols = {};
  for (let reel = 1; reel <= 5; reel++) {
    const reelBars = BARS[String(reel)];
    const barLen = Object.keys(reelBars).length;
    const pos = Math.floor(Math.random() * barLen) + 1;
    symbols[reel] = { pos: pos };
    for (let row = 1; row <= 3; row++) {
      symbols[reel][row] = getBarSymbol(reel, pos + row - 1);
    }
  }

  let totalWin = 0;
  const log = {};
  let logIndex = 1;

  // --- Check line wins (left-to-right matching on each payline) ---
  for (let lineIdx = 0; lineIdx < lines && lineIdx < PAYLINES.length; lineIdx++) {
    const payline = PAYLINES[lineIdx];
    const firstSym = symbols[1][payline[0]];

    // Skip scatter/joker symbol - scatter wins are checked separately
    if (firstSym === SCATTER_SYMBOL) continue;
    if (firstSym === 1) continue; // skip joker-only leads

    // Count consecutive matching symbols from left
    let matchCount = 1;
    for (let reel = 2; reel <= 5; reel++) {
      if (symbols[reel][payline[reel - 1]] === firstSym) {
        matchCount++;
      } else {
        break;
      }
    }

    // Check if this match count has a payout
    const payout = WIN_TABLE[firstSym] && WIN_TABLE[firstSym][matchCount];
    if (payout) {
      const lineWin = Math.floor(payout * bet);
      totalWin += lineWin;

      // Build position map for this line win
      const pos = {};
      for (let r = 1; r <= matchCount; r++) {
        pos[r] = {};
        pos[r][payline[r - 1]] = true;
      }

      log[String(logIndex)] = {
        id: 1, // 1 = line win
        sym: firstSym,
        count: matchCount,
        win: lineWin,
        line: lineIdx + 1,
        free: 0,
        lines: 1,
        pos: pos,
      };
      logIndex++;
    }
  }

  // NOTE: Scatter wins (id=3) are intentionally NOT generated here.
  // Scatter wins trigger the bonus/free-spin animation which requires
  // bonus_symbol (sd) to be set. Since our mock doesn't support the
  // bonus/free-spin feature, generating scatter wins would crash the
  // client's Rg() function (E[sd].height where sd=false -> TypeError).

  credit += totalWin;

  // Store win for potential gamble session
  doubleWin = totalWin;
  doubleStep = 0;
  doubleHist = [];

  return {
    result: [
      {
        data: {
          symbols: symbols,
          win: totalWin,
          state: "main",
          log: log,
          card: 0,
          double: { step: 0 },
          double_hist: [],
        },
        info: {
          credit: credit,
          jackpot: 1500000 + Math.floor(Math.random() * 10000),
          bonus: 500000 + Math.floor(Math.random() * 5000),
          min_bet_jackpot: 2000,
          min_bet_bonus: 1000,
        },
      },
    ],
  };
}

// Generate gamble/double result
function generateDoubleResponse(params) {
  const card = Math.floor(Math.random() * 4) + 1; // 1=spades, 2=clubs, 3=hearts, 4=diamonds
  let isWin = false;

  if (params) {
    if (params.color) {
      // Color gamble: 1=red(hearts+diamonds), 2=black(spades+clubs)
      const isRed = card === 3 || card === 4;
      isWin = (params.color === 1 && isRed) || (params.color === 2 && !isRed);
    } else if (params.suit) {
      // Suit gamble: exact match
      isWin = params.suit === card;
    }
  } else {
    isWin = Math.random() < 0.5;
  }

  // Add card to history
  doubleHist.push(card);

  if (isWin) {
    // Win: double (color) or quadruple (suit) the gamble amount
    const prevWin = doubleWin;
    if (params && params.suit) {
      doubleWin *= 4;
      credit += prevWin * 3; // Add the extra 3x to credit
    } else {
      doubleWin *= 2;
      credit += prevWin; // Add the extra 1x to credit
    }
    doubleStep++;
  } else {
    // Loss: lose the gambled amount
    credit -= doubleWin;
    doubleWin = 0;
    doubleStep = 0;
  }

  console.log(
    `[API] double: card=${card}, ${isWin ? "WIN" : "LOSS"}, doubleWin=${doubleWin}, step=${doubleStep}, hist=[${doubleHist}]`
  );

  return {
    result: [
      {
        data: {
          state: isWin ? "double" : "main",
          card: card,
          win: doubleWin,
          double: { step: isWin ? doubleStep : 0 },
          double_hist: doubleHist,
        },
        info: {
          credit: credit,
          jackpot: 1500000 + Math.floor(Math.random() * 5000),
          bonus: 500000 + Math.floor(Math.random() * 2000),
          min_bet_jackpot: 2000,
          min_bet_bonus: 1000,
        },
      },
    ],
  };
}

app.listen(PORT, () => {
  console.log(`\n  Casino World running at http://localhost:${PORT}\n`);
  console.log("  Press Ctrl+C to stop.\n");
});
