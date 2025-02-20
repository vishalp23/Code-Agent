// src/commands/setupProject.ts
import * as vscode from 'vscode';
import * as path from 'path';
import { getProjectSetupStepsFromInput } from '../utils/queryLLM';
import { runCommandsSequentially, launchProject } from '../utils/terminalUtils';
import { ensureWorkspace } from './ensureWorkspace';
import { createProjectFolder } from '../utils/fileUtils';

export async function setupProject(query: string): Promise<void> {
  const setupResult = await getProjectSetupStepsFromInput(query);
  const workspaceDir = await ensureWorkspace();
  if (!workspaceDir) {
    vscode.window.showErrorMessage("No workspace available.");
    return;
  }
  const projectFolder = await createProjectFolder(query, workspaceDir);
  if (!projectFolder) {
    vscode.window.showErrorMessage("Failed to create project folder.");
    return;
  }
  await runCommandsSequentially(setupResult.steps, projectFolder);
  await launchProject(projectFolder, setupResult.launchCommand);
  vscode.window.showInformationMessage("Project setup complete.");
}
