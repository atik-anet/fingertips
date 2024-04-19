import * as vscode from 'vscode';
import { MaintainerProvider } from './maintainer';
import { AidProvider } from './aid';
import { PackageProvider } from './packages';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, Fingertips is now active!');

	const workspaceRootPath =
		vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: '/Users/atik.kn/src/fingerTips/fingertips/';

	vscode.window.registerTreeDataProvider(
		'maintainers',
		new MaintainerProvider(workspaceRootPath)
	);

	vscode.window.createTreeView('maintainers', {
		treeDataProvider: new MaintainerProvider(workspaceRootPath)
	});

	vscode.window.registerTreeDataProvider(
		'aids',
		new AidProvider(workspaceRootPath)
	);

	vscode.window.createTreeView('aids', {
		treeDataProvider: new AidProvider(workspaceRootPath)
	});

	vscode.window.registerTreeDataProvider(
		'packages',
		new PackageProvider(workspaceRootPath)
	);

	vscode.window.createTreeView('packages', {
		treeDataProvider: new PackageProvider(workspaceRootPath)
	});
}

export function deactivate() { }
