import { Plugin } from "@opencode/plugin/tui"

// Pin the last user prompt as a few lines above the composer, so a glance at
// any terminal answers "what is this session working on?".
//
// Line count is configurable from cli.json:
//   { "plugins": [{ "package": "opencode-last-prompt", "options": { "lines": 2 } }] }

const DEFAULT_LINES = 2
const MAX_LINES = 8

function lastPromptLines(messages) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (message?.type !== "user") continue
    if (typeof message.text !== "string") continue
    const text = message.text.replace(/\r\n?/g, "\n").trim()
    if (text) return text.split("\n")
  }
  return []
}

export default Plugin.define({
  id: "maksimf.last-prompt",
  setup(context) {
    const configured = context.options?.lines
    const limit = Number.isFinite(configured)
      ? Math.max(1, Math.min(MAX_LINES, Math.trunc(configured)))
      : DEFAULT_LINES

    return context.ui.slot({
      append: "session.composer.top",
      render: ({ sessionID }) => {
        const messages = context.data.session.message.list(sessionID) ?? []
        const allLines = lastPromptLines(messages)
        const lines = allLines.slice(0, limit)
        const truncated = allLines.length > limit

        return (
          <box flexDirection="column" flexShrink={0} paddingBottom={lines.length > 0 ? 1 : 0}>
            {lines.map((line, index) => (
              <text fg={context.theme.text.muted} wrapMode="none" truncate selectable={false}>
                {index === 0 ? "\u276f " : "  "}
                {line}
              </text>
            ))}
            {truncated ? (
              <text fg={context.theme.text.muted} wrapMode="none" truncate selectable={false}>
                {"  \u2026"}
              </text>
            ) : null}
          </box>
        )
      },
    })
  },
})