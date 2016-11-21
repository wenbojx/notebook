
function timer(){
	self.setInterval("showWords()",200);
	self.setInterval("autoSave()",1000);
}
function showWords(){
  var num = getWords('editor');
  $("#footer").html("字数:"+num);
}
function autoSave(){
	var datas = {};
	datas.bookId = ChapterDatas.bookId;
	datas.name = ChapterDatas.name;
	datas.chapterId = ChapterDatas.chapterId;
	autoSaveContent('editor', datas);
}

//设置高度
function resetHeight(){
	var height = $(document.body).height() - $("#edit-head").height() - $("#footer").height() -30;
	$("#editor").height(height);

}
//设置宽度
function resetWidth(){
	var width = $(document).width();
	$(".edui-container").width(width);
	$(".edui-toolbar").width(width);
	$(".edui-btn-toolbar").width($("#item").width());
	$("#editor").width($("#item").width());
}

