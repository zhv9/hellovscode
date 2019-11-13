import * as vscode from 'vscode';

export function informationMessage(message?: string): void {
  vscode.window.showInformationMessage(message || 'hello world');
}
