import * as vscode from 'vscode';
import * as path from 'path';
import { getInnerHtml } from './webViewInner';

export function webViewPanel(context: vscode.ExtensionContext) {
  // 1. 使用 createWebviewPanel 创建一个 panel，然后给 panel 放入 html 即可展示 web view
  const panel = vscode.window.createWebviewPanel(
    'helloWorld',
    'Hello world',
    vscode.ViewColumn.One, // web view 显示位置
    {
      enableScripts: true, // 允许 JavaScript
      retainContextWhenHidden: true // 在 hidden 的时候保持不关闭
    }
  );
  const innerHtml = `<h1>Hello Web View</h1>`;
  panel.webview.html = getWebViewContent(innerHtml);

  // 2. 周期性改变 html 中的内容，因为是之间给 webview.html 赋值，所以是刷新整个内容
  function changeWebView() {
    const newData = Math.ceil(Math.random() * 100);
    panel.webview.html = getWebViewContent(`${innerHtml}<p>${newData}</p>`);
  }
  const interval = setInterval(changeWebView, 1000);

  // 3. 可以通过设置 panel.onDidDispose，让 webView 在关闭时执行一些清理工作。
  panel.onDidDispose(
    () => {
      clearInterval(interval);
    },
    null,
    context.subscriptions
  );
}

function getWebViewContent(body: string, pic?: vscode.Uri) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    ${body}
    <br />
    <img
      id="picture"
      src="${pic || 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif'}"
      width="300" />
  </body>
</html>
  `;
}

export function webViewLocalContent(context: vscode.ExtensionContext) {
  const panel = vscode.window.createWebviewPanel(
    'HelloWebViewLocalContent',
    'Web View Local Content',
    vscode.ViewColumn.One,
    {
      localResourceRoots: [
        vscode.Uri.file(path.join(context.extensionPath, 'media'))
      ]
    }
  );

  const onDiskPath = vscode.Uri.file(
    path.join(context.extensionPath, 'media', 'cat.jpg')
  );
  // 生成一个特殊的 URI 来给 web view 用。
  // 实际是：vscode-resource: 开头的一个 URI
  // 资源文件只能放到插件安装目录或则用户当前工作区里面
  // 1.38以后才有这个 API，前面版本可以用onDiskPath.with({ scheme: 'vscode-resource' });
  const catPicSrc = panel.webview.asWebviewUri(onDiskPath);
  const body = `<h1>hello local cat</h1>`;
  panel.webview.html = getWebViewContent(body, catPicSrc);
}

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export function webViewWithMessage(context: vscode.ExtensionContext) {
  if (currentPanel) {
    // 将存在的 panel 放到前台
    currentPanel.reveal(vscode.ViewColumn.One);
  } else {
    currentPanel = vscode.window.createWebviewPanel(
      'catCoding',
      'Cat Coding',
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );
    const cats = ['cat.jpg', 'cat.gif'].map(cat => {
      const onDiskPath = vscode.Uri.file(
        path.join(context.extensionPath, 'media', cat)
      );
      return currentPanel.webview.asWebviewUri(onDiskPath);
    });
    
    const body = getInnerHtml(cats);
    currentPanel.webview.html = getWebViewContent(body);
    currentPanel.onDidDispose(
      () => {
        currentPanel = undefined;
      },
      undefined,
      context.subscriptions
    );

    // 监听 webview 发来的消息
    webViewReceiveMessage(context, currentPanel);
  }
}

export function webViewSwitchPic() {
  if (!currentPanel) {
    return;
  }
  currentPanel.webview.postMessage({ command: 'switchPic' });
}

function webViewReceiveMessage(
  context: vscode.ExtensionContext,
  currentPanel: vscode.WebviewPanel
) {
  currentPanel.webview.onDidReceiveMessage(
    message => {
      switch (message.command) {
        case 'alert':
          vscode.window.showInformationMessage(message.text);
          return;
      }
    },
    undefined,
    context.subscriptions
  );
}
