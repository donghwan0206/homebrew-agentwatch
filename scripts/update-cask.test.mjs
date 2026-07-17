import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const directory = await mkdtemp(join(tmpdir(), "agentwatch-cask-test-"));
const caskPath = join(directory, "agentwatch.rb");
const archive = "agentwatch-test-dmg";
const expectedSha = createHash("sha256").update(archive).digest("hex");
const assetUrl = `data:application/octet-stream;base64,${Buffer.from(archive).toString("base64")}`;
const release = {
  tag_name: "v9.8.7",
  assets: [{
    name: "AgentWatch_9.8.7_aarch64.dmg",
    browser_download_url: assetUrl,
  }],
};
const releaseUrl = `data:application/json,${encodeURIComponent(JSON.stringify(release))}`;

await writeFile(caskPath, `cask "agentwatch" do
  version "0.0.1"
  sha256 "${"0".repeat(64)}"
end
`);

const result = spawnSync(process.execPath, ["scripts/update-cask.mjs"], {
  cwd: new URL("..", import.meta.url),
  env: {
    ...process.env,
    AGENTWATCH_RELEASE_API_URL: releaseUrl,
    AGENTWATCH_CASK_PATH: caskPath,
  },
  encoding: "utf8",
});

assert.equal(result.status, 0, result.stderr);
const updated = await readFile(caskPath, "utf8");
assert.match(updated, /version "9\.8\.7"/);
assert.match(updated, new RegExp(`sha256 "${expectedSha}"`));

console.log("cask updater tests ok");
