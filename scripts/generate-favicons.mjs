import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const source = path.join(__dirname, "favicon-source.png");

const appDir = path.join(root, "src", "app");
const publicDir = path.join(root, "public");

async function main() {
  const input = fs.readFileSync(source);

  const png16 = await sharp(input).resize(16, 16).png().toBuffer();
  const png32 = await sharp(input).resize(32, 32).png().toBuffer();
  const png48 = await sharp(input).resize(48, 48).png().toBuffer();

  const ico = await toIco([png16, png32, png48]);
  fs.writeFileSync(path.join(appDir, "favicon.ico"), ico);
  fs.writeFileSync(path.join(publicDir, "favicon.ico"), ico);

  await sharp(input).resize(512, 512).png().toFile(path.join(appDir, "icon.png"));
  await sharp(input)
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, "apple-icon.png"));

  await sharp(input).resize(192, 192).png().toFile(path.join(publicDir, "icon-192.png"));
  await sharp(input).resize(512, 512).png().toFile(path.join(publicDir, "icon-512.png"));

  console.log("Favicons generated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
