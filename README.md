# opencode-last-prompt

A tiny CLI plugin for the [OpenCode](https://opencode.ai) TUI that pins the last
user prompt as a few lines above the composer, so you can tell at a glance what
each session is working on — handy when you keep a lot of terminals open.

```text
❯ Refactor the auth middleware to support refresh tokens
  and make sure the existing tests still pass.
```

## Install

### From GitHub (recommended)

```sh
opencode plugin add github:maksimf/opencode-last-prompt
```

This installs the package and registers it in `~/.config/opencode/cli.json`.
Restart the TUI to load it.

> The repository is private, so the machine needs access to it — sign in with
> `gh auth login` or use an SSH key that can read `maksimf/opencode-last-prompt`.

### Manual

```sh
git clone git@github.com:maksimf/opencode-last-prompt.git ~/.config/opencode/last-prompt
```

Then add it to `~/.config/opencode/cli.json`:

```json
{
  "plugins": ["./last-prompt"]
}
```

Restart the TUI.

## Configuration

Set the number of visible lines (default `2`, clamped to `1`–`8`):

```json
{
  "plugins": [
    { "package": "./last-prompt", "options": { "lines": 4 } }
  ]
}
```

A prompt longer than the limit gets a muted `…` line.

## How it works

The plugin registers a component in the `session.composer.top` slot, reads the
session's messages with `context.data.session.message.list(sessionID)`, and
renders the `text` of the last message whose `type` is `"user"`. It runs locally
in the TUI and does not consume API tokens.

OpenCode provides the runtime modules (`@opencode/plugin/tui`, OpenTUI, and
`solid-js`) at load time, so this package declares no dependencies.

## Uninstall

Remove the entry from `~/.config/opencode/cli.json` (and delete
`~/.config/opencode/last-prompt` if you cloned it manually).

## License

MIT