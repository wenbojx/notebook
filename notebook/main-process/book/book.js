const ipcMain = require('electron').ipcMain;
const path = require('path');
var common = require(path.join(global.APP_PATH, './main-process/common.js'));
var book = require(path.join(global.APP_PATH, './model/book/book.js'));

//获取书籍列表main-process
ipcMain.on('getBookList', function(event, datas) {
	var datas = book.getBookList();
	console.log(datas);
	
});

