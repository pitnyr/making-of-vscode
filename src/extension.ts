// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "making-of" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('making-of.commit', () => {
		// The code you place here will be executed every time your command is executed

		// Is there an active editor?
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('Making-Of Commit: no editor found');
			return;
		}

		// Check whether there's some text selected
		if (editor.selection.isEmpty) {
			vscode.window.showErrorMessage('Making-Of Commit: nothing selected');
			return;
		}

		// Get the selected text
		let text = editor.document.getText(editor.selection);
		// todo: check for valid syntax

		// Get the making-of branch suffix
		let suffix = vscode.workspace.getConfiguration('making-of').get('branchDirSuffix');

		// Get the name of the current file
		let path = editor.document.uri.path;

		// Display a message box to the user
		vscode.window.showInformationMessage('Now performing a commit in "' + suffix + '" from "' + path + '" with "' + text + '"');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
