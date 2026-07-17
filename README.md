# AgentWatch Homebrew Tap

Install the AgentWatch macOS tray app from its dedicated Homebrew Cask:

```bash
brew install --cask --no-quarantine donghwan0206/agentwatch/agentwatch
```

Upgrade to the latest release:

```bash
brew update
brew upgrade --cask agentwatch
```

Uninstall:

```bash
brew uninstall --cask agentwatch
```

AgentWatch is currently available for Apple Silicon Macs. The app is ad-hoc
signed but not Apple-notarized, so `--no-quarantine` is required for a direct
first launch without manual Gatekeeper approval.

The `Sync AgentWatch Cask` workflow checks the latest upstream release every
15 minutes and commits a new version and SHA-256 only when they change.
Homebrew tap for AgentWatch
