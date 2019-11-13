// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { informationMessage } from './informationMessage';
import { webViewPanel, webViewLocalContent, webViewWithMessage, webViewSwitchPic } from './webViewPanel';

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "helloworld-sample" is now active!'
  );

  const helloWorld = vscode.commands.registerCommand(
    'extension.helloWorld',
    () => {
      informationMessage();
    }
  );
  const helloWebView = vscode.commands.registerCommand(
    'extension.helloWebView',
    () => {
      webViewPanel(context);
    }
  );
  const helloWebViewLocalSrc = vscode.commands.registerCommand(
    'extension.helloWebViewLocalSCat',
    () => {
      webViewLocalContent(context);
    }
  );

  const helloWebViewWithMessage = vscode.commands.registerCommand(
    'extension.webViewWithMessage',
    () => {
      webViewWithMessage(context);
    }
  );

  const helloWebViewSwitchPic = vscode.commands.registerCommand(
    'extension.webViewSwitchPic',
    () => {
      webViewSwitchPic();
    }
  );

  context.subscriptions.push(helloWorld);
  context.subscriptions.push(helloWebView);
  context.subscriptions.push(helloWebViewLocalSrc);
  context.subscriptions.push(helloWebViewWithMessage);
  context.subscriptions.push(helloWebViewSwitchPic);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('Extension deactivated');
}
