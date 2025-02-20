// src/vscode-extensions.d.ts

import * as vscode from 'vscode';

declare module 'vscode' {
  // Minimal definitions for the webview view APIs

  export interface Webview {
    // (Add any properties or methods as needed; leave empty for now.)
  }

  export interface WebviewView {
    readonly webview: Webview;
    // (Add additional properties if needed.)
  }

  export interface WebviewViewResolveContext {
    readonly webviewOptions?: {
      enableFindWidget?: boolean;
      // Add other options as needed.
    };
  }

  export interface WebviewViewProvider {
    resolveWebviewView(
      webviewView: WebviewView,
      context: WebviewViewResolveContext,
      token: vscode.CancellationToken
    ): void | Thenable<void>;
  }

  // Augment the window namespace with the missing registerWebviewViewProvider method.
  export namespace window {
    export function registerWebviewViewProvider(
      viewType: string,
      provider: WebviewViewProvider
    ): vscode.Disposable;
  }
}
