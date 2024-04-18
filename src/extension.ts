// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as fs from 'fs';
import * as path from 'path';

export class NodeDependenciesProvider implements vscode.TreeDataProvider<Dependency> {
  constructor(private workspaceRoot: string) {}

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage('No dependency in empty workspace');
      return Promise.resolve([]);
    }

    if (element) {
      return Promise.resolve(
        this.getDepsInPackageJson(
          path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')
        )
      );
    } else {
      const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
      if (this.pathExists(packageJsonPath)) {
        return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
      } else {
        vscode.window.showInformationMessage('Workspace has no package.json');
        return Promise.resolve([]);
      }
    }
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
    if (this.pathExists(packageJsonPath)) {
      const toDep = (moduleName: string, version: string): Dependency => {
        if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
          return new Dependency(
            moduleName,
            version,
            vscode.TreeItemCollapsibleState.Collapsed
          );
        } else {
          return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
        }
      };

      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      const deps = packageJson.dependencies
        ? Object.keys(packageJson.dependencies).map(dep =>
            toDep(dep, packageJson.dependencies[dep])
          )
        : [];
      const devDeps = packageJson.devDependencies
        ? Object.keys(packageJson.devDependencies).map(dep =>
            toDep(dep, packageJson.devDependencies[dep])
          )
        : [];
      return deps.concat(devDeps);
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

class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}-${this.version}`;
    this.description = this.version;
  }

  iconPath = {
    light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
    dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
  };
}

const rootPath =
  vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : '';

vscode.window.registerTreeDataProvider(
  'nodeDependencies',
  new NodeDependenciesProvider(rootPath)
);

vscode.window.createTreeView('nodeDependencies', {
	treeDataProvider: new NodeDependenciesProvider(rootPath)
});

export class MaintainerProvider implements vscode.TreeDataProvider<Maintainer> {
	constructor(private workspaceRoot: string) {}

	getTreeItem(element: Maintainer): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Maintainer): Thenable<Maintainer[]> {
		if (!this.workspaceRoot) {
		vscode.window.showInformationMessage('No dependency in empty workspace');
		return Promise.resolve([]);
		}

		if (element) {
		return Promise.resolve(
			this.getMaintainers(
			path.join(this.workspaceRoot, 'maintainers.json')
			)
		);
		} else {
		const maintainersFilePath = path.join(this.workspaceRoot, 'maintainers.json');
		if (this.pathExists(maintainersFilePath)) {
			return Promise.resolve(this.getMaintainers(maintainersFilePath));
		} else {
			vscode.window.showInformationMessage('Workspace has no maintainers.json');
			return Promise.resolve([]);
		}
		}
	}

	/**
	 * Given the path to package.json, read all its dependencies and devDependencies.
	 */
	private getMaintainers(maintainersFilePath: string): Maintainer[] {
		if (this.pathExists(maintainersFilePath)) {
			const toAlias = (alias: string): Maintainer => {
				if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', alias))) {
				return new Maintainer(
					alias,
					vscode.TreeItemCollapsibleState.Collapsed
				);
				} else {
				return new Maintainer(alias, vscode.TreeItemCollapsibleState.None);
				}
			};

			const filePath = JSON.parse(fs.readFileSync(maintainersFilePath, 'utf-8'));

			const maintainers = filePath.maintainers;
			maintainers.concat(filePath.leadMaintainer);
			maintainers.concat(filePath.watchers);
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
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	  ) {
		super(alias, collapsibleState);
		this.tooltip = `${this.alias}`;
	  }
	
	  iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'media/user.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'media/user.svg')
	  };
}


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
