import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.generateImage', async () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('No active editor found!');
			return;
		}

		const document = editor.document;
		if (document.languageId !== 'maze') {
			vscode.window.showErrorMessage('This command works only with .maze files!');
			return;
		}

		let text = document.getText();

		// Webviewの設定
		const panel = vscode.window.createWebviewPanel(
			'svgPreview',
			'Maze Preview',
			vscode.ViewColumn.Beside,
			{
				enableScripts: true,
			}
		);

		// メディアファイルへのパスを解決
		const scriptPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'script.js'));
		const scriptUri = panel.webview.asWebviewUri(scriptPath);

		// SVG生成とWebviewのHTMLを設定

		let maze_data = text.split(",").map(Number);

		let svgContent = generateMicroMouseSvg(maze_data);
		panel.webview.html = getWebviewContent(svgContent, scriptUri);

		// Webviewからのメッセージを受信
		panel.webview.onDidReceiveMessage((message) => {
			console.log('Received message:', message);
			if (message.command === 'updateMaze') {
				const idx = message.index;
				const x = idx % 32;
				const y = Math.floor(idx / 32);
				// const x = Math.floor(idx / 32);
				// const y = idx % 32;
				// console.log(x, y, maze_data[idx] & 0x0f,message.wall);
				if (message.wall == "north") {
					maze_data[idx] = maze_data[idx] ^ 0b0001;
					if (y < 31) {
						maze_data[idx + 1] = maze_data[idx + 1] ^ 0b1000;
					}
				} else if (message.wall == "east") {
					maze_data[idx] = maze_data[idx] ^ 0b0010;
					if (x < 31) {
						maze_data[idx + 32] = maze_data[idx + 32] ^ 0b0100;
					}
				} else if (message.wall == "west") {
					maze_data[idx] = maze_data[idx] ^ 0b0100;
					if (x > 0) {
						maze_data[idx - 32] = maze_data[idx - 32] ^ 0b0010;
					}
				} else if (message.wall == "south") {
					maze_data[idx] = maze_data[idx] ^ 0b1000;
					if (y > 0) {
						maze_data[idx - 1] = maze_data[idx - 1] ^ 0b0001;
					}
				}

				const edit = new vscode.WorkspaceEdit();
				const documentUri = document.uri;

				// `.maze` ファイルの内容を更新
				edit.replace(
					documentUri,
					new vscode.Range(0, 0, document.lineCount, 0),
					maze_data.join(",")
				);
				vscode.workspace.applyEdit(edit);
				svgContent = generateMicroMouseSvg(maze_data);
				panel.webview.html = getWebviewContent(svgContent, scriptUri);
			}
		});
	});

	context.subscriptions.push(disposable);
}

const renderMaze = () => {

}

export function deactivate() { }

function generateMicroMouseSvg(wallData: number[]): string {
	const cellSize = 40; // 1マスのサイズ
	const gridSize = 32; // グリッドのサイズ（16x16）
	const wallThickness = 5; // 壁の厚さ
	const svgWidth = cellSize * gridSize;
	const svgHeight = cellSize * gridSize;

	let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" >`;

	svgContent += `<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="black" stroke="gray" />`;
	// グリッドの描画

	for (let idx = 0; idx < wallData.length; idx++) {
		if (idx >= gridSize * gridSize) break;
		const wall = wallData[idx]; // マスの壁情報を取得
		// const x = idx % gridSize;
		// const y = Math.floor(idx / gridSize);
		const x = Math.floor(idx / gridSize);
		const y = idx % gridSize;

		const xStart = x * cellSize;
		const yStart = cellSize * gridSize - y * cellSize;
		// 北の壁
		svgContent += `<rect data-index="${idx}" x="${xStart}" y="${yStart}" width="${cellSize}" height="${cellSize}" fill="black" stroke="gray" />`;

		// 北の壁
		if (wall & 0b0001) {
			svgContent += `<rect data-index="${idx}" data-value="${wall}" data-wall="north" x="${xStart}" y="${yStart}" width="${cellSize}" height="${wallThickness}" fill="red" />`;
		} else {
			svgContent += `<rect data-index="${idx}" data-value="${wall}" data-wall="north" x="${xStart}" y="${yStart}" width="${cellSize}" height="${wallThickness}" fill="#fff" fill-opacity="0" />`;
		}
		// 東の壁
		if (wall & 0b0010) {
			svgContent += `<rect data-index="${idx}" data-value="${wall}" data-wall="east" x="${xStart + cellSize - wallThickness}" y="${yStart}" width="${wallThickness}" height="${cellSize}" fill="red" />`;
		} else {
			svgContent += `<rect data-index="${idx}" data-value="${wall}" data-wall="east" x="${xStart + cellSize - wallThickness}" y="${yStart}" width="${wallThickness}" height="${cellSize}" fill="#fff" fill-opacity="0"/>`;
		}
		// 西の壁
		if (wall & 0b0100) {
			svgContent += `<rect data-index="${idx}" data-value="${wall}"  data-wall="west" x="${xStart}" y="${yStart}" width="${wallThickness}" height="${cellSize}" fill="red" />`;
		} else {
			svgContent += `<rect data-index="${idx}" data-value="${wall}"  data-wall="west" x="${xStart}" y="${yStart}" width="${wallThickness}" height="${cellSize}" fill="#fff" fill-opacity="0"/>`;
		}
		// 南の壁
		if (wall & 0b1000) {
			svgContent += `<rect data-index="${idx}" data-value="${wall}" data-wall="south" x="${xStart}" y="${yStart + cellSize - wallThickness}" width="${cellSize}" height="${wallThickness}" fill="red" />`;
		} else {
			svgContent += `<rect data-index="${idx}" data-value="${wall}" data-wall="south" x="${xStart}" y="${yStart + cellSize - wallThickness}" width="${cellSize}" height="${wallThickness}" fill="#fff" fill-opacity="0"/>`;
		}
	}

	svgContent += `</svg>`;
	return svgContent;
}

function getWebviewContent(svgContent: string, scriptUri: vscode.Uri): string {
	return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Maze Preview</title>
            <style>
                body {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                    margin: 0;
                    background: #f5f5f5;
                }
                svg {
                    border: 1px solid #ddd;
                }
            </style>
        </head>
        <body>
            ${svgContent}
            <script src="${scriptUri}"></script>
        </body>
        </html>
    `;
}
