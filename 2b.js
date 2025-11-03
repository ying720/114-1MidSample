// ==========================================
// Node.js + EJS 網頁伺服器
// ==========================================
// 功能說明：
// 1. 提供多頁面路由（首頁、計算器、404頁面）
// 2. 支援 EJS 模板動態渲染
// 3. 處理靜態資源（CSS、JS、圖片等）
// 4. 自動錯誤處理與 404 頁面導向
// ==========================================

// ------------------------------------------
// 引入必要的 Node.js 核心模組
// ------------------------------------------

// http 模組：用於創建 HTTP 伺服器
const http = require('http');

// fs 模組 (File System)：用於讀取檔案系統中的文件
const fs = require('fs');

// ejs 模組：用於渲染 EJS 模板引擎，將動態內容嵌入 HTML
const ejs = require('ejs');

// path 模組：用於處理和解析文件路徑，提取副檔名
const path = require('path');

// ==========================================
// 創建並配置 HTTP 伺服器
// ==========================================

http.createServer((req, res) => {
  // req (request): 請求物件，包含客戶端發送的所有資訊（URL、標頭等）
  // res (response): 回應物件，用於向客戶端發送回應（HTML、狀態碼等）

  // ==========================================
  // 步驟 1: URL 路由與頁面分派
  // ==========================================

  // 宣告兩個變數來處理不同類型的請求：
  // filePath: 儲存要渲染的 EJS 模板文件路徑
  // fileOtherFile: 儲存靜態資源（CSS、JS 等）的路徑
  let filePath = '';
  let fileOtherFile = '';

  // Switch根據不同路由要寫的部分


switch(req.url) {  //switch 就像「多選一」的控制結構
  case '/':  //case 就像「如果符合這個條件，就進來」
    filePath = '/index.ejs';           // EJS 模板   filePath 是變數名稱，代表「檔案路徑」
    break;
  case '/calculator':
    filePath = '/index2.ejs';          // EJS 模板
    break;
  default:
    break;  //break 就像「都不是的話，就走這條路」
}

// 判斷是否是靜態資源（CSS、JS、圖片等）
if (req.url.endsWith('.css') || req.url.endsWith('.js') || req.url.endsWith('.png')) {
  fileOtherFile = req.url;             // 靜態資源路徑
}
  

  // ==========================================
  // 步驟 2: 判斷文件類型（提取副檔名）
  // ==========================================

  // 使用三元運算子判斷要從哪個路徑提取副檔名：
  // - 如果 fileOtherFile 是空字串 → 從 filePath 提取（代表是 EJS 頁面）
  // - 如果 fileOtherFile 有值 → 從 fileOtherFile 提取（代表是靜態資源）
  //
  // path.extname() 函數會提取文件的副檔名
  // 範例：
  //   path.extname('/index.ejs') → '.ejs'
  //   path.extname('/style.css') → '.css'
  //   path.extname('/script.js') → '.js'
  const extname = (fileOtherFile === '') ? path.extname(filePath) : path.extname(fileOtherFile);

  // ==========================================
  // 步驟 3: 定義 MIME 類型映射表
  // ==========================================

  // MIME 類型（Content-Type）告訴瀏覽器如何處理接收到的文件
  // 如果設定錯誤，可能導致：
  // - CSS 不生效（被當作純文字）
  // - JavaScript 無法執行
  // - 圖片無法顯示
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',        // HTML 網頁文件
    '.ejs': 'text/html; charset=utf-8',         // EJS 模板（渲染後輸出為 HTML）
    '.js': 'text/javascript; charset=utf-8',    // JavaScript 腳本文件
    '.css': 'text/css; charset=utf-8',          // CSS 樣式表文件
    '.json': 'application/json',                // JSON 資料格式
    '.png': 'image/png',                        // PNG 圖片格式
    '.jpg': 'image/jpg',                        // JPG/JPEG 圖片格式
    '.gif': 'image/gif',                        // GIF 動畫圖片
    '.svg': 'image/svg+xml',                    // SVG 向量圖形
    '.ico': 'image/x-icon'                      // 網站 favicon 圖示
  };

  // ==========================================
  // 步驟 4: 查找對應的 Content-Type
  // ==========================================

  // 從映射表中查找當前文件對應的 MIME 類型
  // 使用 || 運算子提供預設值：
  // - 如果在映射表中找到對應的副檔名，使用該 MIME 類型
  // - 如果找不到，預設使用 'text/plain'（純文字格式）
  const contentType = contentTypes[extname] || 'text/plain';

  // ==========================================
  // 請求處理：根據文件類型分流
  // ==========================================

  // 使用 if-else 判斷式區分兩種處理方式：
  // 1. EJS 模板渲染（動態內容）
  // 2. 靜態文件傳送（CSS、JS、圖片等）

  // ------------------------------------------
  // 處理方式 A: EJS 模板渲染
  // ------------------------------------------
  // 適用情況：extname === '.ejs'
  // 處理頁面：index.ejs, index2.ejs, index3.ejs
  if (extname === '.ejs') {

    // 讀取 EJS 模板文件
    // 參數說明：
    //   ('.' + filePath): 構建完整路徑，'.' 代表當前目錄
    //                     例如：'/index.ejs' → './index.ejs'
    //   'utf8': 指定文件編碼格式為 UTF-8，確保中文正確顯示
    //   (err, template): 回調函數的參數
    //                    err: 錯誤物件（若成功則為 null）
    //                    template: 讀取到的文件內容（字串）
    fs.readFile(('.' + filePath), 'utf8', (err, template) => {

      // 錯誤處理：檢查文件是否讀取失敗
      if (err) {
        // 設定 HTTP 狀態碼 500（Internal Server Error - 伺服器內部錯誤）
        // 這表示伺服器嘗試處理請求時發生問題
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });

        // 向客戶端發送錯誤訊息，包含具體的錯誤原因
        res.end('錯誤：無法讀取模板文件 - ' + err.message);

        // 使用 return 提前結束函數，避免執行後續的渲染代碼
        return;
      }

      // 使用 EJS 引擎渲染模板
      // ejs.render() 會：
      // 1. 解析 EJS 語法（如 <%= %>, <% %> 等）
      // 2. 執行嵌入的 JavaScript 代碼
      // 3. 將結果轉換成純 HTML 字串
      const html = ejs.render(template);

      // 設定 HTTP 回應標頭
      // 狀態碼 200: OK（請求成功）
      // Content-Type: 告訴瀏覽器這是 HTML 文件，使用 UTF-8 編碼
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

      // 將渲染完成的 HTML 發送給客戶端（瀏覽器）
      res.end(html);
    });

  } else {
    // ------------------------------------------
    // 處理方式 B: 靜態文件傳送
    // ------------------------------------------
    // 適用情況：extname !== '.ejs'（例如 .css, .js, .png 等）
    // 處理文件：style.css, style2.css, style3.css, script.js

    // 構建完整的靜態文件路徑
    // 在路徑前加上 '.' 表示當前工作目錄
    // 範例：
    //   '/style.css' → './style.css'
    //   '/script.js' → './script.js'
    const staticFilePath = '.' + fileOtherFile;

    // 讀取靜態文件
    // 注意：這裡「沒有」指定 'utf8' 編碼
    // 原因：某些文件是二進制格式（如圖片、字型），不能用文字方式讀取
    // fs.readFile 會以 Buffer 格式讀取文件（可處理任何類型的文件）
    fs.readFile(staticFilePath, (err, content) => {

      // 檢查靜態文件是否讀取失敗
      if (err) {
        // ------------------------------------------
        // 靜態文件不存在 → 顯示 404 錯誤頁面
        // ------------------------------------------
        fs.readFile('./index3.ejs', 'utf8', (ejsErr, template) => {
          if (ejsErr) {  // 如果 404 檔也讀不到
            res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('伺服器錯誤：找不到 404 頁面');
            return;
          }
          const html = ejs.render(template);
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(html);
          // 當靜態資源載入失敗時（例如：請求不存在的文件或網址）
          // 不直接回傳錯誤訊息，而是顯示友善的 404 錯誤頁面（index3.ejs）
          // 設定 HTTP 狀態碼 404（找不到資源）
          });
      } else {
        // 當靜態資源載入失敗時（例如：請求不存在的文件或網址）
        // 不直接回傳錯誤訊息，而是顯示友善的 404 錯誤頁面（index3.ejs）

   
        // ------------------------------------------
        // 靜態文件讀取成功 → 直接發送文件內容
        // ------------------------------------------

        // 設定 HTTP 狀態碼 200（成功）
        // Content-Type 根據文件副檔名自動設定（從 contentTypes 映射表查詢）
        // 例如：
        //   .css 檔案 → 'text/css; charset=utf-8'
        //   .js 檔案 → 'text/javascript; charset=utf-8'
        //   .png 檔案 → 'image/png'
        res.writeHead(200, { 'Content-Type': contentType });

        // 將文件內容發送給客戶端
        // content 變數的類型取決於文件：
        // - 文字文件（CSS、JS）：Buffer 會自動轉換為文字
        // - 二進制文件（圖片）：直接以 Buffer 形式傳送
        res.end(content);
      }
    });
  }

// ==========================================
// 啟動伺服器並開始監聽請求
// ==========================================

// .listen() 方法啟動伺服器並監聽指定的端口
// 參數說明：
//   3000: 端口號（Port），伺服器將在此端口接收請求
//   回調函數: 伺服器成功啟動後執行的函數
}).listen(3000, () => {

  // 在終端機（控制台）輸出訊息，告知開發者伺服器已啟動
  // 使用者可以透過瀏覽器訪問 http://localhost:3000 來查看網站
  console.log('伺服器已啟動！請訪問 http://localhost:3000');
  console.log('可用路由：');
  console.log('  - http://localhost:3000');
  console.log('  - http://localhost:3000/calculator');
  console.log('  - 其他路徑將顯示 404 錯誤頁面');
});

// ==========================================
// 程式運行流程總結
// ==========================================
//
// 1. 使用者在瀏覽器輸入網址（例如：http://localhost:3000）
// 2. 瀏覽器發送 HTTP 請求到伺服器
// 3. 伺服器的 createServer 回調函數被觸發
// 4. 根據 req.url 判斷要返回哪個頁面或資源
// 5. 如果是 EJS 頁面：
//    - 讀取 EJS 模板文件
//    - 使用 ejs.render() 渲染成 HTML
//    - 將 HTML 發送給瀏覽器
// 6. 如果是靜態資源（CSS、JS）：
//    - 嘗試讀取對應的文件
//    - 如果存在，直接發送文件內容
//    - 如果不存在，顯示 404 錯誤頁面
// 7. 瀏覽器接收到內容並顯示給使用者
//
// ==========================================