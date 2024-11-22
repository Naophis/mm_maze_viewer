const svg = document.querySelector('svg');
let wallData = []; // デフォルトの空のデータ（後で初期化される）

window.addEventListener('message', (event) => {
  if (event.data.command === 'initialize') {
    wallData = event.data.wallData;
    console.log('Wall data initialized:', wallData);
  }
});

// クリックイベントの登録
svg.addEventListener('click', (event) => {
  console.log(event.target.tagName);
  const rect = event.target;
  if (rect.tagName === 'rect' && rect.hasAttribute('data-wall')) {
    const line = event.target;
    const index = parseInt(line.getAttribute('data-index'), 10);
    const wall = line.getAttribute('data-wall');
    // 更新データを拡張機能に送信
    vscode.postMessage({
      command: 'updateMaze',
      index: index,
      wall: wall
    });
  }
});

// VSCodeとの通信
const vscode = acquireVsCodeApi();
