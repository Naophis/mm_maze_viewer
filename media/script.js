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
  if (rect.tagName === 'rect') {
    if (rect.hasAttribute('data-wall')) {
      const line = event.target;
      const index = parseInt(line.getAttribute('data-index'), 10);
      const wall = line.getAttribute('data-wall');
      // 更新データを拡張機能に送信
      vscode.postMessage({
        command: 'updateMaze',
        index: index,
        wall: wall
      });
    } else if (rect.hasAttribute('data-cell')) {
      // 更新データを拡張機能に送信
      const line = event.target;
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
      const cell_size = parseInt(line.getAttribute('height'), 10);
      const relativeX = svgPoint.x % cell_size; // セル内のX座標
      const relativeY = svgPoint.y % cell_size; // セル内のY座標
      const index = parseInt(line.getAttribute('data-index'), 10);
      // 対角線で4分割して分類
      let region;
      if ((relativeY < relativeX) && (relativeY < cell_size - relativeX)) {
        region = "north"; // 上
      } else if ((relativeY < relativeX) && (relativeY >= cell_size - relativeX)) {
        region = "east"; // 右
      } else if ((relativeY >= relativeX) && (relativeY >= cell_size - relativeX)) {
        region = "south"; // 下
      } else {
        region = "west"; // 左
      }
      vscode.postMessage({
        command: 'updateMaze',
        index: index,
        wall: region,
        x: relativeX,
        y: relativeY
      });
    }
  }
});

// VSCodeとの通信
const vscode = acquireVsCodeApi();
