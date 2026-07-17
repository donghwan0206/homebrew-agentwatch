cask "agentwatch" do
  version "0.2.13"
  sha256 "84ba0c23143736a5c68ee56bf543e0b2b1edb48c9cd807789a180c4965ec7c4d"

  url "https://github.com/donghwan0206/agentwatch/releases/download/v#{version}/AgentWatch_#{version}_aarch64.dmg"
  name "AgentWatch"
  desc "Tray dashboard for monitoring local LLM agents"
  homepage "https://github.com/donghwan0206/agentwatch"

  depends_on arch: :arm64
  depends_on macos: :big_sur

  app "AgentWatch.app"

  postflight do
    system "/usr/bin/xattr", "-dr", "com.apple.quarantine", "#{appdir}/AgentWatch.app"
  end

  uninstall quit: "app.agentwatch.desktop"

  caveats <<~EOS
    AgentWatch is distributed with an ad-hoc signature and is not Apple-notarized.
    This Cask removes the quarantine attribute after verifying the pinned SHA-256.
    If Gatekeeper still blocks an older installation, run:

      xattr -dr com.apple.quarantine /Applications/AgentWatch.app
  EOS
end
