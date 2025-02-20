"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.developProject = void 0;
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
    const files = JSON.parse(responseText);
    for (const [relativePath, content] of Object.entries(files)) {
        const filePath = path.join(projectFolder, relativePath);
        fs.writeFileSync(filePath, content);
    }
    vscode.window.showInformationMessage("Project development complete.");
}
exports.developProject = developProject;
//# sourceMappingURL=developProject.js.map