"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDependenciesUsingLLM = void 0;
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const child_process_1 = require("child_process");
const node_fetch_1 = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    vscode.window.showErrorMessage("Missing OPENAI_API_KEY in .env file.");
}
/**
 * Queries the LLM using GPT-4o-mini.
 */
async function queryLLM(prompt) {
    const response = await (0, node_fetch_1.default)('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
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
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}
/**
 * Reads the immediate file and directory names in the given project folder.
 */
function getProjectFileList(projectFolder) {
    try {
        const items = fs.readdirSync(projectFolder);
        return items.join('\n');
    }
    catch (error) {
        return "";
    }
}
/**
 * Uses the LLM to decide the command(s) to extract dependencies for the project.
 * It reads a simple file list from the project folder and asks the LLM for the appropriate
 * command(s) (e.g., "pip freeze > requirements.txt" for Python or "npm ls --depth=0 --json > dependencies.json" for Node.js).
 * Then it executes the command(s) and shows the output.
 */
async function extractDependenciesUsingLLM(projectFolder) {
    // Get a simple file list from the project folder.
    const fileList = getProjectFileList(projectFolder);
    // Construct a prompt with the project folder contents.
    const prompt = `
I have a project with the following file structure (one entry per line):
${fileList}

Based on this file structure, determine the appropriate command(s) to extract a list of installed dependencies.
For example:
- For a Python project, you might use "pip freeze > requirements.txt".
- For a Node.js project, you might use "npm ls --depth=0 --json > dependencies.json".
Return only the command(s) in plain text (if multiple commands, separate them with a newline).
`;
    let commandText;
    try {
        commandText = await queryLLM(prompt);
    }
    catch (error) {
        vscode.window.showErrorMessage("Error determining dependency extraction command: " + (error instanceof Error ? error.message : error));
        return;
    }
    vscode.window.showInformationMessage("Extracting dependencies with command(s): " + commandText);
    // Execute the command(s) in the project folder.
    // If multiple commands are returned, we split by newline.
    const commands = commandText.split(/\r?\n/).map(cmd => cmd.trim()).filter(cmd => cmd.length > 0);
    for (const cmd of commands) {
        (0, child_process_1.exec)(cmd, { cwd: projectFolder }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Error executing "${cmd}": ${stderr || error.message}`);
            }
            else {
                vscode.window.showInformationMessage(`Command "${cmd}" executed successfully. Output:\n${stdout}`);
            }
        });
    }
}
exports.extractDependenciesUsingLLM = extractDependenciesUsingLLM;
//# sourceMappingURL=dependencyExtractor.js.map