// Comprehensive test script for all 11 new slot games
// Tests: init, 10 spins, show_double, double, close, info
// Validates response structure, symbol consistency with bars, win calculations

const http = require("http");

const GAMES = [
  { port: 8085, slug: "book-of-winners", name: "Book of Winners" },
  { port: 8086, slug: "lucky-lady-glamour", name: "Lucky Lady Glamour" },
  { port: 8087, slug: "hearts", name: "Hearts" },
  { port: 8088, slug: "sevens-on-fire", name: "Sevens on Fire" },
  { port: 8089, slug: "triple-diamond", name: "Triple Diamond" },
  { port: 8090, slug: "pirates-fortune", name: "Pirates Fortune" },
  { port: 8091, slug: "roll-of-ramses", name: "Roll of Ramses" },
  { port: 8092, slug: "casino-world", name: "Casino World" },
  { port: 8093, slug: "nautilus", name: "Nautilus" },
  { port: 8094, slug: "king-of-jewels", name: "King of Jewels" },
  { port: 8095, slug: "mariner", name: "Mariner" },
];

function apiCall(port, func, par = {}) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      query: { 1: { func, par } },
      sid: "test-session",
    });
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path: "/gp2/app/",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`JSON parse error: ${data.substring(0, 200)}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("timeout"));
    });
    req.write(body);
    req.end();
  });
}

function fetchAsset(port, path) {
  return new Promise((resolve, reject) => {
    http
      .get(`http://127.0.0.1:${port}${path}`, (res) => {
        resolve(res.statusCode);
      })
      .on("error", reject);
  });
}

async function testGame(game) {
  const errors = [];
  const { port, slug, name } = game;

  // --- Test 1: Init ---
  let initData;
  try {
    const initResp = await apiCall(port, "init");
    if (!initResp.result || !initResp.result[0]) {
      errors.push("init: missing result[0]");
    } else {
      initData = initResp.result[0].data;
      const info = initResp.result[0].info;

      if (!initData.bars) errors.push("init: missing bars");
      if (!initData.win_table) errors.push("init: missing win_table");
      if (!initData.settings) errors.push("init: missing settings");
      if (typeof info.credit !== "number") errors.push("init: missing credit");
      if (typeof info.jackpot !== "number") errors.push("init: missing jackpot");

      // Validate bars structure
      const reelCount = Object.keys(initData.bars).length;
      if (reelCount !== 5) errors.push(`init: expected 5 reels, got ${reelCount}`);

      for (let r = 1; r <= reelCount; r++) {
        const reel = initData.bars[String(r)];
        if (!reel) {
          errors.push(`init: missing bars reel ${r}`);
          continue;
        }
        const len = Object.keys(reel).length;
        if (len < 10) errors.push(`init: reel ${r} too short (${len})`);
      }
    }
  } catch (e) {
    errors.push(`init: ${e.message}`);
    return { name, port, errors, spins: 0 };
  }

  // --- Test 2: 10 Spins ---
  let spinErrors = 0;
  let totalWins = 0;
  let spinCount = 0;

  for (let i = 0; i < 10; i++) {
    try {
      const spinResp = await apiCall(port, "start", {
        bet: 100,
        den: 1,
        lines: 20,
      });
      const data = spinResp.result[0].data;
      const info = spinResp.result[0].info;

      // Check required fields
      if (!data.symbols) {
        errors.push(`spin ${i + 1}: missing symbols`);
        spinErrors++;
        continue;
      }
      if (typeof data.win !== "number") {
        errors.push(`spin ${i + 1}: missing win`);
        spinErrors++;
        continue;
      }
      if (data.state !== "main") {
        errors.push(`spin ${i + 1}: state should be 'main', got '${data.state}'`);
      }
      if (data.free_count !== 0) {
        errors.push(`spin ${i + 1}: free_count should be 0, got ${data.free_count}`);
      }
      if (data.free_played !== 0) {
        errors.push(`spin ${i + 1}: free_played should be 0, got ${data.free_played}`);
      }
      if (data.bonus_symbol !== false) {
        errors.push(`spin ${i + 1}: bonus_symbol should be false, got ${data.bonus_symbol}`);
      }
      if (typeof info.credit !== "number") {
        errors.push(`spin ${i + 1}: missing credit in info`);
      }

      // Validate symbols structure: 5 reels, each with pos + rows 1,2,3
      const reelCount = Object.keys(initData.bars).length;
      for (let r = 1; r <= reelCount; r++) {
        const reel = data.symbols[String(r)];
        if (!reel) {
          errors.push(`spin ${i + 1}: missing symbols reel ${r}`);
          continue;
        }
        if (typeof reel.pos !== "number") {
          errors.push(`spin ${i + 1}: missing pos for reel ${r}`);
          continue;
        }

        // Validate symbols match bars at the given position
        const bars = initData.bars[String(r)];
        const barLen = Object.keys(bars).length;
        for (let row = 1; row <= 3; row++) {
          const sym = reel[String(row)];
          if (typeof sym !== "number") {
            errors.push(`spin ${i + 1}: reel ${r} row ${row} not a number`);
            continue;
          }
          const expectedPos = ((reel.pos + row - 2) % barLen) + 1;
          const expectedSym = bars[String(expectedPos)];
          if (sym !== expectedSym) {
            errors.push(
              `spin ${i + 1}: reel ${r} row ${row} symbol mismatch: got ${sym}, expected ${expectedSym} at bar pos ${expectedPos} (pos=${reel.pos}, barLen=${barLen})`
            );
          }
        }
      }

      // Validate win log
      if (data.win > 0) {
        if (!data.log || Object.keys(data.log).length === 0) {
          errors.push(`spin ${i + 1}: win=${data.win} but empty log`);
        } else {
          // Verify log entries
          let logWinSum = 0;
          for (const key of Object.keys(data.log)) {
            const entry = data.log[key];
            if (typeof entry.sym !== "number")
              errors.push(`spin ${i + 1}: log ${key} missing sym`);
            if (typeof entry.count !== "number")
              errors.push(`spin ${i + 1}: log ${key} missing count`);
            if (typeof entry.win !== "number")
              errors.push(`spin ${i + 1}: log ${key} missing win`);
            if (typeof entry.line !== "number")
              errors.push(`spin ${i + 1}: log ${key} missing line`);
            if (!entry.pos)
              errors.push(`spin ${i + 1}: log ${key} missing pos`);
            logWinSum += entry.win || 0;
          }
          if (logWinSum !== data.win) {
            errors.push(
              `spin ${i + 1}: log win sum ${logWinSum} != data.win ${data.win}`
            );
          }
        }
      } else {
        // No win - log should be empty
        if (data.log && Object.keys(data.log).length > 0) {
          errors.push(
            `spin ${i + 1}: win=0 but log has ${Object.keys(data.log).length} entries`
          );
        }
      }

      totalWins += data.win;
      spinCount++;
    } catch (e) {
      errors.push(`spin ${i + 1}: ${e.message}`);
      spinErrors++;
    }
  }

  // --- Test 3: Show Double (gamble) ---
  try {
    const showDbl = await apiCall(port, "show_double");
    const data = showDbl.result[0].data;
    if (data.state !== "double")
      errors.push(`show_double: state should be 'double', got '${data.state}'`);
    if (typeof data.win !== "number")
      errors.push("show_double: missing win");
  } catch (e) {
    errors.push(`show_double: ${e.message}`);
  }

  // --- Test 4: Double (color bet) ---
  try {
    const dbl = await apiCall(port, "double", { color: 1 });
    const data = dbl.result[0].data;
    if (data.state !== "double" && data.state !== "main")
      errors.push(`double: unexpected state '${data.state}'`);
    if (typeof data.card !== "number" || data.card < 1 || data.card > 4)
      errors.push(`double: invalid card ${data.card}`);
  } catch (e) {
    errors.push(`double: ${e.message}`);
  }

  // --- Test 5: Close ---
  try {
    const closeResp = await apiCall(port, "close");
    if (!closeResp.result || !closeResp.result[0])
      errors.push("close: missing result");
  } catch (e) {
    errors.push(`close: ${e.message}`);
  }

  // --- Test 6: Info ---
  try {
    const infoResp = await apiCall(port, "info");
    if (!infoResp.result || !infoResp.result[0])
      errors.push("info: missing result");
  } catch (e) {
    errors.push(`info: ${e.message}`);
  }

  // --- Test 7: Static assets ---
  try {
    const htmlStatus = await fetchAsset(port, "/");
    if (htmlStatus !== 200)
      errors.push(`asset /: status ${htmlStatus}`);

    const cssStatus = await fetchAsset(
      port,
      `/static/games/slots/${slug}/style/bars-styles.css`
    );
    if (cssStatus !== 200)
      errors.push(`asset bars-styles.css: status ${cssStatus}`);

    const resetStatus = await fetchAsset(
      port,
      "/static/resources/stylesheets/reset.css"
    );
    if (resetStatus !== 200)
      errors.push(`asset reset.css: status ${resetStatus}`);
  } catch (e) {
    errors.push(`assets: ${e.message}`);
  }

  return { name, port, errors, spins: spinCount, totalWins };
}

async function runAllTests() {
  console.log("=" .repeat(60));
  console.log("COMPREHENSIVE GAME TEST - All 11 New Games");
  console.log("=" .repeat(60));
  console.log("");

  let totalErrors = 0;
  let totalGames = 0;
  let failedGames = [];

  for (const game of GAMES) {
    process.stdout.write(`Testing ${game.name} (port ${game.port})... `);
    const result = await testGame(game);
    totalGames++;

    if (result.errors.length === 0) {
      console.log(
        `PASS (${result.spins} spins, totalWin=${result.totalWins})`
      );
    } else {
      console.log(`FAIL (${result.errors.length} errors)`);
      for (const err of result.errors) {
        console.log(`  ERROR: ${err}`);
      }
      totalErrors += result.errors.length;
      failedGames.push(result.name);
    }
  }

  console.log("");
  console.log("=" .repeat(60));
  console.log(
    `RESULTS: ${totalGames - failedGames.length}/${totalGames} games passed`
  );
  if (failedGames.length > 0) {
    console.log(`FAILED: ${failedGames.join(", ")}`);
  }
  console.log(`Total errors: ${totalErrors}`);
  console.log("=" .repeat(60));

  return totalErrors;
}

runAllTests().then((errors) => {
  process.exit(errors > 0 ? 1 : 0);
});
