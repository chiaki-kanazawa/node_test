import { existsSync, rmSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { copySync } from 'fs-extra/esm'
import ora from 'ora';
import { resolve } from 'path';

const __destDirName = 'dest';
const __defaultPath = import.meta.dirname;
const __buildPath = resolve(__defaultPath, __destDirName);
const headerPath = resolve(__defaultPath, 'src/view/header.html');
const footerPath = resolve(__defaultPath, 'src/view/footer.html');
const pagePath = resolve(__defaultPath, 'src/view/page.html');

const mainPath = resolve(__defaultPath, 'src/page/index.html');

function buildAllHTML() {
  const spinner = ora('ビルド処理開始...').start();
  try {
    const destExistsFlag = existsSync(__buildPath);

    // destフォルダの存在チェック
    if (destExistsFlag) {
      // destフォルダの削除
      spinner.text = 'destフォルダの削除を開始...';
      rmSync(__buildPath, { recursive: true });
      spinner.succeed('destフォルダ削除完了');
    } else {
      spinner.succeed('destフォルダが存在しませんでした');
    }

    // destフォルダの作成
    spinner.text = 'destフォルダ作成を開始';
    mkdirSync(__destDirName, { recursive: true });
    spinner.succeed('destフォルダ作成完了');

    // assetsフォルダをコピー
    copySync(resolve(__defaultPath, 'src/assets'), __buildPath);

    // コンパイルデータの作成
    const headerData = readFileSync(headerPath, 'utf8');
    const footerData = readFileSync(footerPath, 'utf8');
    const pageData = readFileSync(pagePath, 'utf8');

    const mainData = readFileSync(mainPath, 'utf8');

    const headerTagPosition = /<header>(.*)<\/header>/i;
    const footerTagPosition = /<footer>(.*)<\/footer>/i;

    const mainTagPosition = /<main>(.*)<\/main>/i;

    // <header>タグを置換
    const buildHtml = pageData
      .replace(headerTagPosition, headerData)
      .replace(footerTagPosition, footerData)
      .replace(mainTagPosition, mainData);

    // const fullHTML = `${headerData}\n${mainData}\n${footerData}`;
  
    writeFileSync(resolve(__buildPath, 'index.html'), buildHtml, 'utf8');

    spinner.succeed('ビルド処理完了');
  } catch (e) {
    spinner.fail('エラーが発生しました: ' + e);
  }
}

buildAllHTML();