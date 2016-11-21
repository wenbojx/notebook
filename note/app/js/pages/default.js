function selectBar(bar_name){
	var bars=new Array("book","volume","chapter","share","delete");
	for (var i = 0; i <bars.length; i++) {
		if (bars[i] == bar_name) {
			$("#"+bars[i]).addClass("bar_selected");
			$("#"+bars[i]+"_colume").show();
			
		}
		else{
			$("#"+bars[i]).removeClass("bar_selected");
			$("#"+bars[i]+"_colume").hide();
			
		}
	}
}
function loadBook(){
	$("#book_colume").hide();
	$("#book_node").show();
	$("#volume_colume").show();
}

function initScrollbar(){
	$('#book_list').perfectScrollbar();
	$('#volume_list').perfectScrollbar();
	$('#chapter_list').perfectScrollbar();
	$('#editor').perfectScrollbar();
}
//设置高度
function resetHeight(){
	var noteContentHeight = $("body").height() - $("#head").height();
	//console.log(noteContentHeight+"/"+$("#head").height() + "/"+$("body").height());
	$("#note_content").height(noteContentHeight);
	var bookListHeight = noteContentHeight - $("#book_head").height();
	$("#book_list").height(bookListHeight);
	var volumeListHeight = noteContentHeight - $("#volume_head").height();
	$("#volume_list").height(volumeListHeight);
	var chapterListHeight = noteContentHeight - $("#chapter_head").height();
	$("#chapter_list").height(chapterListHeight);

	var height = noteContentHeight-$("#edit_head").height()-$("#edit_foot").height()-32;
	$("#editor").height(height);
}
// reset true/false  窗口改变大小是传true
function resetWidth(reset){
	var rightColumnWidth = $("body").width() - $("#left_bar").width() - $("#left_column").width()-2;
	
	$("#right_column").width(rightColumnWidth); 

	var width = $("#editer_area").width();
	$(".edui-container").width(width);
	if (reset) {
		width = width-20;
	}
	$("#editor").width(width);
	//console.log(width);
}
//获取最后一次关闭时打开的栏目
function getCurrentColume(){

}
//获取当前的书，卷，章
function getCurrentBookInfo(){

}