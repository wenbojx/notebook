const electron = require('electron');
const ipcMain = electron.ipcMain;
const path = require('path');
var common = require(path.join(global.APP_PATH, './main-process/common.js'));
var book = require(path.join(global.APP_PATH, './model/book/book.js'));
const BrowserWindow = electron.BrowserWindow;

//获取书籍列表main-process
ipcMain.on('getDeleteChapterList', function(event, datas) {
	common.log("getDeleteChapterList");
	var datas = book.getDeleteChapterList(datas);
	//console.log(datas);
	BrowserWindow.getFocusedWindow().webContents.send('getDeleteChapterList', datas);
});
//删除章节
ipcMain.on('deleteDeleteChapter', function(event, datas) {
	common.log("deleteDeleteChapter");
	var datas = book.deleteDeleteChapter(datas);
	//console.log(datas);
	BrowserWindow.getFocusedWindow().webContents.send('deleteDeleteChapter', datas);
});
//恢复章节
ipcMain.on('deleteRestoreChapter', function(event, datas) {
	common.log("deleteRestoreChapter");
	var datas = book.deleteRestoreChapter(datas);
	//console.log(datas);
	BrowserWindow.getFocusedWindow().webContents.send('deleteRestoreChapter', datas);
});
//清空回收站
ipcMain.on('deleteCleanChapter', function(event, datas) {
	common.log("deleteCleanChapter");
	var datas = book.deleteCleanChapter(datas);
	//console.log(datas);
	BrowserWindow.getFocusedWindow().webContents.send('deleteCleanChapter', datas);
});