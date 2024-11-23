import * as vscode from 'vscode';
import * as path from 'path';

import Maze from './maze';

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
		const { gridSize, wallDirectionType, arrayType, arrayOrder } = getSettings();
		// メディアファイルへのパスを解決
		const scriptPath = vscode.Uri.file(path.join(context.extensionPath, 'media', 'script.js'));
		const scriptUri = panel.webview.asWebviewUri(scriptPath);

		const maze_data = new Maze(gridSize, wallDirectionType, arrayType, arrayOrder);
		maze_data.set_from_text(text);

		let svgContent = generateMicroMouseSvg(maze_data);
		panel.webview.html = getWebviewContent(svgContent, scriptUri);

		// Webviewからのメッセージを受信
		panel.webview.onDidReceiveMessage((message) => {
			console.log(message);
			if (message.command === 'updateMaze') {
				const idx = message.index;
				maze_data.update(idx, message.wall);
				const edit = new vscode.WorkspaceEdit();
				const documentUri = document.uri;
				edit.replace(
					documentUri,
					new vscode.Range(0, 0, document.lineCount, 0),
					maze_data.get_text()
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

function generateMicroMouseSvg(maze: Maze): string {
	const cellSize = 80; // 1マスのサイズ
	const wallThickness = cellSize / 10; // 壁の厚さ
	const gridSize = maze.gridSize;
	const svgWidth = cellSize * gridSize;
	const svgHeight = cellSize * gridSize;

	let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" >`;

	// svgContent += `<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="black" stroke="gray" />`;
	// グリッドの描画

	for (let idx = 0; idx < maze.data.length; idx++) {
		if (idx >= gridSize * gridSize) break;
		const wall = maze.get_data(idx); // マスの壁情報を取得
		// const x = idx % gridSize;
		// const y = Math.floor(idx / gridSize);
		const x = Math.floor(idx / gridSize);
		const y = idx % gridSize;

		const xStart = x * cellSize;
		const yStart = cellSize * gridSize - y * cellSize;
		// マスの壁
		svgContent += `<rect data-index="${idx}" data-cell="cell" x="${xStart}" y="${yStart}" width="${cellSize}" height="${cellSize}" fill="black" stroke="gray" />`;
		// 北の壁
		if (wall & maze.NORTH) {
			svgContent += `<rect data-index="${idx}" data-value="${wall}" data-wall="north" x="${xStart}" y="${yStart}" width="${cellSize}" height="${wallThickness}" fill="red" />`;
		} else {
			svgContent += `<rect data-index="${idx}" data-value="${wall}" data-wall="north" x="${xStart}" y="${yStart}" width="${cellSize}" height="${wallThickness}" fill="#fff" fill-opacity="0" />`;
		}
		// 東の壁
		if (wall & maze.EAST) {
			svgContent += `<rect data-index="${idx}" data-value="${wall}" data-wall="east" x="${xStart + cellSize - wallThickness}" y="${yStart}" width="${wallThickness}" height="${cellSize}" fill="red" />`;
		} else {
			svgContent += `<rect data-index="${idx}" data-value="${wall}" data-wall="east" x="${xStart + cellSize - wallThickness}" y="${yStart}" width="${wallThickness}" height="${cellSize}" fill="#fff" fill-opacity="0"/>`;
		}
		// 西の壁
		if (wall & maze.WEST) {
			svgContent += `<rect data-index="${idx}" data-value="${wall}"  data-wall="west" x="${xStart}" y="${yStart}" width="${wallThickness}" height="${cellSize}" fill="red" />`;
		} else {
			svgContent += `<rect data-index="${idx}" data-value="${wall}"  data-wall="west" x="${xStart}" y="${yStart}" width="${wallThickness}" height="${cellSize}" fill="#fff" fill-opacity="0"/>`;
		}
		// 南の壁
		if (wall & maze.SOUTH) {
			svgContent += `<rect data-index="${idx}" data-value="${wall}" data-wall="south" x="${xStart}" y="${yStart + cellSize - wallThickness}" width="${cellSize}" height="${wallThickness}" fill="red" />`;
		} else {
			svgContent += `<rect data-index="${idx}" data-value="${wall}" data-wall="south" x="${xStart}" y="${yStart + cellSize - wallThickness}" width="${cellSize}" height="${wallThickness}" fill="#fff" fill-opacity="0"/>`;
		}
	}
	svgContent += `</svg>`;
	return svgContent;
}

const getSettings = (): any => {
	const config = vscode.workspace.getConfiguration('mazeViewer');
	const gridSize = config.get<number>('gridSize', 32); // デフォルト値 16
	const wallDirectionType = config.get<string>('wallDirectionType', "N-E-W-S");
	const arrayType = config.get<string>('arrayType', "1D[index]");
	const arrayOrder = config.get<string>('arrayType', "a->b");
	return { gridSize, wallDirectionType, arrayType, arrayOrder };
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
