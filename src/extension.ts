import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { spawn } from 'child_process';
import {
	defaultKey,
	defaultKey2,
	defaultSpace,
	defaultEnter,
	defaultDelete,
} from './default';

type SoundType = 'key' | 'key2' | 'enter' | 'space' | 'delete';

interface SoundPaths {
	key: string;
	key2: string;
	enter: string;
	space: string;
	delete: string;
}

let soundPaths: SoundPaths;
let enabled: boolean = true;
let volume: number = 100;
let keyToggle: boolean = false;
let currentScheme: string = 'default';
let extensionPath: string = '';

// Track active audio processes
const activeProcesses: Set<ReturnType<typeof spawn>> = new Set();

export function activate(context: vscode.ExtensionContext) {
	console.log('Click Clack extension is now active');
	extensionPath = context.extensionPath;

	// Load settings and initialize sounds
	loadSettings();
	soundPaths = loadSoundFiles(context);

	// Watch for configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('clickClack')) {
				const oldScheme = currentScheme;
				loadSettings();
				// Reload sounds if scheme changed
				if (oldScheme !== currentScheme) {
					soundPaths = loadSoundFiles(context);
				}
			}
		})
	);

	// Listen for text document changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument((event) => {
			if (!enabled) return;

			const editor = vscode.window.activeTextEditor;
			if (!editor || editor.document !== event.document) return;

			// Ignore non-user changes
			if (event.reason === vscode.TextDocumentChangeReason.Undo ||
				event.reason === vscode.TextDocumentChangeReason.Redo) {
				return;
			}

			for (const change of event.contentChanges) {
				if (change.text === '') {
					playSound('delete');
				} else if (change.text === '\n' || change.text === '\r\n') {
					playSound('enter');
				} else if (change.text === ' ') {
					playSound('space');
				} else if (change.text.length === 1 || change.text.length <= 3) {
					playSound(keyToggle ? 'key' : 'key2');
					keyToggle = !keyToggle;
				}
			}
		})
	);

	// Register commands
	context.subscriptions.push(
		vscode.commands.registerCommand('clickClack.enable', () => {
			const config = vscode.workspace.getConfiguration('clickClack');
			config.update('enabled', true, vscode.ConfigurationTarget.Global);
			vscode.window.showInformationMessage('Click Clack: Typing sounds enabled');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('clickClack.disable', () => {
			const config = vscode.workspace.getConfiguration('clickClack');
			config.update('enabled', false, vscode.ConfigurationTarget.Global);
			vscode.window.showInformationMessage('Click Clack: Typing sounds disabled');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('clickClack.toggleSound', () => {
			const config = vscode.workspace.getConfiguration('clickClack');
			const newValue = !config.get<boolean>('enabled', true);
			config.update('enabled', newValue, vscode.ConfigurationTarget.Global);
			vscode.window.showInformationMessage(
				`Click Clack: Typing sounds ${newValue ? 'enabled' : 'disabled'}`
			);
		})
	);
}

function loadSettings() {
	const config = vscode.workspace.getConfiguration('clickClack');
	enabled = config.get<boolean>('enabled', true);
	volume = config.get<number>('volume', 100);
	currentScheme = config.get<string>('scheme', 'default');
}

function loadSoundFiles(context: vscode.ExtensionContext): SoundPaths {
	// Check if scheme exists in resources folder
	const schemeDir = path.join(extensionPath, 'resources', currentScheme);
	
	if (currentScheme !== 'default' && fs.existsSync(schemeDir)) {
		// Load from resources folder
		return {
			key: path.join(schemeDir, 'key.wav'),
			key2: path.join(schemeDir, 'key2.wav'),
			enter: path.join(schemeDir, 'enter.wav'),
			space: path.join(schemeDir, 'space.wav'),
			delete: path.join(schemeDir, 'delete.wav'),
		};
	}

	// Fall back to extracting default base64 sounds
	return extractDefaultSounds(context);
}

function extractDefaultSounds(context: vscode.ExtensionContext): SoundPaths {
	const soundDir = path.join(context.globalStorageUri.fsPath, 'sounds');
	
	// Create directory if it doesn't exist
	if (!fs.existsSync(soundDir)) {
		fs.mkdirSync(soundDir, { recursive: true });
	}

	const sounds: { [key: string]: string } = {
		key: defaultKey,
		key2: defaultKey2,
		space: defaultSpace,
		enter: defaultEnter,
		delete: defaultDelete,
	};

	const paths: SoundPaths = {
		key: '',
		key2: '',
		enter: '',
		space: '',
		delete: '',
	};

	for (const [name, base64Data] of Object.entries(sounds)) {
		const filePath = path.join(soundDir, `${name}.wav`);
		paths[name as SoundType] = filePath;

		// Only write if file doesn't exist (cache)
		if (!fs.existsSync(filePath)) {
			const base64Content = base64Data.replace(/^data:audio\/wav;base64,/, '');
			const buffer = Buffer.from(base64Content, 'base64');
			fs.writeFileSync(filePath, buffer);
		}
	}

	return paths;
}

function playSound(soundType: SoundType) {
	if (!soundPaths || !soundPaths[soundType]) return;

	const soundFile = soundPaths[soundType];
	const platform = os.platform();
	const vol = volume / 100;

	let player: ReturnType<typeof spawn>;

	try {
		if (platform === 'darwin') {
			// macOS - use afplay with volume
			player = spawn('afplay', ['-v', vol.toString(), soundFile], {
				stdio: 'ignore',
				detached: true,
			});
		} else if (platform === 'linux') {
			// Linux - use aplay
			player = spawn('aplay', ['-q', soundFile], {
				stdio: 'ignore',
				detached: true,
			});
		} else if (platform === 'win32') {
			// Windows - use PowerShell
			const script = `
				Add-Type -AssemblyName presentationCore
				$player = New-Object System.Windows.Media.MediaPlayer
				$player.Volume = ${vol}
				$player.Open([uri]"${soundFile.replace(/\\/g, '/')}")
				$player.Play()
				Start-Sleep -Milliseconds 500
			`;
			player = spawn('powershell', ['-Command', script], {
				stdio: 'ignore',
				detached: true,
				windowsHide: true,
			});
		} else {
			return;
		}

		player.unref();
		activeProcesses.add(player);

		player.on('close', () => {
			activeProcesses.delete(player);
		});

		player.on('error', (err) => {
			console.error('Click Clack: Error playing sound:', err);
			activeProcesses.delete(player);
		});
	} catch (err) {
		console.error('Click Clack: Failed to spawn audio player:', err);
	}
}

export function deactivate() {
	for (const proc of activeProcesses) {
		try {
			proc.kill();
		} catch (e) {
			// Ignore
		}
	}
	activeProcesses.clear();
}
