// Extract script — scans all JSX/JS source files and prints every i18n key used in t() calls.
// Useful for auditing which translation keys are actually referenced.
const fs = require("fs");
const path = require("path");
const src = path.join(__dirname, "../src");
const keys = new Set();
function walk(d) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.jsx?$/.test(f.name)) {
      const c = fs.readFileSync(p, "utf8");
      const re = /t\(["']([^"']+)["']/g;
      let m;
      while ((m = re.exec(c))) keys.add(m[1]);
    }
  }
}
walk(src);
console.log([...keys].sort().join("\n"));
