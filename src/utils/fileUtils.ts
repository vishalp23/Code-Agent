// src/utils/fileUtils.ts
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { queryLLM } from './queryLLM';

export async function getFolderNameFromLLM(description?: string): Promise<string> {
  const prompt = description
    ? `Based on the project description: "${description}", suggest a concise, URL-friendly folder name. Provide only the folder name in lowercase with no extra formatting.`
    : "Suggest a concise, URL-friendly folder name for a new project.";
  const response = await queryLLM(prompt);
  return response.replace(/[^a-z0-9-_]/gi, '').toLowerCase();
}

export async function createProjectFolder(description: string, workspaceDir: string): Promise<string | undefined> {
  const folderName = await getFolderNameFromLLM(description);
  const projectFolder = path.join(workspaceDir, folderName);
  try {
    fs.mkdirSync(projectFolder, { recursive: true });
    return projectFolder;
  } catch (error) {
    vscode.window.showErrorMessage(`Error creating project folder: ${error}`);
    return undefined;
  }
}
