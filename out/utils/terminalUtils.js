"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launchProject = exports.runCommandsSequentially = void 0;
// src/utils/terminalUtils.ts
const vscode = require("vscode");
async function runCommandsSequentially(steps, cwd) {
    const terminal = vscode.window.createTerminal({ name: "Project Setup Terminal", cwd });
    terminal.show();
    terminal.sendText(`cd "${cwd}"`);
    for (const step of steps) {
        vscode.window.showInformationMessage(`Processing: ${step.cmd} - ${step.message}`);
        terminal.sendText(`echo ${step.message}`);
        terminal.sendText(step.cmd);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}
exports.runCommandsSequentially = runCommandsSequentially;
async function launchProject(folder, command) {
    const terminal = vscode.window.createTerminal({ name: "Project Launch Terminal", cwd: folder });
    terminal.show();
    terminal.sendText(command);
}
exports.launchProject = launchProject;
//# sourceMappingURL=terminalUtils.js.map