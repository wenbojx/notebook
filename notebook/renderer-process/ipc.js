const ipcRenderer = require('electron').ipcRenderer;

//最小化
function miniWindowIpc(){
	ipcRenderer.send('miniWindow', null);
}
function closeWindowIpc(){
	ipcRenderer.send('closeWindow', null);
}
function restoreWindowIpc(){
	ipcRenderer.send('restoreWindow', null);
}
function exitFullScreenIpc(){
	ipcRenderer.send('exitFullScreen', true);
}
/************** 全屏模式 start ********************/
function fullScreenIpc(datas){
	ipcRenderer.send('fullScreen', datas);
}
function getBookListIpc(datas){
	ipcRenderer.send('getBookList', datas);
}
function getBookInfoIpc(bid){
	ipcRenderer.send('getBookInfo', bid);
}
function getChapterListIpc(bid){
	ipcRenderer.send('getChapterList', bid);
}
function getChapterContentIpc(cid){
	ipcRenderer.send('getChapterContent', cid);
}
function saveChapterContentIPC(datas){
	ipcRenderer.send('saveChapterContent', datas);
}
function creatVolumeIPC(datas){
	ipcRenderer.send('creatVolume', datas);
}
function creatChapterIPC(datas){
	ipcRenderer.send('creatChapter', datas);
}
function deleteChapterIPC(datas){
	ipcRenderer.send('deleteChapter', datas);
}
function getDeleteChapterListIpc(bid){
	ipcRenderer.send('getDeleteChapterList', bid);
}

/*
function loadBookPageIpc(datas){
	ipcRenderer.send('getBookList', datas);
}
*/