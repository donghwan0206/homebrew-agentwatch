#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const releaseApiUrl = process.env.AGENTWATCH_RELEASE_API_URL
  ?? "https://api.github.com/repos/donghwan0206/agentwatch/releases/latest";
const caskPath = process.env.AGENTWATCH_CASK_PATH ?? "Casks/agentwatch.rb";

async function fetchRequired(url, description) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "agentwatch-homebrew-sync",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    throw new Error(`Unable to download ${description}: HTTP ${response.status}`);
  }

  return response;
}

const release = await (await fetchRequired(releaseApiUrl, "latest release metadata")).json();
const versionMatch = /^v(\d+\.\d+\.\d+)$/.exec(release.tag_name ?? "");
if (!versionMatch) {
  throw new Error(`Unsupported release tag: ${release.tag_name ?? "missing"}`);
}

const version = versionMatch[1];
const expectedAssetName = `AgentWatch_${version}_aarch64.dmg`;
const asset = release.assets?.find((candidate) => candidate.name === expectedAssetName);
if (!asset?.browser_download_url) {
  throw new Error(`Release ${release.tag_name} does not contain ${expectedAssetName}`);
}

const archive = Buffer.from(
  await (await fetchRequired(asset.browser_download_url, expectedAssetName)).arrayBuffer(),
);
const sha256 = createHash("sha256").update(archive).digest("hex");
const current = await readFile(caskPath, "utf8");
const updated = current
  .replace(/^  version "[^"]+"$/m, `  version "${version}"`)
  .replace(/^  sha256 "[a-f0-9]{64}"$/m, `  sha256 "${sha256}"`);

if (updated === current) {
  console.log(`AgentWatch ${version} is already current.`);
} else {
  await writeFile(caskPath, updated);
  console.log(`Updated AgentWatch Cask to ${version} (${sha256}).`);
}

if (process.env.GITHUB_OUTPUT) {
  await writeFile(process.env.GITHUB_OUTPUT, `version=${version}\n`, { flag: "a" });
}
