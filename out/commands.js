"use strict";
// import * as vscode from 'vscode';
// import * as path from 'path';
// import * as fs from 'fs';
// import { runFullProjectWorkflow, developProject } from './projectSetup';
// import { determineIntent, queryLLM } from './llm';
// export function setupWebView(context: vscode.ExtensionContext, extensionUri: vscode.Uri): void {
//   const panel = vscode.window.createWebviewPanel(
//     'codeAgentPersistent',
//     'Code Agent',
//     vscode.ViewColumn.One,
//     {
//       enableScripts: true,
//       retainContextWhenHidden: true,
//       localResourceRoots: [vscode.Uri.file(path.join(extensionUri.fsPath, 'resources'))]
//     }
//   );
//   // Load the chat interface HTML
//   const htmlFilePath = path.join(extensionUri.fsPath, 'resources', 'chatInterface.html');
//   let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
//   // Fix paths for WebView assets
//   const resourceUri = vscode.Uri.file(path.join(extensionUri.fsPath, 'resources'));
//   const webviewResourceUri = panel.webview.asWebviewUri(resourceUri);
//   htmlContent = htmlContent.replace(/src="chatScript.js"/g, `src="${webviewResourceUri}/chatScript.js"`);
//   htmlContent = htmlContent.replace(/href="chatStyles.css"/g, `href="${webviewResourceUri}/chatStyles.css"`);
//   panel.webview.html = htmlContent;
//   // Register Commands
//   context.subscriptions.push(
//     vscode.commands.registerCommand('codeagent.setupProject', async (query: string) => {
//       await runFullProjectWorkflow(query);
//     }),
//     vscode.commands.registerCommand('codeagent.developProject', async (query: string) => {
//       await developProject(query);
//     })
//   );
//   // Handle messages from the WebView
//   panel.webview.onDidReceiveMessage(async (message: any) => {
//     if (message.command === 'ask') {
//       const intent = await determineIntent(message.text);
//       let responseText = "";
//       if (intent === "planning") {
//         responseText = await queryLLM(`Generate a plan for: "${message.text}"`);
//       } else if (intent === "setup") {
//         vscode.commands.executeCommand('codeagent.setupProject', message.text);
//         responseText = "Initiating project setup...";
//       } else if (intent === "development") {
//         vscode.commands.executeCommand('codeagent.developProject', message.text);
//         responseText = "Generating code...";
//       } else {
//         responseText = await queryLLM(message.text);
//       }
//       panel.webview.postMessage({ command: 'reply', text: responseText });
//     }
//   });
//   context.subscriptions.push(panel);
// }
//# sourceMappingURL=commands.js.map