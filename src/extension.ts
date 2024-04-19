// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { MaintainerProvider } from './maintainer';
import { AidProvider } from './aid';

const workspaceRootPath =
  vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : '/Users/atik.kn/src/fingerTips/fingertips/';

// vscode.window.registerTreeDataProvider(
//   'fingertips',
//   new MaintainerProvider(workspaceRootPath)
// );

// vscode.window.createTreeView('fingertips', {
// 	treeDataProvider: new MaintainerProvider(workspaceRootPath)
// });

vscode.window.registerTreeDataProvider(
	'fingertips',
	new AidProvider(workspaceRootPath)
);

vscode.window.createTreeView('fingertips', {
	treeDataProvider: new AidProvider(workspaceRootPath)
});

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "fingertips" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('fingertips.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello VS Code!');
	});

	context.subscriptions.push(disposable);

	let showMaintainers = vscode.commands.registerCommand('fingertips.showMaintainers', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		let maintainers = "Maintainers";
		vscode.window.showInformationMessage(maintainers);
		// vscode.window.createWebviewPanel("Hello");
	});

	context.subscriptions.push(showMaintainers);
}

// This method is called when your extension is deactivated
export function deactivate() {}
