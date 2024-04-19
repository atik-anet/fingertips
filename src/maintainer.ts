import * as vscode from 'vscode';

import * as fs from 'fs';
import * as path from 'path';
// export class NodeDependenciesProvider implements vscode.TreeDataProvider<Dependency> {
//   constructor(private workspaceRoot: string) {}

//   getTreeItem(element: Dependency): vscode.TreeItem {
//     return element;
//   }

//   getChildren(element?: Dependency): Thenable<Dependency[]> {
//     if (!this.workspaceRoot) {
//       vscode.window.showInformationMessage('No dependency in empty workspace');
//       return Promise.resolve([]);
//     }

//     if (element) {
//       return Promise.resolve(
//         this.getDepsInPackageJson(
//           path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')
//         )
//       );
//     } else {
//       const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
//       if (this.pathExists(packageJsonPath)) {
//         return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
//       } else {
//         vscode.window.showInformationMessage('Workspace has no package.json');
//         return Promise.resolve([]);
//       }
//     }
//   }

//   /**
//    * Given the path to package.json, read all its dependencies and devDependencies.
//    */
//   private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
//     if (this.pathExists(packageJsonPath)) {
//       const toDep = (moduleName: string, version: string): Dependency => {
//         if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
//           return new Dependency(
//             moduleName,
//             version,
//             vscode.TreeItemCollapsibleState.Collapsed
//           );
//         } else {
//           return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
//         }
//       };

//       const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

//       const deps = packageJson.dependencies
//         ? Object.keys(packageJson.dependencies).map(dep =>
//             toDep(dep, packageJson.dependencies[dep])
//           )
//         : [];
//       const devDeps = packageJson.devDependencies
//         ? Object.keys(packageJson.devDependencies).map(dep =>
//             toDep(dep, packageJson.devDependencies[dep])
//           )
//         : [];
//       return deps.concat(devDeps);
//     } else {
//       return [];
//     }
//   }

//   private pathExists(p: string): boolean {
//     try {
//       fs.accessSync(p);
//     } catch (err) {
//       return false;
//     }
//     return true;
//   }
// }

// class Dependency extends vscode.TreeItem {
//   constructor(
//     public readonly label: string,
//     private version: string,
//     public readonly collapsibleState: vscode.TreeItemCollapsibleState
//   ) {
//     super(label, collapsibleState);
//     this.tooltip = `${this.label}-${this.version}`;
//     this.description = this.version;
//   }

//   iconPath = {
//     light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
//     dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
//   };
// }

// const rootPath =
//   vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
//     ? vscode.workspace.workspaceFolders[0].uri.fsPath
//     : '';

// vscode.window.registerTreeDataProvider(
//   'nodeDependencies',
//   new NodeDependenciesProvider(rootPath)
// );

// vscode.window.createTreeView('nodeDependencies', {
// 	treeDataProvider: new NodeDependenciesProvider(rootPath)
// });

export class MaintainerProvider implements vscode.TreeDataProvider<Maintainer> {
	constructor(private workspaceRoot: string) {}

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
				// vscode.window.showInformationMessage(maintainersFilePath);
				return Promise.resolve(this.getMaintainers(maintainersFilePath));
			} else {
				vscode.window.showInformationMessage('No file with Maintainers data.');
				return Promise.resolve([]);
			}
		}
	}

	private getMaintainers(maintainersFilePath: string): Maintainer[] {
		if (this.pathExists(maintainersFilePath)) {
			// return [new Maintainer("atik.kn")];
			const maintainersJSONObject = JSON.parse(fs.readFileSync(maintainersFilePath, 'utf-8'));
			const maintainers = maintainersJSONObject.maintainers ? 
							maintainersJSONObject.maintainers.map((maintainer: string) => {return new Maintainer(maintainer);})
							: [] ;
			const leadMaintainer = maintainersJSONObject.leadMaintainer ?
							maintainersJSONObject.leadMaintainer.map((lead: string) => {return new Maintainer(lead);}) 
							: [];
			const watchers = maintainersJSONObject.watchers ?
							maintainersJSONObject.watchers.map((watcher: string) => {return new Maintainer(watcher);}) 
							: [];
			maintainers.concat(leadMaintainer,watchers);
			maintainers.forEach(function(entry:any) {
				console.log(entry);
			});
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
		super(alias,vscode.TreeItemCollapsibleState.None);
		this.tooltip = `${this.alias}`;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'user.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'user-dark.svg')
	};
}