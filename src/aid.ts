import * as vscode from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

export class AidProvider implements vscode.TreeDataProvider<Aid> {
	constructor(private workspaceRoot: string) { }

	getTreeItem(element: Aid): vscode.TreeItem {
		element.command = {
			command: 'vscode.open',
			arguments: [vscode.Uri.parse(element.url)]
		} as vscode.Command;
		return element;
	}

	getChildren(element?: Aid): Thenable<Aid[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No relevant AIDs to view.');
			return Promise.resolve([]);
		}

		if (element) {
			return Promise.resolve(
				this.getRelevantAids(
					path.join(this.workspaceRoot, 'data', 'aids.json')
				)
			);
		} else {
			const maintainersFilePath = path.join(this.workspaceRoot, 'data', 'aids.json');
			if (this.pathExists(maintainersFilePath)) {
				return Promise.resolve(this.getRelevantAids(maintainersFilePath));
			} else {
				vscode.window.showInformationMessage('No file with relevant AIDs.');
				return Promise.resolve([]);
			}
		}
	}

	private getRelevantAids(aidsFilePath: string): Aid[] {
		if (this.pathExists(aidsFilePath)) {
			const aidsJSONObject = JSON.parse(fs.readFileSync(aidsFilePath, 'utf-8'));

			const relevantAids = aidsJSONObject ?
				Object.keys(aidsJSONObject).map(key => {
					const aid = aidsJSONObject[key];
					return new Aid(aid.index, aid.title, aid.url);
				}) : [];
			return relevantAids;
		} else {
			return [];
		}
	}

	private pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}
		return true;
	}
}

class Aid extends vscode.TreeItem {
	constructor(
		public readonly index: string,
		public readonly title: string,
		public readonly url: string,
	) {
		super(`AID${index} : ${title}`, vscode.TreeItemCollapsibleState.None);
		this.tooltip = this.url;
	}
	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'document.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'document-dark.svg')
	};
}