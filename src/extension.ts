import * as child_process from 'child_process';
import * as vscode from 'vscode';


export function deactivate() { }

export function activate(context: vscode.ExtensionContext) {
	const command = vscode.commands.registerTextEditorCommand('making-of.commit', commit);
	context.subscriptions.push(command);

	console.log('Congratulations, your extension "making-of" is now active!');
}


async function commit(editor: vscode.TextEditor) {
	try {

		const selectedText = await getSelectedText(editor);
		const cwd = await getCwd(vscode.workspace.workspaceFolders);

		const commandOutput = await executeCommand(selectedText, cwd);

		editor.edit(editBuilder => editBuilder.replace(editor.selection, commandOutput));
		vscode.window.setStatusBarMessage('Done', 3000);

	} catch (error) {
		handleError('Making-Of Commit', error);
	}
}

function handleError(title: string, error: unknown) {
	if (error instanceof Error) {
		vscode.window.showErrorMessage(title + ': ' + error.message);
	} else {
		vscode.window.showErrorMessage(title + ': Unknown Error');
	}
}

async function getSelectedText(editor: vscode.TextEditor): Promise<string> {
	return new Promise((resolve, reject) => {
		if (editor.selection.isEmpty) {
			reject(new Error('nothing selected'));
		} else {
			resolve(editor.document.getText(editor.selection));
		}
	});
}

async function getCwd(folders: readonly vscode.WorkspaceFolder[] | undefined): Promise<string> {
	return new Promise((resolve, reject) => {
		if (folders === undefined || folders.length === 0) {
			reject(new Error('no workspace folders'));
		} else {
			resolve(folders
				.map((folder) => folder.uri.fsPath)
				.reduce((p1, p2) => p1.length < p2.length ? p1 : p2));
		}
	});
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