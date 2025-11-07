/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { queryLLM } from '../utils/queryLLM';
import { ensureWorkspace } from './ensureWorkspace';
import { getFolderNameFromLLM, createProjectFolder } from '../utils/fileUtils';

export async function developProject(query: string): Promise<void> {
  const workspaceDir = await ensureWorkspace();
  if (!workspaceDir) {
    vscode.window.showErrorMessage("No workspace available.");
    return;
  }
  const folderName = await getFolderNameFromLLM(query);
  const projectFolder = path.join(workspaceDir, folderName);

  const prompt = `Generate complete source code for: "${query}"`;
  const responseText = await queryLLM(prompt);
  let files: { [key: string]: string };
  try {
    files = JSON.parse(responseText);
  } catch (error) {
    vscode.window.showErrorMessage("Failed to parse development code: " + (error instanceof Error ? error.message : error));
    return;
  }
  for (const [relativePath, content] of Object.entries(files)) {
    const filePath = path.join(projectFolder, relativePath);
    try {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content);
      console.log(`Updated file: ${filePath}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to write file ${relativePath}: ${error instanceof Error ? error.message : error}`);
    }
  }
  vscode.window.showInformationMessage("Project development complete.");
}
