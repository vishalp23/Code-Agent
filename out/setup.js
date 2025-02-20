"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runProjectSetupSteps = exports.createProjectFolder = exports.ensureWorkspace = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const os = require("os");
const llm_1 = require("./llm"); // Import queryLLM function from a separate utility file
/**
 * Detects detailed environment information.
 */
function detectEnvironment() {
    return {
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        nodeVersion: process.version,
        homeDir: os.homedir(),
        cwd: process.cwd(),
        cpuCount: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem()
    };
}
/**
 * Ensures that a workspace is active.
 */
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
/**
 * Generates a dynamic folder name based on a project description.
 */
async function getFolderNameFromLLM(description) {
    const prompt = description
        ? `Based on the project description: "${description}", suggest a concise, URL-friendly folder name. Return only the folder name in lowercase with no extra formatting.`
        : "Suggest a concise, URL-friendly folder name for a new project. Return only the folder name in lowercase with no extra formatting.";
    const folderNameSuggestion = await (0, llm_1.queryLLM)(prompt);
    return folderNameSuggestion.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') || "new-project-2025";
}
/**
 * Creates a new project folder inside the workspace.
 */
async function createProjectFolder(projectDescription, workspaceDir) {
    const folderName = await getFolderNameFromLLM(projectDescription);
    const projectFolderPath = path.join(workspaceDir, folderName);
    const projectFolderUri = vscode.Uri.file(projectFolderPath);
    try {
        await vscode.workspace.fs.createDirectory(projectFolderUri);
        vscode.window.showInformationMessage(`Created project folder: ${projectFolderPath}`);
        return projectFolderPath;
    }
    catch (error) {
        vscode.window.showErrorMessage(`Error creating project folder: ${error instanceof Error ? error.message : String(error)}`);
        return undefined;
    }
}
exports.createProjectFolder = createProjectFolder;
/**
 * Uses the integrated terminal to execute setup commands sequentially.
 */
async function runCommandsSequentially(steps, cwd) {
    const terminal = vscode.window.createTerminal({ name: "Project Setup Terminal", cwd });
    terminal.show();
    terminal.sendText(`cd "${cwd}"`);
    for (const step of steps) {
        vscode.window.showInformationMessage(`Processing: ${step.cmd} - ${step.message}`);
        terminal.sendText(`echo ${step.message}`);
        terminal.sendText(step.cmd);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Delay to allow execution
    }
}
/**
 * Launches the project using an existing terminal.
 */
async function launchProject(finalFolder, launchCommand) {
    let terminal = vscode.window.terminals.find(t => t.name === "Project Launch Terminal");
    if (!terminal) {
        if (vscode.window.terminals.length > 0) {
            terminal = vscode.window.terminals[0];
        }
        else {
            vscode.window.showErrorMessage("No active terminal available for launching the project.");
            return;
        }
    }
    terminal.sendText(`cd "${finalFolder}"`);
    terminal.show();
    terminal.sendText(launchCommand);
}
/**
 * Runs the project setup steps dynamically.
 */
async function runProjectSetupSteps(query) {
    const envInfo = detectEnvironment();
    const setupPrompt = `
You are an expert DevOps engineer. Based on the setup request: "${query}" and the environment details: ${JSON.stringify(envInfo)},
provide a JSON object with:
- "steps": array of setup commands.
- "finalProjectFolder": where main project files are stored.
- "launchCommand": command to launch the project.
Return only JSON.
`;
    const setupResult = JSON.parse(await (0, llm_1.queryLLM)(setupPrompt));
    const workspaceDir = await ensureWorkspace();
    if (!workspaceDir) {
        vscode.window.showErrorMessage("No workspace available.");
        return;
    }
    const newProjectFolder = await createProjectFolder(query, workspaceDir);
    if (!newProjectFolder)
        return;
    await runCommandsSequentially(setupResult.steps, newProjectFolder);
    const finalFolder = setupResult.finalProjectFolder
        ? path.join(newProjectFolder, setupResult.finalProjectFolder)
        : newProjectFolder;
    await launchProject(finalFolder, setupResult.launchCommand);
    vscode.window.showInformationMessage("Setup complete.");
}
exports.runProjectSetupSteps = runProjectSetupSteps;
//# sourceMappingURL=setup.js.map