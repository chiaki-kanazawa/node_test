import {
  existsSync,
  rmSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "fs";
import { copySync } from "fs-extra/esm";
import ora from "ora";

const __destDirName = "dest";

compileHtml();

function compileHtml() {
  const spinner = ora("ビルド処理開始...").start();
  try {
    // destフォルダの削除
    cleanUpDir();

    // destフォルダの作成
    mkDestDir();

    // リソースフォルダのコピー
    cpResourceDir();

    // HTMLファイルのビルド
    buildHtml();

    spinner.succeed("Success:ビルド処理完了");
  } catch (e) {
    spinner.fail("Error:エラーが発生しました: " + e);
  }
}

// destフォルダの削除
function cleanUpDir() {
  const spinner = ora("destフォルダの削除を開始...").start();
  try {
    const destExistsFlag = existsSync(__destDirName);

    // destフォルダの存在チェック
    if (destExistsFlag) {
      rmSync(__destDirName, { recursive: true });
      spinner.succeed("Success:destフォルダの削除が完了しました");
    } else {
      spinner.succeed("Success:destフォルダが存在しませんでした");
    }
  } catch (e) {
    spinner.fail("Error:destフォルダの削除でエラーが発生しました");
    throw new Error(e);
  }
}

// destフォルダの作成
function mkDestDir() {
  const spinner = ora("destフォルダの作成を開始...").start();
  try {
    mkdirSync(__destDirName, { recursive: true });
    spinner.succeed("Success:destフォルダの作成が完了しました");
  } catch (e) {
    spinner.fail("Error:destフォルダの作成でエラーが発生しました");
    throw new Error(e);
  }
}

// リソースフォルダのコピー
function cpResourceDir() {
  const spinner = ora("リソースフォルダのコピーを開始...").start();
  try {
    copySync("src/assets", __destDirName);
    spinner.succeed("Success:リソースフォルダのコピーが完了しました");
  } catch (e) {
    spinner.fail("Error:リソースフォルダのコピーでエラーが発生しました");
    throw new Error(e);
  }
}

// HTMLファイルのビルド
function buildHtml() {
  const spinner = ora("HTMLファイルのビルドを開始...").start();
  try {
    // 共通要素のHTMLを準備
    const commonPath = "src/view/life/common.html";
    const commonData = readFileSync(commonPath, "utf8");

    // ディレクトリの生成
    const directories = readdirSync("src/page", { recursive: true }).filter(
      (directory) => {
        return statSync(`src/page/${directory}`).isDirectory();
      }
    );
    
    for (let key in directories) {
      mkdirSync(`dest/${directories[key]}`, buildHtml);
    }

    // HTMLファイル一覧の生成
    const files = readdirSync("src/page", { recursive: true }).filter(
      (file) => {
        return statSync(`src/page/${file}`).isFile();
      }
    );

    const metaData = readFileSync('src/meta/meta.json', "utf8");

    const metaObject = JSON.parse(metaData).data;
    for (let key in files) {
      // ページ内要素を取得
      const mainData = readFileSync(`src/page/${files[key]}`, "utf8");
      const mainTagPosition = /<main>(.*)<\/main>/i;

      // ページの中身を入れ込み
      let buildHtml = commonData.replace(mainTagPosition, `<main>${mainData}<\/main>`);
      
      for (let i in metaObject) {
        if (files[key] === metaObject[i].path) {
          const titleTagPosition = /<title>(.*)<\/title>/i;
          buildHtml = buildHtml.replace(titleTagPosition, `<title>${metaObject[i].title}<\/title>`);
        }
      }
      
      writeFileSync(`dest/${files[key]}`, buildHtml);
    }

    spinner.succeed("Success:HTMLファイルのビルドが完了しました");
  } catch (e) {
    spinner.fail("Error:HTMLファイルのビルドでエラーが発生しました");
    throw new Error(e);
  }
}
