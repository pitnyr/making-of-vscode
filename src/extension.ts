import * as child_process from 'child_process';
import * as vscode from 'vscode';


export function deactivate() { }

export function activate(context: vscode.ExtensionContext) {
	let command = vscode.commands.registerTextEditorCommand('making-of.commit', commit);
	context.subscriptions.push(command);

	console.log('Congratulations, your extension "making-of" is now active!');
}


async function commit(editor: vscode.TextEditor, edit: vscode.TextEditorEdit) {
	if (editor.selection.isEmpty) {
		vscode.window.showErrorMessage('Making-Of Commit: nothing selected');
		return;
	}

	let text = editor.document.getText(editor.selection);
	// todo: check for valid syntax

	try {
		const commandOutput = await executeCommand(text);
		vscode.window.showInformationMessage('Output "' + commandOutput + '"');
	} catch (error) {
		if (error instanceof Error) {
			vscode.window.showErrorMessage('Error: ' + error.message);
		} else {
			vscode.window.showErrorMessage('Unknown Error');
		}
	}
}

async function executeCommand(input: string): Promise<string> {
	const process = child_process.spawn('/bin/sh', ['-c', 'pwd && whoami']);

	let stdoutString = '';
	let stderrString = '';

	process.stdin?.write(input);
	process.stdin?.end();

	process.stdout?.on('data', data => { stdoutString += data.toString(); });
	process.stderr?.on('data', data => { stderrString += data.toString(); });

	return new Promise((resolve, reject) => {
		process.on('error', err => {
			reject(err);
		});
		process.on('close', code => {
			if (code !== 0) {
				reject(new Error('(' + code + ') ' + stderrString.trim()));
			} else {
				resolve(stdoutString);
			}
		});
	});
}