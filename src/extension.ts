import * as child_process from 'child_process';
import * as path from 'path';
import * as vscode from 'vscode';


export function deactivate() { }

export function activate(context: vscode.ExtensionContext) {
	const command = vscode.commands.registerTextEditorCommand('making-of.commit', commit);
	context.subscriptions.push(command);

	console.log('Congratulations, your extension "making-of" is now active!');
}


async function commit(editor: vscode.TextEditor) {
	try {
		const makingOfLink = await getMakingOfLink(editor, vscode.workspace);

		const selectedText = await getSelectedText(editor);
		const commitId = getCommitId();
		const commitMessage = await getCommitMessage(selectedText, makingOfLink, commitId);
		const cwd = await getCwd(vscode.workspace.workspaceFolders);

		const commandOutput = await executeCommand(commitMessage, cwd);

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

async function getMakingOfLink(editor: vscode.TextEditor, workspace: typeof vscode.workspace): Promise<string> {
	return new Promise((resolve, reject) => {
		const settings = workspace.getConfiguration('making-of');

		let publishPath = settings.get<string>('publishPath');
		if (!publishPath || publishPath.length === 0) {
			reject(new Error('publishPath setting not configured'));
			return;
		}
		if (!publishPath.endsWith('/')) {
			publishPath += '/';
		}

		let localPath = settings.get<string>('localPath');
		if (!localPath || localPath.length === 0) {
			reject(new Error('localPath setting not configured'));
			return;
		}
		if (!localPath.endsWith('/')) {
			localPath += '/';
		}

		const filePath = editor.document.uri.fsPath;
		const startIndex = filePath.indexOf(localPath);
		if (startIndex < 0) {
			reject(new Error('current file not in localPath'));
		} else {
			const base = path.dirname(filePath) + '/' + path.basename(filePath, '.md');
			resolve(publishPath + base.slice(startIndex + localPath.length) + '.html');
		}
	});
}

async function getSelectedText(editor: vscode.TextEditor): Promise<string[]> {
	return new Promise((resolve, reject) => {
		if (editor.selection.isEmpty) {
			reject(new Error('nothing selected'));
		} else {
			resolve(editor.document.getText(editor.selection).split('\n'));
		}
	});
}

function getCommitId(): string {
	const now = new Date();
	return 'commit-' +
		now.getFullYear() + '-' +
		('0' + (now.getMonth() + 1)).slice(-2) + '-' +
		('0' + now.getDate()).slice(-2) + '-' +
		('0' + now.getHours()).slice(-2) + '-' +
		('0' + now.getMinutes()).slice(-2);
}

async function getCommitMessage(selectedText: string[], makingOfLink: string, commitId: string): Promise<string> {
	return new Promise((resolve, reject) => {

		if (selectedText.length === 0) {
			reject(new Error('nothing selected'));
			return;
		} else if (selectedText[selectedText.length - 1].length > 0) {
			reject(new Error('last selected line without linefeed'));
			return;
		}
		selectedText.pop();

		const subject = selectedText[0].trim();
		if (subject.length === 0) {
			reject(new Error('subject (first line) is empty'));
			return;
		} else if (subject.length > 50) {
			reject(new Error('subject (first line) is longer than 50 chars'));
			return;
		}

		const body = selectedText.slice(1).map((line) => line.trimEnd());
		if (body.length > 0) {
			if (body[0].trim().length > 0) {
				reject(new Error('delimiter (second line) is not empty'));
				return;
			} else if (body.length === 1) {
				reject(new Error('delimiter without body'));
				return;
			} else if (body[body.length - 1].length === 0) {
				reject(new Error('last body line is empty'));
				return;
			} else if (body.find((line) => line.length > 72) !== undefined) {
				reject(new Error('some body lines are longer than 72 chars'));
				return;
			}
		}

		const linkLine = 'See ' + makingOfLink + '#' + commitId;
		resolve([subject, '', linkLine, ...body, ''].join('\n'));
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