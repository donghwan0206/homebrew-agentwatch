cask "agentwatch" do
  version "0.2.12"
  sha256 "948d402639ebd33831a22c67ea078e460c512cd8bbb5d73df2611c2c5e617c83"

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
