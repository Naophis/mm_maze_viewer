# MM Maze Viewer Extension

This is a VSCode extension that provides a maze editor for managing wall data in a Micromouse simulation.
---
マイクロマウスシミュレーションで使用する迷路の壁データを管理するためのエディタを提供するVSCode拡張機能です。

## Features

* Edit maze wall data by clicking on the cells
* Dynamically regenerate the maze in SVG format
* Export or save the maze data as `.maze` files
---
* セルをクリックして迷路の壁データを編集できます。
* SVG形式で迷路を動的に再生成できます。
* `.maze`ファイルとして迷路データをエクスポートまたは保存できます。


## Installation

1. Download the `.vsix` file from the release page.
2. In VSCode, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run `Extensions: Install from VSIX...`.
3. Select the downloaded `.vsix` file to install.

---
1. リリースページから`.vsix`ファイルをダウンロードします。
2. VSCodeでコマンドパレット（`Ctrl+Shift+P` または `Cmd+Shift+P`）を開き、`Extensions: Install from VSIX...` を実行します。
3. ダウンロードした `.vsix`ファイルを選択してインストールします。

## Usage

1. Open a `.maze` file in VSCode.
2. Type a `Ctrl + Shift + P` and select `Maze Preview`
3. Click on the walls or cells to edit the maze.
4. Save the maze data to update the `.maze` file.

1. VSCodeで `.maze` ファイルを開きます。
2. `Ctrl + Shift + P` を押して Maze Preview を選択します。
3. 壁やセルをクリックして迷路を編集します。
4. 迷路データを保存して `.maze` ファイルを更新します。


Please use the following template files for the maze files.
(テンプレートとして以下のテキストを使い`maze`ファイルを作ってください)

### 16x16 template
```
14,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,
12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
10,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3
```

### 32x32 template
```
14,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,
12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
10,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3
```



## Release Notes

### 0.0.1

- Initial release with basic maze editing functionality.
