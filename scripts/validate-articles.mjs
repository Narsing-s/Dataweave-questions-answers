import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "docs", "DATAWEAVE-PRACTICE-MADE-EASY.md");
const outDir = path.join(root, "articles");
fs.mkdirSync(outDir, { recursive: true });

if (!fs.existsSync(src)) throw new Error("Missing source article: " + src);

const html = fs.readFileSync(path.join(outDir, "dataweave-practice-made-easy.html"), "utf8");
if (!html.includes("<!doctype html>")) throw new Error("Article HTML is missing a valid document.");
console.log("Validated article:", path.relative(root, path.join(outDir, "dataweave-practice-made-easy.html")));
