import * as child_process from 'child_process';
import * as vscode from 'vscode';


export function deactivate() { }

export function activate(context: vscode.ExtensionContext) {
	const command = vscode.commands.registerTextEditorCommand('making-of.commit', commit);
	context.subscriptions.push(command);

	console.log('Congratulations, your extension "making-of" is now active!');
}


async function commit(editor: vscode.TextEditor) {
	if (editor.selection.isEmpty) {
		vscode.window.showErrorMessage('Making-Of Commit: nothing selected');
		return;
	}

	const text = editor.document.getText(editor.selection);
	// todo: check for valid syntax

	const folders = vscode.workspace.workspaceFolders;
	if (folders === undefined || folders.length === 0) {
		vscode.window.showErrorMessage('Making-Of Commit: no workspace folders');
		return;
	}
	const cwd: string = folders
		.map((folder) => folder.uri.fsPath)
		.reduce((p1, p2) => p1.length < p2.length ? p1 : p2);

	try {
		const commandOutput = await executeCommand(text, cwd);
		editor.edit(editBuilder => editBuilder.replace(editor.selection, commandOutput));
		vscode.window.showInformationMessage('Done');
	} catch (error) {
		if (error instanceof Error) {
			vscode.window.showErrorMessage('Error: ' + error.message);
		} else {
			vscode.window.showErrorMessage('Unknown Error');
		}
	}
}

async function executeCommand(input: string, cwd: string): Promise<string> {
	const process = child_process.spawn('/bin/sh', ['-c', 'sed "s/^/| /"'], { cwd: cwd });

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