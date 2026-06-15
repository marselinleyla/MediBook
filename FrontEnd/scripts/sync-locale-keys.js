// Sync script — ensures fr and ar locale files have every key from the English source.
// Deep-merges English keys into existing French and Arabic translations (missing keys are added with English text).
const fs = require("fs");
const path = require("path");

const localesDir = path.join(__dirname, "../public/locales");
const en = JSON.parse(
  fs.readFileSync(path.join(localesDir, "en/translation.json"), "utf8")
);

function deepMerge(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else if (target[key] === undefined) {
      target[key] = source[key];
    }
  }
  return target;
}

for (const lng of ["fr", "ar"]) {
  const file = path.join(localesDir, lng, "translation.json");
  const current = JSON.parse(fs.readFileSync(file, "utf8"));
  const merged = deepMerge({ ...current }, en);
  fs.writeFileSync(file, JSON.stringify(merged, null, 2), "utf8");
  console.log("Synced", lng);
}
