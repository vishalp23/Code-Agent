"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developProject = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const queryLLM_1 = require("../utils/queryLLM");
const ensureWorkspace_1 = require("./ensureWorkspace");
const fileUtils_1 = require("../utils/fileUtils");
async function developProject(query) {
    const workspaceDir = await (0, ensureWorkspace_1.ensureWorkspace)();
    if (!workspaceDir) {
        vscode.window.showErrorMessage("No workspace available.");
        return;
    }
    const folderName = await (0, fileUtils_1.getFolderNameFromLLM)(query);
    const projectFolder = path.join(workspaceDir, folderName);
    const prompt = `Generate complete source code for: "${query}"`;
    const responseText = await (0, queryLLM_1.queryLLM)(prompt);
    let files;
    try {
        files = JSON.parse(responseText);
    }
    catch (error) {
        vscode.window.showErrorMessage("Failed to parse development code: " + (error instanceof Error ? error.message : error));
        return;
    }
    for (const [relativePath, content] of Object.entries(files)) {
        const filePath = path.join(projectFolder, relativePath);
        try {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, content);
            console.log(`Updated file: ${filePath}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to write file ${relativePath}: ${error instanceof Error ? error.message : error}`);
        }
    }
    vscode.window.showInformationMessage("Project development complete.");
}
exports.developProject = developProject;
//# sourceMappingURL=developProject.js.map