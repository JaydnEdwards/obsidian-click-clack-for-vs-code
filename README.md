# Click Clack - VS Code Extension

Simulates typewriter / mechanical keyboard sounds while typing in VS Code.

![Demo](https://raw.githubusercontent.com/your-username/click-clack-vscode/main/demo.gif)

## Features

- 🎹 **Realistic typing sounds** - Plays different sounds for different key types (regular keys, space, enter, backspace)
- 🎚️ **Adjustable volume** - Control the volume from 0 to 100
- 🔊 **Multiple sound schemes** - Choose from various keyboard sounds including Cherry MX switches, IBM keyboards, and typewriters
- ⚡ **Lightweight** - Minimal performance impact

## Installation

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "Click Clack"
4. Click Install

### From VSIX

1. Download the `.vsix` file from releases
2. Open VS Code
3. Go to Extensions
4. Click the three dots menu (...)
5. Select "Install from VSIX..."
6. Choose the downloaded file

## Configuration

Open Settings (Ctrl+, / Cmd+,) and search for "Click Clack":

| Setting | Description | Default |
|---------|-------------|---------|
| `clickClack.enabled` | Enable or disable typing sounds | `true` |
| `clickClack.volume` | Volume of typing sounds (0-100) | `100` |
| `clickClack.scheme` | Sound scheme to use | `"default"` |

### Available Sound Schemes

- `default` - Default mechanical keyboard sound
- `cherry-mx-blue` - Cherry MX Blue switches (clicky)
- `cherry-mx-red` - Cherry MX Red switches (linear)
- `cherry-mx-brown` - Cherry MX Brown switches (tactile)
- `cherry-mx-black` - Cherry MX Black switches
- `ibm-keyboard` - IBM Model M keyboard
- `ibm-selectric` - IBM Selectric typewriter
- `old-typewriter` - Old typewriter
- `subtle-clicks` - Subtle click sounds

## Commands

- `Click Clack: Enable Typing Sounds` - Enable sounds
- `Click Clack: Disable Typing Sounds` - Disable sounds
- `Click Clack: Toggle Typing Sounds` - Toggle sounds on/off

## Building from Source

```bash
# Clone the repository
git clone https://github.com/your-username/click-clack-vscode.git
cd click-clack-vscode

# Install dependencies
npm install

# Compile
npm run compile

# Package
npm run package
```

## Development

```bash
# Watch mode
npm run watch
```

Then press F5 in VS Code to launch the Extension Development Host.

## Credits

- Original [Obsidian Click Clack Plugin](https://github.com/Acylation/obsidian-click-clack) by Acylation
- Sound resources from the open source community

## License

MIT License - See [LICENSE](LICENSE) for details.
