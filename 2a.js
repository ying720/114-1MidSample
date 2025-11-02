//1、引入http模組
const http = require('http');

//2、創建http伺服器
const server = http.createServer(function (request, response) {
  const url = request.url;  //獲取請求位址
  console.log(url)
  var answer = '';  //設置回應內容

  // 請寫 switch完成各個收到不同的請求以及輸出不同的回應字串 (使用 switch)
  switch (url) {
  case '/':
  answer = 'index.html 輸出部分';
  break;
  case '/calculator':
  answer = 'index2.html 輸出的部分';
  break;
  default:
  answer = 'error.html 輸出的部分';
  break;
  }



  
  response.setHeader('Content-Type', 'text/plain;charset=utf-8'); //設置回應頭編碼為utf-8，避免中文亂碼
  response.end(answer);
});
//3、啟動伺服器監聽8888埠
server.listen('8888', function () {
  console.log("伺服器啟動成功，訪問：http://127.0.0.1:8888")
})