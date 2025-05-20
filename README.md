## ライフ・Vプリカ検証環境用ビルドスクリプト

## 環境

| 言語・フレームワーク  | バージョン |
| --------------------- | ---------- |
| nvm                   | 1.2.2     |
| Node.js               | 22.15.0   |

## 環境構築方法

1.nvmをインストール
2.nvmでnodeをインストール
3.npm install

※プロキシ切らないとエラー起きます
※詳細以下URL
https://docs.google.com/spreadsheets/d/1nXpVK5ZK4aS6ZOeXk20XJMADUH-W0_YLX87u8bGiQ_c/edit?gid=0#gid=0

## 実行方法

ターミナルにて、"npm install"と入力することでビルドスクリプト起動

## 挙動

1.S3転送用destフォルダの削除（存在していなければ2.へ）
2.S3転送用destフォルダの作成
3.assetsフォルダの中身を階層を維持したままdestフォルダにコピー
4.HTMLファイルのビルド以下フォルダのデータを使用してビューを使用したHTMLを作成
  src/meta/
  src/page/
  src/view/
  
## LiveServerの設定

/.vscode/settings.json内でLiveServerのルートをdestフォルダ配下に設定している為、
読み込んでいる相対パスが有効になり、S3に載せ上げた時と同様の表示ができます

## ディレクトリ構成

.
├── .vscode
│   └── settings.json
├── dest
├── node_modules
├── src
│   ├── assets
│   ├── meta
│       └── meta.json
│   ├── page
│   └── view
├── test
├── .env
├── build.js
├── package-lock.json
├── package.json
└── README.md