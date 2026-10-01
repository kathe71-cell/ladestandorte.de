
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
  "/rechner?mode=invalid"
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

if (passed === testUrls.length) {
  console.log("\n=> ALL " + passed + " TEST CASES PASSED WITHOUT CRASH.");
  process.exit(0);
} else {
  console.error("\n=> REGRESSION FAILED.");
  process.exit(1);
}
