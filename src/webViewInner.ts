import { Uri } from "vscode";

export function getInnerHtml(picture: Array<Uri|undefined>): string {
  return `<div>
    <h1>Hello Web View</h1>
    <img id="picture" src="" />
    <script>
      const picture = document.getElementById('picture');
      const vscode = acquireVsCodeApi();
      let picIndex = 0;
      const imagePath = [
        '${picture[0] || "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif"}',
        '${picture[1] || "https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif"}'
      ];
      picture.src = imagePath[picIndex];
  
      // 监听插件发送过来的消息
      window.addEventListener('message', event => {
        const message = event.data; // 插件所发送的json数据
        debugger
        switch (message.command) {
          case 'switchPic':
            picIndex = (picIndex + 1) % 2;
            picture.src = imagePath[picIndex];
            // 给插件发送消息
            vscode.postMessage({
              command: 'alert',
              text: imagePath[picIndex]
            });
            break;
        }
      });
    </script>
  </div>`
}
