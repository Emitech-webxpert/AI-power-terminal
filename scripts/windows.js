const fs = require("fs");
const path = require("path");

const allowedExtensions = [".exe", ".zip"];

const cleanDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) return;

  const entries = fs.readdirSync(dirPath);
  for (const entry of entries) {
    const entryPath = path.join(dirPath, entry);
    const stat = fs.statSync(entryPath);

    if (stat.isDirectory()) {
      fs.rmSync(entryPath, { recursive: true, force: true });
    } else if (
      stat.isFile() &&
      !allowedExtensions.includes(path.extname(entry))
    ) {
      fs.unlinkSync(entryPath);
    }
  }
};

cleanDirectory(path.resolve("build", "windows"));
