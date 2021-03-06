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
		const sourceLink = await getSourceLink(vscode.workspace);
		const makingOfLink = await getMakingOfLink(editor, vscode.workspace);

		const selectedLines = await getSelectedLines(editor);
		const commitId = getCommitId();
		const commitMessage = await getCommitMessage(selectedLines, makingOfLink, commitId);
		const cwd = await getCwd(vscode.workspace.workspaceFolders);

		const commitHash = await executeCommit(commitMessage, cwd);

		const finalText = getFinalText(selectedLines, commitId, sourceLink, commitHash);
		await replaceSelectedText(editor, finalText);

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

async function getSourceLink(workspace: typeof vscode.workspace): Promise<string> {
	return new Promise((resolve, reject) => {
		const settings = workspace.getConfiguration('making-of');

		let sourceUrl = settings.get<string>('sourceUrl');
		if (!sourceUrl || sourceUrl.length === 0) {
			reject(new Error('sourceUrl setting not configured'));
			return;
		}
		if (!sourceUrl.endsWith('/')) {
			sourceUrl += '/';
		}

		resolve(sourceUrl + 'commit/');
	});
}

async function getMakingOfLink(editor: vscode.TextEditor, workspace: typeof vscode.workspace): Promise<string> {
	return new Promise((resolve, reject) => {
		const settings = workspace.getConfiguration('making-of');

		let publishUrl = settings.get<string>('publishUrl');
		if (!publishUrl || publishUrl.length === 0) {
			reject(new Error('publishUrl setting not configured'));
			return;
		}
		if (!publishUrl.endsWith('/')) {
			publishUrl += '/';
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
			resolve(publishUrl + base.slice(startIndex + localPath.length) + '.html');
		}
	});
}

async function getSelectedLines(editor: vscode.TextEditor): Promise<string[]> {
	return new Promise((resolve, reject) => {
		if (editor.selection.isEmpty) {
			reject(new Error('nothing selected'));
		} else {
			const lines = editor.document.getText(editor.selection).split('\n')
				.map((line) => line.trimEnd());
			lines[0] = lines[0].trimStart();  // subject
			resolve(lines);
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

async function getCommitMessage(selectedLines: string[], makingOfLink: string, commitId: string): Promise<string> {
	return new Promise((resolve, reject) => {

		if (selectedLines[selectedLines.length - 1].length > 0) {
			reject(new Error('last selected line without linefeed'));
			return;
		}
		selectedLines.pop();

		const subject = selectedLines[0];
		if (subject.length === 0) {
			reject(new Error('subject (first line) is empty'));
			return;
		} else if (subject.length > 50) {
			reject(new Error('subject (first line) is longer than 50 chars'));
			return;
		}

		const body = selectedLines.slice(1);
		if (body.length > 0) {
			if (body[0].length > 0) {
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

async function executeCommit(input: string, cwd: string): Promise<string> {
	const process = child_process.spawn(
		'/bin/sh',
		['-c', 'git commit --quiet --file=- && git rev-parse --verify HEAD'],
		{ cwd: cwd });

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
				resolve(stdoutString.trimEnd());
			}
		});
	});
}

function getFinalText(selectedLines: string[], commitId: string, sourceLink: string, commitHash: string) {
	return '<a id="' + commitId + '"></a>\n' +
		'\n' +
		'[' + commitId + '](' + sourceLink + commitHash + ')\n' +
		'```email\n' +
		'subject: ' + selectedLines.join('\n') + '\n' +
		'```\n';
}

async function replaceSelectedText(editor: vscode.TextEditor, finalText: string) {
	await editor.edit(editBuilder => editBuilder.replace(editor.selection, finalText));
	const endPos = editor.selection.end;
	editor.selection = new vscode.Selection(endPos, endPos);
}