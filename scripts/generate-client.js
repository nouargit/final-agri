import fs from "fs";
import path from "path";
import https from "https";
import { execa } from "execa";

const SPEC_URL = "https://template-lemon-nine.vercel.app/api/spec.json"; // ضع رابط صديقك
const SPEC_PATH = path.resolve("./spec.json");

console.log("→ Downloading spec...");

const downloadSpec = () =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(SPEC_PATH);
    https
      .get(SPEC_URL, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download spec: ${res.statusCode}`));
        }
        res.pipe(file);
        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", reject);
  });

(async () => {
  await downloadSpec();
  console.log("✓ Downloaded spec.json");

  console.log("→ Generating client...");
  await execa("npx", ["openapi-codegen", "generate"], { stdio: "inherit" });

  console.log("✓ Client generated successfully");
})();
