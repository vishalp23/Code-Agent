"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupProject = void 0;
// src/commands/setupProject.ts
const vscode = require("vscode");
const queryLLM_1 = require("../utils/queryLLM");
const terminalUtils_1 = require("../utils/terminalUtils");
const ensureWorkspace_1 = require("./ensureWorkspace");
const fileUtils_1 = require("../utils/fileUtils");
async function setupProject(query) {
    const setupResult = await (0, queryLLM_1.getProjectSetupStepsFromInput)(query);
    const workspaceDir = await (0, ensureWorkspace_1.ensureWorkspace)();
    if (!workspaceDir) {
        vscode.window.showErrorMessage("No workspace available.");
        return;
    }
    const projectFolder = await (0, fileUtils_1.createProjectFolder)(query, workspaceDir);
    if (!projectFolder) {
        vscode.window.showErrorMessage("Failed to create project folder.");
        return;
    }
    await (0, terminalUtils_1.runCommandsSequentially)(setupResult.steps, projectFolder);
    await (0, terminalUtils_1.launchProject)(projectFolder, setupResult.launchCommand);
    vscode.window.showInformationMessage("Project setup complete.");
}
exports.setupProject = setupProject;
//# sourceMappingURL=setupProject.js.map