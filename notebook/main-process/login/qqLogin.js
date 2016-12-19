const electron = require('electron');
const path = require('path')
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
var parentWin = null
var childWin = null;
//获取书籍列表main-process
ipcMain.on('qqLogin', function(event, datas) {
	console.log('qqLogin');
	BrowserWindow.getAllWindows().forEach(function (win) {
		if (win.id==1) {
			parentWin = win
			//win.loadURL('http://www.yiluhao.com/login');
			var winOptions = {
				parent: win,
		      	width: 800,
		      	minWidth: 600,
		      	height: 600,
		      	title:'QQ登录',
		      	autoHideMenuBar: true,
		    }
		    winOptions.modal = true;

			childWin = new BrowserWindow(winOptions)
			childWin.loadURL('http://www.yiluhao.com/login')
			childWin.webContents.openDevTools()
			childWin.once('ready-to-show', () => {
			  childWin.show()
			})
		}
            
    })
});
function loginSucess(){
  console.log('loginSucess')
  console.log(global.UID);
  parentWin.loadURL(path.join('file://', global.APP_PATH, '/index.html'))
  //childWin.close();
}
function loginFail(){
  console.log('loginFail')
}
ipcMain.on('loginSucess', function(event, datas) {
	console.log('loginSucess')
	global.COMMON.checkLogin(loginSucess, loginFail)
});