
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
function exitFullScreenIpc(cid){
	ipcRenderer.send('exitFullScreen', cid);
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
function getChapterInfoIpc(cid){
	ipcRenderer.send('getChapterInfo', cid);
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

function getShareChapterListIpc(bid){
	ipcRenderer.send('getShareChapterListIpc', bid);
}
function getDeleteChapterListIpc(datas){
	ipcRenderer.send('getDeleteChapterList', datas);
}

function deleteDeleteChapterIPC(datas){
	ipcRenderer.send('deleteDeleteChapter', datas);
}
function deleteRestoreChapterIPC(datas){
	ipcRenderer.send('deleteRestoreChapter', datas);
}
function deleteCleanChapterIPC(datas){
	ipcRenderer.send('deleteCleanChapter', datas);
}
function renameChapterIPC(datas){
	ipcRenderer.send('renameChapter', datas);
}
/*
function loadBookPageIpc(datas){
	ipcRenderer.send('getBookList', datas);
}
*/