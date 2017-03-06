function exitFullScreen(){
	
	cid = getCurrentCid();
	bid = getCurrentBid();
	exitFullScreenIpc(cid);
}

function initChapterInfo(){
	var cid = getCurrentCid();
	//获取章节信息
	getChapterInfoIpc(cid);
	//获取章节内容
	getChapterContentIpc(cid);
}
ipcRenderer.on('getChapterInfo', function(event, datas) {
	callBackgetChapterInfo(datas);
});
function callBackgetChapterInfo(datas){
	console.log(datas);
	$("#chapter_title").val(datas.title);
	$("#chapter_id").val(datas.id);

}

ipcRenderer.on('getChapterContent', function(event, datas) {
	callBackGetChapterContent(datas);
});
function callBackGetChapterContent(datas){
	var content = '';
	if (datas != null && typeof(datas['content']) != 'undefined') {
		content = datas['content'];
	}
	setEditorContent(content);
}


function timerFull(){
	self.setInterval("fullShowWords()",200);
	self.setInterval("autoSave()",1000);
}
function fullShowWords(){
  var num = getWords('editor');
  $("#footer").html("字数:"+num);
}


//设置高度
function resetHeight(){
	var height = $("body").height() - $("#edit_head").height() - $("#footer").height() -40;
	$("#editor").height(height);
	console.log($("body").height());
}
//设置宽度
function resetWidth(){
	$("#editor").width($("#editer_box").width()-10);
}