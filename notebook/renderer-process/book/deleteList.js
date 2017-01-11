//设置高度
function resetHeight_deleteList(){
	var noteContentHeight = $("body").height() - $("#head").height();
	var chapterListHeight = noteContentHeight - $("#chapter_head").height();
	$("#chapter_list_box").height(chapterListHeight);
	//$("#left_column").height(noteContentHeight);
	console.log(noteContentHeight);
}

ipcRenderer.on('getDeleteChapterList', function(event, datas) {
	callBackGetDeleteChapterList(datas);
});
function callBackGetDeleteChapterList(datas){
	if(datas.length < 1){
		return;
	}
}