import * as vscode from 'vscode';
import { LanguageTypes } from './LanguageTypes';
import { findJavaFiles } from './parser';

export function activate(context: vscode.ExtensionContext) {

	//access user's project directory and determine whether it's a C# or Java project

	let disposable = vscode.commands.registerCommand('debug-helper.addDebugLines', () => {
		const folders = vscode.workspace.workspaceFolders;
		
		if (folders) {
			const javaFiles = findJavaFiles(folders);
		} else {
			vscode.window.showErrorMessage('No folders available to VS Code');
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
