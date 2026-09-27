import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure required environment variables for static export before importing ServerEnv
process.env.GAME_ENV = process.env.GAME_ENV || "prod";
process.env.GIT_COMMIT =
  process.env.GIT_COMMIT ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  "main";
process.env.DOMAIN = process.env.DOMAIN || "openfront.io";
process.env.TURNSTILE_SITE_KEY =
  process.env.TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

async function main() {
  const { renderHtmlContent } = await import("../src/server/RenderHtml");
  const staticIndexPath = path.join(__dirname, "../static/index.html");

  console.log("Rendering static/index.html for static deployment...");
  const rendered = await renderHtmlContent(staticIndexPath, {
    perServer: false,
  });

  await fs.writeFile(staticIndexPath, rendered, "utf-8");
  console.log("Successfully rendered static/index.html!");
}

main().catch((err) => {
  console.error("Failed to render static index:", err);
  process.exit(1);
});
