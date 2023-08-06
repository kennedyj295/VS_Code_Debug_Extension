import * as vscode from 'vscode';
import { LanguageTypes } from './LanguageTypes';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "debug-helper" is now active!');

	let disposable = vscode.commands.registerCommand('debug-helper.addDebugLines', () => {
		vscode.window.showInformationMessage('Hello World from DebugHelper!');

		const options = Object.values(LanguageTypes);

		const languageInput = vscode.window.showQuickPick(options, {
			 placeHolder: 'Pick an option'
		}).then(languageInput => {
			vscode.window.showInformationMessage(languageInput!);
		});
		

		//Ask for user input on what language they're using (Java, C# to start)
		//ask for user input on where they want the debug file to be saved
		//give user warning saying to back up their code first as this will alter their current code
		//get directory of source code in project
		//find all class files
		//add debug lines
		//add new class file with debug method implementation
		//give notification saying how many inserts were added
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
