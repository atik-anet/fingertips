import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class MaintainerProvider implements vscode.TreeDataProvider<Maintainer> {
	constructor(private workspaceRoot: string) { }

	getTreeItem(element: Maintainer): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Maintainer): Thenable<Maintainer[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No maintainers for this package.');
			return Promise.resolve([]);
		}

		if (element) {
			return Promise.resolve(
				this.getMaintainers(
					path.join(this.workspaceRoot, 'data', 'maintainers.json')
				)
			);
		} else {
			const maintainersFilePath = path.join(this.workspaceRoot, 'data', 'maintainers.json');
			if (this.pathExists(maintainersFilePath)) {
				return Promise.resolve(this.getMaintainers(maintainersFilePath));
			} else {
				vscode.window.showInformationMessage('No file with Maintainers data.');
				return Promise.resolve([]);
			}
		}
	}

	private getMaintainers(maintainersFilePath: string): Maintainer[] {
		if (this.pathExists(maintainersFilePath)) {
			const maintainersJSONObject = JSON.parse(fs.readFileSync(maintainersFilePath, 'utf-8'));
			const maintainers = maintainersJSONObject.maintainers ?
				maintainersJSONObject.maintainers.map((maintainer: string) => { return new Maintainer(maintainer); })
				: [];
			const leadMaintainer = maintainersJSONObject.leadMaintainer ?
				maintainersJSONObject.leadMaintainer.map((lead: string) => { return new Maintainer(lead); })
				: [];
			const watchers = maintainersJSONObject.watchers ?
				maintainersJSONObject.watchers.map((watcher: string) => { return new Maintainer(watcher); })
				: [];
			maintainers.concat(leadMaintainer, watchers);
			return maintainers;
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

class Maintainer extends vscode.TreeItem {
	constructor(
		public readonly alias: string,
	) {
		super(alias, vscode.TreeItemCollapsibleState.None);
		this.tooltip = `${this.alias}`;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'user.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'user-dark.svg')
	};
}