const ipcRenderer = require('electron').ipcRenderer;
function getElement(element){
	return document.getElementById(element);
}

//ajax加载页面
function loadPage(url){
	$.get(url, function(result){
		$("#content").html(result);
  	});
}

//最小化
function miniWindow(){
	ipcRenderer.send('miniWindow', null);
}

function closeWindow(){
	ipcRenderer.send('closeWindow', null);
}
function restoreWindow(){
	ipcRenderer.send('restoreWindow', null);
}


/************** 全屏模式 start ********************/
function fullScreen(){
	var datas = {};
	datas.chapterId = getCurrentChapterId();
	datas.bookId = getCurrentBookId();
	ipcRenderer.send('fullScreen', datas);
	//重置内容绑定
	chapterContentVue = null;
	chapterInfoVue = null;
}
function exitFullScreen(){
	ipcRenderer.send('exitFullScreen', true);
}

