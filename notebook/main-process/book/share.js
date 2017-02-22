const electron = require('electron');
const ipcMain = electron.ipcMain;
const path = require('path');
var common = require(path.join(global.APP_PATH, './main-process/common.js'));
var book = require(path.join(global.APP_PATH, './model/book/book.js'));
const BrowserWindow = electron.BrowserWindow;

//获取书籍列表main-process
ipcMain.on('getShareChapterListIpc', function(event, datas) {
	common.log("getShareChapterList");
	var datas = book.getShareChapterList();
	//console.log(datas);
	BrowserWindow.getFocusedWindow().webContents.send('getShareChapterList', datas);
});