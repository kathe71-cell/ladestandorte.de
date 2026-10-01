
const ssr = await import("../dist-ssr/entry-server.js");

const testUrls = [
  "/rechner",
  "/rechner?mode=estimate",
  "/rechner?mode=theoretical",
  "/rechner?capacity=75&kw=150&start=0&end=80&price=0.49",
  "/rechner?capacity=75&kw=150&start=0&end=80&price=0.49&mode=theoretical",
  "/rechner?capacity=75&kw=150&start=0&end=80&price=0.49&mode=estimate",
  "/rechner?capacity=abc&kw=0&start=90&end=20&price=-1&mode=xyz",
  "/rechner?mode=theoretical&capacity=999999",
  "/rechner?mode=invalid",
  "/rechner?vehicle=kia-ev6-long-range",
  "/rechner?vehicle=invalid-vehicle-slug",
  "/rechner?capacity=75&kw=149&start=0&end=80&price=0.49",
  "/rechner?capacity=75&kw=150&start=0&end=80&price=0.49",
  "/rechner?capacity=75&kw=151&start=0&end=80&price=0.49"
];

console.log("=== CALCULATOR DUAL-MODE REGRESSION TEST (SSR BUNDLE) ===");
let passed = 0;

for (const url of testUrls) {
  try {
    const res = ssr.render(url);
    if (!res || !res.html || res.html.length < 500) {
      console.error("[FAIL] Empty HTML for:", url);
    } else {
      console.log("[PASS] URL:", url, "-> HTML Length:", res.html.length);
      passed++;
    }
  } catch (err) {
    console.error("[CRASH] URL:", url, "-> Error:", err.message);
  }
}

// Detailed Numerical Assertions
console.log("\n=== SPECIFIC NUMERICAL & CONSISTENCY ASSERTIONS ===");

const cleanText = (html) => html.replace(/<!--[\s\S]*?-->/g, "");

// 1. Manual mode estimate: 75 kWh, 150 kW, 0->80%, 0.49 €
const resEstimate150 = ssr.render("/rechner?capacity=75&kw=150&start=0&end=80&price=0.49");
const textEstimate150 = cleanText(resEstimate150.html);

if (
  textEstimate150.includes("31,16 €") &&
  textEstimate150.includes("33 min") &&
  textEstimate150.includes("60,0 kWh") &&
  textEstimate150.includes("63,6 kWh") &&
  textEstimate150.includes("~ 114 kW")
) {
  console.log("[PASS] Manual mode at 150 kW: 31,16 €, 33 min, 60,0 kWh, 63,6 kWh, ~114 kW eff (0.76 factor) verified.");
} else {
  console.error("[FAIL] Manual mode at 150 kW numerical check failed! Text excerpt:", textEstimate150.slice(0, 1000));
  process.exit(1);
}

// 2. Manual mode theoretical: 75 kWh, 150 kW, 0->80%, 0.49 €
const resTheor150 = ssr.render("/rechner?capacity=75&kw=150&start=0&end=80&price=0.49&mode=theoretical");
const textTheor150 = cleanText(resTheor150.html);

if (
  textTheor150.includes("29,40 €") &&
  textTheor150.includes("24 min") &&
  textTheor150.includes("60,0 kWh")
) {
  console.log("[PASS] Theoretical mode at 150 kW: 29,40 €, 24 min, 60,0 kWh verified.");
} else {
  console.error("[FAIL] Theoretical mode at 150 kW numerical check failed!");
  process.exit(1);
}

// 3. Monotonicity around 150 kW: 149 kW, 150 kW, 151 kW
const res149 = ssr.render("/rechner?capacity=75&kw=149&start=0&end=80&price=0.49");
const res151 = ssr.render("/rechner?capacity=75&kw=151&start=0&end=80&price=0.49");

const parseDurationToMinutes = (html) => {
  const text = cleanText(html);
  const m = text.match(/Geschätzte Ladedauer:<\/span><\/div><span [^>]*>([^<]+)<\/span>/);
  if (!m) return null;
  const raw = m[1].trim();
  if (raw.includes("h")) {
    const parts = raw.split("h");
    const hours = parseInt(parts[0], 10);
    const mins = parseInt(parts[1].replace("m", ""), 10) || 0;
    return hours * 60 + mins;
  }
  return parseInt(raw.replace("min", "").trim(), 10);
};

const min149 = parseDurationToMinutes(res149.html);
const min150 = parseDurationToMinutes(resEstimate150.html);
const min151 = parseDurationToMinutes(res151.html);

console.log(`[INFO] Charging duration at 149 kW: ${min149} min | 150 kW: ${min150} min | 151 kW: ${min151} min`);

if (min149 >= min150 && min150 >= min151) {
  console.log("[PASS] Strict monotonicity holds: min(149 kW) >= min(150 kW) >= min(151 kW).");
} else {
  console.error(`[FAIL] Monotonicity broken! 149kW: ${min149}, 150kW: ${min150}, 151kW: ${min151}`);
  process.exit(1);
}

// 4. Default vehicle is unset in manual mode
if (resEstimate150.html.includes('<option value="" selected') || !resEstimate150.html.includes('value="tesla-model-y-lr" selected')) {
  console.log("[PASS] Neutral manual mode confirmed (Tesla Model Y is not silently preselected).");
} else {
  console.error("[FAIL] Default vehicle was still preselected in manual mode!");
  process.exit(1);
}

// 5. 800V Vehicle preset applies 0.82 factor
const resKia = ssr.render("/rechner?vehicle=kia-ev6-long-range&kw=240&start=10&end=80&price=0.49");
if (resKia.html.includes("800V System")) {
  console.log("[PASS] Explicit 800V preset recognised and marked with 800V System badge.");
} else {
  console.error("[FAIL] Kia EV6 800V badge missing!");
  process.exit(1);
}

if (passed === testUrls.length) {
  console.log("\n=> ALL " + passed + " URL TESTS & NUMERICAL ASSERTIONS PASSED.");
  process.exit(0);
} else {
  console.error("\n=> REGRESSION FAILED.");
  process.exit(1);
}

