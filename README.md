# Click Clack

Simulates typewriter / mechanical keyboard sounds while typing in VS Code.

## Features

- 🎹 **Realistic typing sounds** - Plays different sounds for different key types (regular keys, space, enter, backspace)
- 🎚️ **Adjustable volume** - Control the volume from 0 to 100
- 🔊 **14 sound schemes** - Choose from mechanical keyboards, typewriters, and more
- ⚡ **Lightweight** - Minimal performance impact

## Installation

### From VSIX

1. Download the `.vsix` file from releases
2. Open VS Code
3. Go to Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
4. Click the `...` menu → "Install from VSIX..."
5. Select the downloaded file

### From Source

```bash
git clone https://github.com/jaydnedwards/click-clack-vscode.git
cd click-clack-vscode
npm install
npm run compile
npx vsce package
code --install-extension click-clack-*.vsix
```

## Configuration

Open Settings (`Cmd+,` / `Ctrl+,`) and search for "Click Clack":

| Setting | Description | Default |
|---------|-------------|---------|
| `clickClack.enabled` | Enable or disable typing sounds | `true` |
| `clickClack.volume` | Volume of typing sounds (0-100) | `100` |
| `clickClack.scheme` | Sound scheme to use | `"default"` |

### Available Sound Schemes

| Scheme | Description |
|--------|-------------|
| `default` | Default mechanical keyboard |
| `quill` | Quill pen writing |
| `cherry-mx-blue` | Cherry MX Blue switches (clicky) |
| `cherry-mx-red` | Cherry MX Red switches (linear) |
| `cherry-mx-brown` | Cherry MX Brown switches (tactile) |
| `cherry-mx-black` | Cherry MX Black switches |
| `alps-style-switch` | Alps style switches |
| `click-keyboard` | Click keyboard |
| `ibm-keyboard` | IBM Model M keyboard |
| `ibm-selectric` | IBM Selectric typewriter |
| `old-typewriter` | Old typewriter |
| `olympia-regina-de-luxe` | Olympia Regina de Luxe typewriter |
| `subtle-clicks` | Subtle click sounds |
| `synapses` | Synapses |

## Commands

Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`):

- **Click Clack: Enable Typing Sounds**
- **Click Clack: Disable Typing Sounds**
- **Click Clack: Toggle Typing Sounds**

## Development

```bash
npm run watch    # Watch mode
```

Press `F5` in VS Code to launch the Extension Development Host.

## Credits

- Original [Obsidian Click Clack Plugin](https://github.com/Acylation/obsidian-click-clack) by Acylation
- Sound resources from the open source community

## License

MIT License - See [LICENSE](LICENSE) for details.
