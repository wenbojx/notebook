﻿const fs = require('fs');
const os = require('os');
var path = require('path');
var crypto = require('crypto');

global.APP_PATH = __dirname;
var pinyin = require("pinyin");
var userJs = require("./app/js/tools.js");
var bookJs = require("./app/js/book/book.js");
var userJs = require("./app/js/user/user.js");

//bookJs.book.hello(global.APP_PATH );

const electron = require('electron');
// Module to control application life.
const {app} = electron;
// Module to create native browser window.
const {BrowserWindow} = electron;

const {Menu,Tray, MenuItem} = electron;

const dialog = electron.dialog
const globalShortcut = electron.globalShortcut
const ipcMain = electron.ipcMain;
const encryptPrefixLocal = '$@yi!lu*hao@';


//let win;
var mainWindow = null;
var size = {}
var uid = null;
try {
  size = JSON.parse(fs.readFileSync(path.join(app.getPath('userData'), 'size')));
} catch (err) {}

function createWindow() {
	var shouldQuit = makeSingleInstance()
  	if (shouldQuit) return app.quit()

	mainWindow = new BrowserWindow({ 
		width: 1000,
		height: 650,
		'min-width': os.platform() === 'win32' ? 780 : 800,
		'min-height': os.platform() === 'win32' ? 400 : 700,
		'standard-window': false,
		resizable: true,
		frame: false,
	    //show: false
    
	});
	checkLogin();
	//mainWindow.setFullScreen(true);
	//mainWindow.setAlwaysOnTop(true);
	mainWindow.webContents.openDevTools();
	//win.loadURL(`file://${__dirname}/app/login.html`);
	//win.loadURL('http://www.yiluhao.com/login');
	mainWindow.loadURL(`file://${__dirname}/app/default.html`);
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
  
	mainWindow.webContents.on('did-finish-load', function() {
		initMainPage();
		var filter = {
		  	domain: 'www.yiluhao.com',
		 	name:'localtoken'
		}
		electron.session.defaultSession.cookies.get(filter, (error, cookies) => {
			console.log(cookies);
		})

	});

	mainWindow.webContents.on('new-window', function (event,url,fname,disposition,options) {
	    var exec = require('child_process').exec; 
	    //拦截url调用外部浏览器打开
	    console.log(url);
	    exec('start '+url, function(err,stdout,stderr){});
	    event.preventDefault();
	});

	tray = new Tray(path.join(__dirname, '/app/img/mini_logo.ico'))//右下角的图标
	//console.log(path.join(__dirname, '/app/img/mini_logo.ico'));
	//console.log("sdfs");
	const contextMenu = Menu.buildFromTemplate([//右键菜单项 可以是多个 这里只有关闭一个项
		{label: '关闭', click: function(){
			app.quit();
		}},
		    //{label: 'Item2', type: 'radio'},
	]);
	tray.setContextMenu(contextMenu);
	tray.on('double-click',function(){
	  	mainWindow.show();
	})
}
//验证登录
function checkLogin(){
	var filter = {
	  	domain: 'www.yiluhao.com',
	 	name:'localtoken'
	}
	electron.session.defaultSession.cookies.get(filter, (error, cookies) => {
	  if (!error) {
	  	 if(typeof(cookies[0]) == "undefined"){
	  	 	return;
	  	 }
	  	var value = new Buffer(cookies[0].value, 'base64').toString();
	  	if (!value) {
	  		console.log("error");
	  		return;
	  	}
	  	var dataString = value.substring(32);
	  	//console.log(dataString);
	 	var content = dataString + encryptPrefixLocal;
	  	var md5 = crypto.createHash('md5');
	  	md5.update(content);
		var code = md5.digest('hex');
	  	var validate = value.substring(0,32);
	  	var time = Date.parse(new Date())/1000;
	  	var userDatas = JSON.parse(dataString);
	  	//验证时间，看是否过期
	  	if (code != validate || userDatas.time<time) {
	  		//验证失败，重新登录
	  		console.log("error");
	  		return;
	  	}
	  	uid = userDatas.uid;
	  }
	  
	})
}

function makeSingleInstance () {
  if (process.mas) return false

  return app.makeSingleInstance(function () {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
app.on('ready', function () {
  globalShortcut.register('CommandOrControl+Alt+C', function () {
    dialog.showMessageBox({
      type: 'info',
      message: 'Success!',
      detail: 'You pressed the registered global shortcut keybinding.',
      buttons: ['OK']
    })
  })
})
app.on('will-quit', function () {
  globalShortcut.unregisterAll()
})



function initMainPage(){
	//const {session} = require('electron')
	//electron.session.defaulSession.cookies
	

}

//关闭窗口
ipcMain.on('closeWindow', function(event, datas) {
	app.quit();
});
//最小化窗口
ipcMain.on('miniWindow', function(event, datas) {
	mainWindow.setSkipTaskbar(true);
	mainWindow.minimize();
});
//常规大小窗口
ipcMain.on('restoreWindow', function(event, datas) {
	if(mainWindow.isMaximized()){
        mainWindow.restore();  
    }else{
        mainWindow.maximize(); 
    }
});


//获取书籍列表
ipcMain.on('getBookList', function(event, datas) {
	bookJs.book.getBookList(getBookListCallBack);
	function getBookListCallBack(datas){
		//console.log(datas);
		mainWindow.webContents.send('getBookList', datas);
	}
});
//获取当前书籍信息
ipcMain.on('getCurrentBook', function(event, datas) {
	getCurrentBook();
});
function getCurrentBook(){
	userJs.user.getCurrentBook(getCurrentBookCallBack);
	function getCurrentBookCallBack(datas){
		//console.log(datas);
		if(!datas.bookId){
			return
		}
		mainWindow.webContents.send('currentBookInfo', datas);
		//获取书籍详细信息
		getBookInfo(datas.bookId);
		//获取卷列表信息
		getVolumeList(datas.bookId);
		//获取章节列表信息
		getChapterList(datas.bookId, datas.volumeId);
		//获取章节内容
		getChapterContent(datas.bookId, datas.chapterId);
	}
}
//获取指定书信息
ipcMain.on('getBookById', function(event, bookId) {
	getBookByBid(bookId);
	
});
function getBookByBid(bookId){
	if(!bookId){
		console.log("get bookId fail");
		return false;
	}
	getBookInfo(bookId);
	//获取卷列表信息
	getVolumeList(bookId, getVolumeListCallBack);
	function getVolumeListCallBack(datas){
		//console.log(datas);
		if(!datas || datas.length <1 ){
			return ;
		}
		
		var volumeId = datas[0].$loki;
		//console.log(datas);
		//获取章节列表信息
		getChapterList(bookId, volumeId, getChapterListCallBack);
		console.log("getBookByBidSuccess");
		mainWindow.webContents.send('getBookByBidSuccess', null);
	}
	function getChapterListCallBack(datas){
		if(datas.length <1 ){
			return ;
		}
		var chapterId = datas[0].$loki;
		//获取章节内容
		getChapterContent(bookId, chapterId);
		
	}
}

//获取书籍信息
function getBookInfo(bookId){
	bookJs.book.getBookBaseInfo(bookId, getBookBaseInfoCallBack);
		function getBookBaseInfoCallBack(datas){
			console.log("getBookInfo");
			//console.log(datas);
			mainWindow.webContents.send('renderBookInfo', datas);
		}
}
//获取指定书卷信息
ipcMain.on('getVolumeList', function(event, bookId) {
	getVolumeList(bookId, getVolumeListCallBack);
	function getVolumeListCallBack(datas){
		//console.log(datas);
	}
});
//获取卷列表
function getVolumeList(bookId, callBack){
	bookJs.book.getVolumeList(bookId, getVolumeListCallBack);
		function getVolumeListCallBack(datas){
			console.log("getBookVolumes");
			//console.log(datas);
			mainWindow.webContents.send('renderVolumeList', datas);
			if(callBack){
				callBack(datas);
			}
		}
}
//获取章节列表
ipcMain.on('getChapterList', function(event, datas) {
	getChapterList(datas.bookId, datas.volumeId);
});
//获取章节列表
function getChapterList(bookId, volumeId, callBack){
	bookJs.book.getChapterList(bookId, volumeId, getChapterListCallBack);
		function getChapterListCallBack(datas){
			//console.log(datas);
			console.log("getBookChapters");
			mainWindow.webContents.send('renderChapterList', datas);
			if(callBack){
				callBack(datas);
			}
		}
}
//获取章节内容
ipcMain.on('getChapterContent', function(event, datas) {
	getChapterContent(datas.bookId, datas.chapterId);
});
function getChapterContent(bookId, chapterId){
	bookJs.book.getChapterContent(bookId, chapterId, getChapterContentCallBack);
		function getChapterContentCallBack(datas){
			//console.log(datas);
			console.log("getChaptersContent");
			mainWindow.webContents.send('renderChapterContent', datas);
		}
}

//创建书
ipcMain.on('creatBook', function(event, datas) {
	bookJs.book.creatBook(event, datas, callBack);
	function callBack(datas){
		console.log("ipc CreateBook-"+datas.bookId);
		if(!datas.bookId){
			console.log("get BookId fail");
			return ;
		}
		//getBookByBid(datas.bookId);
		mainWindow.webContents.send('creatBookSuccess', datas);
	}
});

//编辑书
ipcMain.on('editBook', function(event, datas) {
	bookJs.book.editBook(event, datas, callBack);
	function callBack(datas){
		console.log("editBookSuccess");
		mainWindow.webContents.send('editBookSuccess', datas);
	}
});


//创建卷
ipcMain.on('creatVolume', function(event, datas){
	var volume = {};
	volume.name = datas.name;
	volume.bookId = datas.bookId;
	volume.countChapter = 1;
	volume.countWords = 0;
	volume.status = 1; //1正常状态， 2回收站，3删除
	volume.createTime = new Date().getTime();
	volume.updateTime= new Date().getTime();
	//console.log(volume);
	bookJs.book.creatVolume(event, volume, creatVolumeCallBack);
	function creatVolumeCallBack(datas){
		console.log("create Volume");
		if(datas){
			//console.log(datas);
			mainWindow.webContents.send('creatVolumeSuccess', datas);
		}
	}
})
//编辑卷
ipcMain.on('editVolume', function(event, datas) {
	bookJs.book.editVolume(event, datas, callBack);
	function callBack(datas){
		console.log("editVolumeSuccess");
		//console.log(datas);
		mainWindow.webContents.send('editVolumeSuccess', datas);
	}
});

//创建章节
ipcMain.on('creatChapter', function(event, datas){
	var chapter = {};
	chapter.bookId = parseInt(datas.bookId);
	chapter.volumeId = parseInt(datas.volumeId);
	chapter.name = datas.name;
	//chapter.countWord = 0;
	chapter.status = 1; //1当前编辑状态， 2正常状态， 3回收站，4删除
	chapter.creatTime = new Date().getTime();
	chapter.updateTime = new Date().getTime();
	bookJs.book.creatChapter(event, chapter, creatChapterCallBack);
	function creatChapterCallBack(datas){
		console.log("create Chapter");
		mainWindow.webContents.send('creatChapterSuccess', datas);
	}
})
//编辑章节
ipcMain.on('editChapter', function(event, datas) {
	//console.log(datas);
	bookJs.book.editChapter(event, datas, callBack);
	function callBack(datas){
		console.log("editChapterSuccess");
		//console.log(datas);
		mainWindow.webContents.send('editChapterSuccess', datas);
	}
});

//保存章内容
ipcMain.on('saveChapterContent', function(event, datas){
	var chapter = {};
	chapter.bookId = datas.bookId;
	chapter.chapterId = datas.chapterId;
	chapter.name = datas.name;
	chapter.content = datas.content;
	chapter.countWord = datas.countWord;
	//console.log(volume);
	bookJs.book.saveChapterContent(event, chapter, saveChapterContentCallBack);
	function saveChapterContentCallBack(datas){
		console.log("save chapterContent");
		
		if(datas){
			//console.log(datas);
			//win.webContents.send('creatVolumeSuccess', datas);
		}
	}
})

/********** 全屏 **************/
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











