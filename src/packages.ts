import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class PackageProvider implements vscode.TreeDataProvider<Package> {
	constructor(private workspaceRoot: string) {}

	getTreeItem(element: Package): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Package): Thenable<Package[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('No related packages to view.');
			return Promise.resolve([]);
		}

		if (element) {
			return Promise.resolve(
				this.getRelatedPackages(
					path.join(this.workspaceRoot, 'data', 'packages.json')
				)
			);
		} else {
			const maintainersFilePath = path.join(this.workspaceRoot, 'data', 'packages.json');
			if (this.pathExists(maintainersFilePath)) {
				return Promise.resolve(this.getRelatedPackages(maintainersFilePath));
			} else {
				vscode.window.showInformationMessage('No file with related packages.');
				return Promise.resolve([]);
			}
		}
	}

	private getRelatedPackages(packagesFilePath: string): Package[] {
		if (this.pathExists(packagesFilePath)) {
			const packagesJSONObject = JSON.parse(fs.readFileSync(packagesFilePath, 'utf-8'));

			const relatedPackages = packagesJSONObject ? 
							Object.keys(packagesJSONObject).map(key => {
                                const pkg = packagesJSONObject[key];
                                return new Package(pkg.name, pkg.url);
                            }): [] ;
			return relatedPackages;
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

class Package extends vscode.TreeItem {
	constructor(
		public readonly name: string,
        public readonly url: string,
	) {
		super(name,vscode.TreeItemCollapsibleState.None);
		this.tooltip = this.url;
	}
}