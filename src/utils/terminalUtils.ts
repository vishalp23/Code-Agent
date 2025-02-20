// src/utils/terminalUtils.ts
import * as vscode from 'vscode';

export async function runCommandsSequentially(steps: { cmd: string; message: string }[], cwd: string): Promise<void> {
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

export async function launchProject(folder: string, command: string): Promise<void> {
  const terminal = vscode.window.createTerminal({ name: "Project Launch Terminal", cwd: folder });
  terminal.show();
  terminal.sendText(command);
}
