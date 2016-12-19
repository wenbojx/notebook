const ipcMain = require('electron').ipcMain
//获取书籍列表
ipcMain.on('getBookList', function(event, datas) {
	/*
	bookJs.book.getBookList(getBookListCallBack);
	function getBookListCallBack(datas){
		//console.log(datas);
		//mainWindow.webContents.send('getBookList', datas);
	}
	*/
});