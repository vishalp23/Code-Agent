"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureWorkspace = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
async function ensureWorkspace() {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        const defaultWorkspace = path.join(require('os').homedir(), "create-agent");
        if (!fs.existsSync(defaultWorkspace)) {
            fs.mkdirSync(defaultWorkspace);
        }
        return defaultWorkspace;
    }
    else {
        return workspaceFolders[0].uri.fsPath;
    }
}
exports.ensureWorkspace = ensureWorkspace;
//# sourceMappingURL=utils.js.map