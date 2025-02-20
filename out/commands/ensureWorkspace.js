"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureWorkspace = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const os = require("os");
async function ensureWorkspace() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        const defaultWorkspaceFolder = path.join(os.homedir(), "create-agent");
        const folderUri = vscode.Uri.file(defaultWorkspaceFolder);
        try {
            if (!fs.existsSync(defaultWorkspaceFolder)) {
                await vscode.workspace.fs.createDirectory(folderUri);
            }
            await vscode.commands.executeCommand('vscode.openFolder', folderUri, false);
            vscode.window.showInformationMessage(`Workspace automatically set to: ${defaultWorkspaceFolder}`);
            return defaultWorkspaceFolder;
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error creating workspace folder: ${error instanceof Error ? error.message : String(error)}`);
            return undefined;
        }
    }
    else {
        return workspaceFolders[0].uri.fsPath;
    }
}
exports.ensureWorkspace = ensureWorkspace;
//# sourceMappingURL=ensureWorkspace.js.map