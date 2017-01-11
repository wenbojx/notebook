const electron = require('electron');
const ipcMain = electron.ipcMain;
const path = require('path');
var common = require(path.join(global.APP_PATH, './main-process/common.js'));
var book = require(path.join(global.APP_PATH, './model/book/book.js'));
const BrowserWindow = electron.BrowserWindow;

//获取书籍列表main-process
ipcMain.on('getDeleteChapterList', function(event, datas) {
	common.log("getDeleteChapterList");
	var datas = book.getDeleteChapterList();
	//console.log(datas);
	BrowserWindow.getFocusedWindow().webContents.send('getDeleteChapterList', datas);
});