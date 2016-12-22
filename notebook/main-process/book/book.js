const electron = require('electron');
const ipcMain = electron.ipcMain;
const path = require('path');
var common = require(path.join(global.APP_PATH, './main-process/common.js'));
var book = require(path.join(global.APP_PATH, './model/book/book.js'));
const BrowserWindow = electron.BrowserWindow;

//获取书籍列表main-process
ipcMain.on('getBookList', function(event, datas) {
	var datas = book.getBookList();
	//console.log(datas);
	BrowserWindow.getFocusedWindow().webContents.send('getBookList', datas);
});
ipcMain.on('getBookInfo', function(event, bid) {
	var datas = book.getBookInfo(bid);
	//console.log(datas);
	BrowserWindow.getFocusedWindow().webContents.send('getBookInfo', datas);
});
ipcMain.on('getChapterList', function(event, bid) {
	var datas = book.getChapterList(bid);
	//console.log(datas);
	BrowserWindow.getFocusedWindow().webContents.send('getChapterList', datas);
});
ipcMain.on('getChapterContent', function(event, cid) {
	var datas = book.getChapterContent(cid);
	//console.log(datas+cid);
	BrowserWindow.getFocusedWindow().webContents.send('getChapterContent', datas);
});
ipcMain.on('saveChapterContent', function(event, cid) {
	console.log("saveChapterContent");
	var datas = book.saveChapterContent(cid);
	console.log(datas);
	BrowserWindow.getFocusedWindow().webContents.send('saveChapterContent', datas);
});
