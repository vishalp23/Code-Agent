/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import * as os from 'os';
import { exec } from 'child_process';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    vscode.window.showErrorMessage("Missing OPENAI_API_KEY in .env file.");
}

/** Interfaces **/
interface OpenAIResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

interface SetupStep {
    cmd: string;
    message: string;
}

interface SetupResult {
    steps: SetupStep[];
    finalProjectFolder: string;  // Relative folder path (e.g., "TodoApp" or "." if in the root)
    launchCommand: string;       // Terminal command to launch the project (e.g., "npm start")
    virtualEnv?: string;         // Optional: name of the virtual environment folder (if applicable)
}

/**
 * Detects detailed environment information.
 */
function detectEnvironment(): { [key: string]: any } {
    return {
        platform: os.platform(),  // e.g., 'darwin', 'linux', 'win32'
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
 * Queries the LLM using GPT-4o-mini.
 */
async function queryLLM(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini', // Adjust as needed
            messages: [
                { role: 'system', content: 'Respond with clear and structured text.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7
        })
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LLM API error: ${response.status} ${errorText}`);
    }
    const data = await response.json() as OpenAIResponse;
    return data.choices?.[0]?.message?.content || '';
}

/**
 * Queries the LLM for error resolution.
 */
async function queryLLMForErrorResolution(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini', // Adjust if desired
            messages: [
                { role: 'system', content: 'You are an expert troubleshooting assistant specialized in resolving technical errors with clear, actionable suggestions.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.2
        })
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`LLM API error: ${response.status} ${errorText}`);
    }
    const data = await response.json() as OpenAIResponse;
    return data.choices?.[0]?.message?.content || '';
}

/**
 * Determines the user's intent from their query.
 */
async function determineIntent(query: string): Promise<string> {
    const prompt = `
You are an intelligent assistant that classifies user queries for a project development agent.
Given the user query below, determine the user's intent:
- If the user is asking for a detailed plan for project requirements and technology stack, reply with "planning".
- If the user is asking to create, set up, or build a project, reply with "setup".
- If the user is asking to start coding (development), reply with "development".
- Otherwise, reply with "general".
Return only one keyword: planning, setup, development, or general.

User query: "${query}"
`;
    const intent = await queryLLM(prompt);
    return intent.trim().toLowerCase();
}

/**
 * Asks the LLM for dynamic project setup steps.
 * Returns a JSON object with keys:
 *  - steps: an array of SetupStep objects,
 *  - finalProjectFolder: the relative folder path (from the project folder) where the main project files reside,
 *  - launchCommand: the terminal command to launch the project,
 *  - virtualEnv: (optional) the name of the virtual environment folder.
 */
async function getProjectSetupStepsFromInput(input: string): Promise<SetupResult> {
    const envInfo = detectEnvironment();
    const prompt = `
You are an expert DevOps engineer and project automation assistant.
Based on the following project setup request: "${input}",
and the following environment details: ${JSON.stringify(envInfo)},
please provide a JSON object with four keys:
- "steps": an array of terminal setup steps tailored for this project. Each step must be an object with exactly two keys:
    - "cmd": the terminal command to run (use the latest scaffolding commands where appropriate).
    - "message": a brief description of what that command does.
- "finalProjectFolder": a string indicating the relative folder path (from the project folder) where the main project files (including configuration files) are located (use "." if in the root).
- "launchCommand": the terminal command to launch or run the project (e.g., "npm start").
- "virtualEnv": (optional) the name of the virtual environment folder (e.g., "venv").
Return only valid JSON without any extra text or markdown formatting.
`;
    const responseText = await queryLLM(prompt);
    try {
        const result = JSON.parse(responseText) as SetupResult;
        return result;
    } catch (error) {
        throw new Error("Failed to parse dynamic setup steps from the AI response.");
    }
}

/**
 * Ensures that a workspace is active.
 * If no workspace is open, creates (or reuses) a folder named "create-agent" in the user's home directory and opens it.
 */
async function ensureWorkspace(): Promise<string | undefined> {
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
        } catch (error) {
            vscode.window.showErrorMessage(`Error creating workspace folder: ${error instanceof Error ? error.message : String(error)}`);
            return undefined;
        }
    } else {
        return workspaceFolders[0].uri.fsPath;
    }
}

/**
 * Generates a dynamic folder name based on a project description using the LLM.
 */
async function getFolderNameFromLLM(description?: string): Promise<string> {
    try {
        const prompt = description
            ? `Based on the project description: "${description}", please suggest a concise, URL-friendly folder name for this project. Provide only the folder name in lowercase with no extra formatting.`
            : "Please suggest a concise, URL-friendly folder name for a new project. Provide only the folder name in lowercase with no extra formatting.";
        const folderNameSuggestion = await queryLLM(prompt);
        const cleanedName = folderNameSuggestion
            .replace(/[#`]/g, '')
            .trim()
            .split('\n')[0]
            .toLowerCase()
            .replace(/[^a-z0-9-_]/g, '');
        return cleanedName || "new-project-2025";
    } catch (error) {
        console.error("Error in getFolderNameFromLLM:", error);
        return "new-project-2025";
    }
}

/**
 * Creates a new project folder inside the current workspace based on the project description.
 */
async function createProjectFolder(projectDescription: string, workspaceDir: string): Promise<string | undefined> {
    const folderName = await getFolderNameFromLLM(projectDescription);
    const projectFolderPath = path.join(workspaceDir, folderName);
    const projectFolderUri = vscode.Uri.file(projectFolderPath);
    try {
        await vscode.workspace.fs.createDirectory(projectFolderUri);
        vscode.window.showInformationMessage(`Created project folder: ${projectFolderPath}`);
        return projectFolderPath;
    } catch (error) {
        vscode.window.showErrorMessage(`Error creating project folder: ${error instanceof Error ? error.message : String(error)}`);
        return undefined;
    }
}

/**
 * Returns a promise that resolves after the specified delay (in milliseconds).
 */
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Uses the integrated terminal to execute setup commands sequentially in an interactive manner.
 */
async function runCommandsSequentially(steps: SetupStep[], cwd: string): Promise<void> {
    const terminal = vscode.window.createTerminal({ name: "Project Setup Terminal", cwd });
    terminal.show();
    // Change to the project folder.
    terminal.sendText(`cd "${cwd}"`);
    for (const step of steps) {
        vscode.window.showInformationMessage(`Processing: ${step.cmd} - ${step.message}`);
        terminal.sendText(`echo ${step.message}`);
        terminal.sendText(step.cmd);
        console.log(`Sent command: ${step.cmd} in ${cwd}`);
        await delay(5000); // Adjust delay as needed.
    }
}

/**
 * Launches the project by using an existing terminal (if available) to run the launch command.
 */
async function launchProject(finalFolder: string, launchCommand: string): Promise<void> {
    let terminal = vscode.window.terminals.find(t => t.name === "Project Launch Terminal");
    if (!terminal) {
        if (vscode.window.terminals.length > 0) {
            terminal = vscode.window.terminals[0];
        } else {
            vscode.window.showErrorMessage("No active terminal available for launching the project.");
            return;
        }
    }
    terminal.sendText(`cd "${finalFolder}"`);
    terminal.show();
    terminal.sendText(launchCommand);
}

/**
 * Uses the LLM to generate complete project code.
 * Expects a JSON object mapping relative file paths to file contents.
 */
async function developProject(query: string, projectFolder: string): Promise<void> {
    const prompt = `
You are an expert software developer.
Given the project description: "${query}",
generate complete, production-ready source code for the project.
Return a JSON object where each key is a relative file path (within the project folder) and each value is the complete file content.
Return only valid JSON.
`;
    let responseText: string;
    try {
        responseText = await queryLLM(prompt);
    } catch (error) {
        vscode.window.showErrorMessage("Error generating development code: " + (error instanceof Error ? error.message : error));
        return;
    }
    
    // Remove markdown code fences if present.
    responseText = stripCodeFences(responseText);
    let files: { [key: string]: string };
    try {
        files = JSON.parse(responseText);
    } catch (error) {
        vscode.window.showErrorMessage("Failed to parse development code: " + (error instanceof Error ? error.message : error));
        return;
    }
    
    for (const relativePath in files) {
        const filePath = path.join(projectFolder, relativePath);
        try {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const fileContent = typeof files[relativePath] === 'string'
                ? files[relativePath]
                : JSON.stringify(files[relativePath], null, 2);
            fs.writeFileSync(filePath, fileContent);
            console.log(`Updated file: ${filePath}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to write file ${relativePath}: ` + (error instanceof Error ? error.message : error));
        }
    }
    
    vscode.window.showInformationMessage("Development phase complete. Source code generated.");
}

/**
 * Strips markdown code fences from the provided text.
 */
function stripCodeFences(text: string): string {
    return text.replace(/^```(?:\w+)?\s*/, '').replace(/```$/, '').trim();
}

/**
 * Runs the project setup steps dynamically based on the provided query.
 */
async function runProjectSetupSteps(query: string): Promise<void> {
    const setupResult = await getProjectSetupStepsFromInput(query);
    const steps = setupResult.steps;

    // Ensure workspace exists and get its directory.
    const workspaceDir = await ensureWorkspace();
    if (!workspaceDir) {
        vscode.window.showErrorMessage("No workspace available. Please open a workspace first.");
        return;
    }

    // Create the project folder.
    const newProjectFolder = await createProjectFolder(query, workspaceDir);
    if (!newProjectFolder) {
        vscode.window.showErrorMessage("Failed to create the project folder.");
        return;
    }

    console.log("Using project folder:", newProjectFolder);
    console.log("Setup steps:", steps);

    // Execute the setup commands sequentially.
    await runCommandsSequentially(steps, newProjectFolder);

    // Determine the final folder where project files should reside.
    const finalFolder = (setupResult.finalProjectFolder && setupResult.finalProjectFolder.trim() !== "" && setupResult.finalProjectFolder.trim() !== ".")
        ? path.join(newProjectFolder, setupResult.finalProjectFolder)
        : newProjectFolder;

    try {
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(finalFolder));
        console.log(`Final folder created or already exists: ${finalFolder}`);
    } catch (error) {
        console.error("Error creating final folder:", error);
    }

    // Launch the project.
    await launchProject(finalFolder, setupResult.launchCommand);
    vscode.window.showInformationMessage("Setup complete. Awaiting development command...");
}

/**
 * Runs the full project workflow: first setup, then awaits a separate development command.
 */
async function runFullProjectWorkflow(query: string): Promise<void> {
    await runProjectSetupSteps(query);
    // After setup, the extension awaits a "development" command via the webview.
}

/**
 * Runs the development phase using the LLM to generate complete project code.
 */
async function runDevelopmentPhase(query: string): Promise<void> {
    const workspaceDir = await ensureWorkspace();
    if (!workspaceDir) {
        vscode.window.showErrorMessage("No workspace available.");
        return;
    }
    // Use the same project folder name generated during setup.
    const folderName = await getFolderNameFromLLM(query);
    const projectFolder = path.join(workspaceDir, folderName);
    await developProject(query, projectFolder);
}

/**
 * Provides a high-level outline for the project workflow.
 */
async function provideOutline(userQuery: string): Promise<string> {
    const prompt = `
You are an expert project planning assistant.
Given the following project request:
"${userQuery}"
Provide a high-level outline of the major steps required to implement the project.
Do NOT provide any code or commands yet. Just return an outline in plain text.
`;
    return await queryLLM(prompt);
}

/**
 * Sends the outline and option buttons to the webview.
 */
function postOutlineWithOptions(panel: vscode.WebviewPanel, outlineText: string, userQuery: string) {
    panel.webview.postMessage({
        command: 'showOutlineAndOptions',
        outline: outlineText,
        userQuery,
        options: [
            { label: 'Setup Only', command: 'codeagent.setupProject' },
            { label: 'Full Development', command: 'codeagent.fullDevelopment' }
        ]
    });
}

/**
 * Registers commands and creates the persistent webview panel.
 */
export function activate(context: vscode.ExtensionContext): void {
    const extensionUri = context.extensionUri;

    // Ensure workspace exists.
    ensureWorkspace().then(ws => {
        if (!ws) {
            vscode.window.showErrorMessage("Failed to create or retrieve workspace. Extension will not proceed.");
            return;
        }
        console.log("Workspace set to:", ws);

        // Register the "setup only" command.
        const setupProjectDisposable = vscode.commands.registerCommand('codeagent.setupProject', async (query: string) => {
            vscode.window.showInformationMessage(`Running setup for: ${query}`);
            await runFullProjectWorkflow(query);
        });
        context.subscriptions.push(setupProjectDisposable);

        // Register the "full development" command.
        const fullDevDisposable = vscode.commands.registerCommand('codeagent.fullDevelopment', async (query: string) => {
            vscode.window.showInformationMessage(`Running full development for: ${query}`);
            await runFullProjectWorkflow(query);
        });
        context.subscriptions.push(fullDevDisposable);

        // Register a separate command for just the development phase.
        const developProjectDisposable = vscode.commands.registerCommand('codeagent.developProject', async (query: string) => {
            vscode.window.showInformationMessage(`Running development phase for: ${query}`);
            await runDevelopmentPhase(query);
        });
        context.subscriptions.push(developProjectDisposable);

        // Create a persistent webview panel.
        const panel = vscode.window.createWebviewPanel(
            'codeAgentPersistent',
            'Code Agent',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(extensionUri.fsPath, 'resources'))]
            }
        );

        // Load the chat interface HTML from the resources folder.
        const htmlFilePath = path.join(extensionUri.fsPath, 'resources', 'chatInterface.html');
        let htmlContent = "";
        try {
            htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
        } catch (error) {
            vscode.window.showErrorMessage("Failed to load chat interface HTML: " + error);
        }
        // Adjust paths for local CSS/JS in the webview if needed.
        const resourceUri = vscode.Uri.file(path.join(context.extensionPath, 'resources'));
        const webviewResourceUri = panel.webview.asWebviewUri(resourceUri);
        htmlContent = htmlContent.replace(/src="chatScript.js"/g, `src="${webviewResourceUri}/chatScript.js"`);
        htmlContent = htmlContent.replace(/href="chatStyles.css"/g, `href="${webviewResourceUri}/chatStyles.css"`);
        panel.webview.html = htmlContent;

        // Listen for messages from the webview.
        panel.webview.onDidReceiveMessage(async (message: any) => {
            if (message.command === 'ask') {
                try {
                    const intent = await determineIntent(message.text);
                    if (intent === "planning") {
                        const planningDoc = await queryLLM(`Generate a detailed plan defining requirements, key features, and a recommended technology stack for: "${message.text}"`);
                        panel.webview.postMessage({ command: 'reply', text: planningDoc });
                    } else if (intent === "setup") {
                        // When the user selects setup, send the query to the setup command.
                        vscode.commands.executeCommand('codeagent.setupProject', message.text);
                        panel.webview.postMessage({ command: 'reply', text: "Initiating project setup with dynamic commands..." });
                    } else if (intent === "development") {
                        vscode.commands.executeCommand('codeagent.developProject', message.text);
                        panel.webview.postMessage({ command: 'reply', text: "Initiating development phase. Generating code..." });
                    } else {
                        const responseText = await queryLLM(message.text);
                        panel.webview.postMessage({ command: 'reply', text: responseText });
                    }
                } catch (error: unknown) {
                    let errorMessage = 'Unknown error';
                    if (error instanceof Error) {
                        errorMessage = error.message;
                    }
                    panel.webview.postMessage({ command: 'reply', text: `Error: ${errorMessage}` });
                }
            }
        });

        context.subscriptions.push(panel);
        vscode.window.showInformationMessage("Code Agent activated!");
    });
}

export function deactivate(): void {}
