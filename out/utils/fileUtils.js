"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectFolder = exports.getFolderNameFromLLM = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const queryLLM_1 = require("./queryLLM");
async function getFolderNameFromLLM(description) {
    const prompt = description
        ? `Based on the project description: "${description}", suggest a concise, URL-friendly folder name. Provide only the folder name in lowercase with no extra formatting.`
        : "Suggest a concise, URL-friendly folder name for a new project.";
    const response = await (0, queryLLM_1.queryLLM)(prompt);
    return response.replace(/[^a-z0-9-_]/gi, '').toLowerCase();
}
exports.getFolderNameFromLLM = getFolderNameFromLLM;
async function createProjectFolder(description, workspaceDir) {
    const folderName = await getFolderNameFromLLM(description);
    const projectFolder = path.join(workspaceDir, folderName);
    try {
        fs.mkdirSync(projectFolder, { recursive: true });
        return projectFolder;
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error creating project folder: ${error}`);
        return undefined;
    }
}
exports.createProjectFolder = createProjectFolder;
//# sourceMappingURL=fileUtils.js.map