// fix-vtt.js
import fs from "fs";

const filePath = process.argv[2];

if (!filePath) {
  console.error("Usage: node fix-vtt.js path/to/file.vtt");
  process.exit(1);
}

const content = fs.readFileSync(filePath, "utf-8");
const blocks = content.split(/\r?\n\r?\n/);

const fixed = blocks
  .map((block) => {
    const lines = block.split(/\r?\n/);

    // First line is either "WEBVTT" or a timing line like "00:00:01.000 --> 00:00:04.000"
    if (lines[0] === "WEBVTT" || lines.length === 0) {
      return block;
    }

    const timingLineIndex = lines.findIndex((l) => l.includes("-->"));

    if (timingLineIndex === -1) {
      return block; // not a cue block, leave as-is
    }

    const header = lines.slice(0, timingLineIndex + 1);
    const textLines = lines.slice(timingLineIndex + 1);

    const joinedText = textLines.join(" ").trim();

    return [...header, joinedText].join("\n");
  })
  .join("\n\n");

fs.writeFileSync(filePath, fixed, "utf-8");
console.log(`Fixed: ${filePath}`);