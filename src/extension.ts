// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	function sleep(ms: number): Promise<void> {
		return new Promise(f => setTimeout(f, ms));
	}

	const disposable = vscode.workspace.onDidOpenTextDocument(async (document: vscode.TextDocument) => {
		const settings = vscode.workspace.getConfiguration("auto-open-preview");
		const commands = settings.get<Record<string, string>>("commands") || {};
		const delay = settings.get<number>("delay") || 100;
		const lang_id = document.languageId;
		const command = commands[lang_id];
		if (command) {
			try {
				if (delay > 0) {
					await sleep(delay);
				}
				await vscode.commands.executeCommand(command);
				console.log(`Run "${command}" for "${lang_id}"`);
			} catch (error) {
				const message = `Run "${command}" for "${lang_id}" failed:`;
				console.error(message, error);
				vscode.window.showErrorMessage(message + ` ${error}`);
			}
		}
	});
	
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
