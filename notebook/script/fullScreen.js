function exitFullScreen(){
	exitFullScreenIpc();
}

function timerFull(){
	self.setInterval("showWords()",200);
	//self.setInterval("autoSave()",1000);
}
function showWords(){
  var num = getWords('editor');
  $("#footer").html("字数:"+num);
}
function autoSave(){
	var datas = {};
	saveContent('editer_box', datas);
}

//设置高度
function resetHeight(){
	var height = $("body").height() - $("#edit_head").height() - $("#footer").height() -30;
	$("#editor").height(height);

}
//设置宽度
function resetWidth(){
	//var width = $("#editer_box").width();
	//$(".edui-container").width(width);
	//$(".edui-toolbar").width(width);
	//$(".edui-btn-toolbar").width($("#item").width());
	$("#editor").width($("#editer_box").width()-15);
	//console.log($("#editor").width());
}