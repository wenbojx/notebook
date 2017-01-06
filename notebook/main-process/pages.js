const electron = require('electron');
const path = require('path');
var common = require(path.join(global.APP_PATH, './main-process/common.js'));
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

var fullscreen = null;
var bid = 0;

ipcMain.on('fullScreen', function(event, datas) {
	common.log("fullScreen!");
	bid = datas.bid;
	fullScreenWin = BrowserWindow.getFocusedWindow();
	fullScreenWin.setFullScreen(true);
	fullScreenWin.loadURL(path.join('file://', global.APP_PATH, '/pages/fullScreen.html'));
})

ipcMain.on('exitFullScreen', function(event, datas){
  common.log("exitFullScreen!");
  fullScreenWin.setFullScreen(false);
  fullScreenWin.loadURL(path.join('file://', global.APP_PATH, '/index.html?page=book&bid='+bid));
})

/********** 全屏 **************/
/*
var fullScreenModel = false;
ipcMain.on('fullScreen', function(event, datas){
    if(fullScreenModel){
    return;
  }
  fullScreenModel = true;
  mainWindow.setFullScreen(true);
  mainWindow.loadURL(`file://${__dirname}/app/fullScreen.html`);
  
  mainWindow.webContents.on('did-finish-load', function() {
    getChapterContent(datas.bookId, datas.chapterId);
  });
  
})

ipcMain.on('exitFullScreen', function(event, datas){
  if(!fullScreenModel){
    console.log("exitFullScreen");
    return;
  }
  console.log("exitFullScreen!");
  fullScreenModel = false;
  mainWindow.setFullScreen(false);
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
})

ipcMain.on('goToQuanzi', function(event, datas){
  mainWindow.setFullScreen(false);
  mainWindow.loadURL(`file://${__dirname}/app/quanzi.html`);
})
ipcMain.on('goToXiezuo', function(event, datas){

  mainWindow.setFullScreen(false);
  mainWindow.loadURL(`file://${__dirname}/app/index.html`);
})
*/