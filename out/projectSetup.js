"use strict";
// import * as vscode from 'vscode';
// import * as path from 'path';
// import * as fs from 'fs';
// import { queryLLM } from './llm';
// export async function developProject(query: string, projectFolder: string): Promise<void> {
//   const prompt = `
// You are an expert software developer.
// Given the project description: "${query}",
// generate complete, production-ready source code for the project.
// Return a JSON object where each key is a relative file path (within the project folder) and each value is the complete file content.
// Return only valid JSON.
//   `;
//   let responseText: string;
//   try {
//     responseText = await queryLLM(prompt);
//   } catch (error) {
//     vscode.window.showErrorMessage("Error generating development code: " + (error instanceof Error ? error.message : error));
//     return;
//   }
//   let files: { [key: string]: string };
//   try {
//     files = JSON.parse(responseText);
//   } catch (error) {
//     vscode.window.showErrorMessage("Failed to parse development code: " + (error instanceof Error ? error.message : error));
//     return;
//   }
//   // ✅ Ensure the project folder exists before creating files
//   if (!fs.existsSync(projectFolder)) {
//     fs.mkdirSync(projectFolder, { recursive: true });
//     console.log(`Created project folder: ${projectFolder}`);
//   }
//   // ✅ Loop through each generated file and write to disk
//   for (const relativePath in files) {
//     const filePath = path.join(projectFolder, relativePath);
//     const dir = path.dirname(filePath);
//     try {
//       // ✅ Ensure the directory for the file exists
//       if (!fs.existsSync(dir)) {
//         fs.mkdirSync(dir, { recursive: true });
//         console.log(`Created directory: ${dir}`);
//       }
//       // ✅ Convert JSON content to a string if needed
//       const fileContent = typeof files[relativePath] === 'string'
//         ? files[relativePath]
//         : JSON.stringify(files[relativePath], null, 2);
//       fs.writeFileSync(filePath, fileContent);
//       console.log(`Generated file: ${filePath}`);
//     } catch (error) {
//       vscode.window.showErrorMessage(`Failed to write file ${relativePath}: ${error instanceof Error ? error.message : error}`);
//     }
//   }
//   vscode.window.showInformationMessage(`Development phase complete. ${Object.keys(files).length} files generated.`);
// }
//# sourceMappingURL=projectSetup.js.map