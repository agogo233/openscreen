// electron-builder beforePack hook: ensure the auto-caption assets (Whisper model + ORT wasm) exist
// before packaging, so the `caption-assets` extraResources entry has something to copy. Runs on
// every package invocation (local `npm run build:*` and CI's bare `electron-builder`). The fetch
// script is idempotent, so it's a no-op once the assets are present.
//
// Note: Download failures are non-fatal (e.g., HuggingFace 429 rate limits) — the app will
// fallback to CDN loading at runtime. We log warnings but don't block the build.

const { execFileSync } = require("node:child_process");
const path = require("node:path");

exports.default = async function beforePack() {
	try {
		execFileSync("node", [path.join(__dirname, "fetch-caption-model.mjs")], {
			stdio: "inherit",
			cwd: path.join(__dirname, ".."),
		});
	} catch (error) {
		console.warn("⚠️  Caption assets download failed (non-fatal):", error.message);
		console.warn("   The app will fallback to CDN loading at runtime.");
		console.warn("   See scripts/fetch-caption-model.mjs for details.");
	}
};
