import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const folder = process.argv[2];

if (!folder) {
  console.error("Usage: node fix-mp4-faststart.mjs <folder>");
  process.exit(1);
}

const files = fs.readdirSync(folder).filter((f) => f.toLowerCase().endsWith(".mp4"));

for (const file of files) {
  const fullPath = path.join(folder, file);

  let trace = "";

  try {
    execSync(`ffprobe -v trace "${fullPath}"`, { stdio: ["ignore", "pipe", "pipe"] });
  } catch (err) {
    // ffprobe -v trace writes to stderr and exits non-zero even on success,
    // so grab the output from the error object instead
    trace = (err.stdout?.toString() || "") + (err.stderr?.toString() || "");
  }

  const moovIndex = trace.indexOf("'moov'");
  const mdatIndex = trace.indexOf("'mdat'");

  const needsFix = moovIndex === -1 || mdatIndex === -1 || mdatIndex < moovIndex;

  if (needsFix) {
    console.log(`Fixing: ${file}`);
    const tempPath = fullPath.replace(".mp4", ".fixed.mp4");
    execSync(`ffmpeg -y -i "${fullPath}" -c copy -movflags +faststart "${tempPath}"`);
    fs.unlinkSync(fullPath);
    fs.renameSync(tempPath, fullPath);
  } else {
    console.log(`OK: ${file}`);
  }
}

console.log("Done.");