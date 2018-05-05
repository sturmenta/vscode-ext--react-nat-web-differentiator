import * as vscode from 'vscode';
import * as path from 'path';
import { CLIENT_RENEG_LIMIT } from 'tls';

export function activate(context: vscode.ExtensionContext) {

	async function getPackageColors() {
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders === undefined) return {};
		const workspacePath = workspaceFolders[0].uri.fsPath;

		try {
				const fullPath = path.join(workspacePath, 'package.json');
				const document = await vscode.workspace.openTextDocument(fullPath);
				const text = document.getText();
				const json = JSON.parse(text);

				if (json.react_nat_web_differentiator !== undefined)
					return json.react_nat_web_differentiator;
				else return {
					web: 'rgba(0, 205, 30, .25)',
					native: 'rgba(134, 91, 217, .25)'
				}
		} catch (error) {}
		return {};
	}

	async function start() {
		const colors = await getPackageColors();

		const web_DecorationType = vscode.window.createTextEditorDecorationType({
			overviewRulerColor: colors.web,
			backgroundColor: colors.web,
			overviewRulerLane: vscode.OverviewRulerLane.Right,
		});

		const native_DecorationType = vscode.window.createTextEditorDecorationType({
			overviewRulerColor: colors.native,
			backgroundColor: colors.native,
			overviewRulerLane: vscode.OverviewRulerLane.Right,
		});

		let activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) triggerUpdateDecorations();

		vscode.window.onDidChangeActiveTextEditor(editor => {
			activeEditor = editor;
			if (editor) triggerUpdateDecorations();
		}, null, context.subscriptions);

		vscode.workspace.onDidChangeTextDocument(event => {
			if (activeEditor && event.document === activeEditor.document)
				triggerUpdateDecorations();
		}, null, context.subscriptions);

		var timeout = null;
		function triggerUpdateDecorations() {
			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(updateDecorations, 500);
		}

		function updateDecorations() {
			if (!activeEditor) return;
			const text = activeEditor.document.getText();
			//
			const web_regEx = /\/\*.*\*web\*\/|.*\/\/web|\/\*web\*\/.*|.*start_web[\s\S]*?end_web/gm;
			const native_regEx = /\/\*.*\*native\*\/|.*\/\/native|\/\*native\*\/.*|.*start_native[\s\S]*?end_native/gm;
			//
			const web_area: vscode.DecorationOptions[] = [];
			const native_area: vscode.DecorationOptions[] = [];

			let match;
			while (match = web_regEx.exec(text)) {
				const startPos = activeEditor.document.positionAt(match.index);
				const endPos = activeEditor.document.positionAt(match.index + match[0].length);
				const decoration = { range: new vscode.Range(startPos, endPos)};

				web_area.push(decoration);
			}
			while (match = native_regEx.exec(text)) {
				const startPos = activeEditor.document.positionAt(match.index);
				const endPos = activeEditor.document.positionAt(match.index + match[0].length);
				const decoration = { range: new vscode.Range(startPos, endPos)};

				native_area.push(decoration);
			}
			activeEditor.setDecorations(web_DecorationType, web_area);
			activeEditor.setDecorations(native_DecorationType, native_area);
		}
	}
	start();
}
