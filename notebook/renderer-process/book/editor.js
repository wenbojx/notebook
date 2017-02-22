//设置高度
function resetHeight_editor(){
	var noteContentHeight = $("body").height() - $("#head").height();

	var height = noteContentHeight-$("#edit_head").height()-$("#edit_foot").height()-32;
	$("#editor").height(height);
}
// reset true/false  窗口改变大小是传true
function resetWidth_editor(reset){
	var rightColumnWidth = $("body").width() - $("#left_bar").width() - $("#left_column").width()-2;
	
	$("#right_column").width(rightColumnWidth); 

	var width = $("#editer_area").width();
	$(".edui-container").width(width);
	if (reset) {
		width = width-40;
	}
	$("#editor").width(width);
	//console.log(width);
}
/********* 全屏模式 *************/
function fullScreen(){
	var datas = {};
	datas.cid = getCurrentCid();
	datas.bid = getCurrentBid();
	fullScreenIpc(datas);
}

function bindEditorAction(){
	$("#chapter_title").change(function(){
		console.log("change");
		var id = $("#chapter_id").val();
		var value = $("#chapter_title").val();
		$("#node_text_"+id).html(value);
		
	})
}

function initEditor(editor){
	UM.delEditor(editor);
	var um = UM.getEditor(editor,{
            //这里可以选择自己需要的工具按钮名称,此处仅选择如下七个
            toolbar:[
            	'undo redo removeformat | bold italic underline strikethrough | forecolor backcolor |',
            'insertorderedlist insertunorderedlist | fontfamily fontsize' ,
            '| justifyleft justifycenter justifyright justifyjustify'
            ],
            //focus时自动清空初始化时的内容
            autoClearinitialContent:true,
            //关闭字数统计
            //wordCount:true,
            //关闭elementPath
            elementPathEnabled:false,
            //默认的编辑区域高度
            initialFrameHeight:300
            //更多其他参数，请参考umeditor.config.js中的配置项
       });
	console.log(123);
	initScrollbar('editor');
}
function setEditorContent(content){
	UM.getEditor('editor').setContent(content);
}
function setChapterId(id){
	$("#chapter_id").val(id);
}
function setChapterTitle(title){
	$("#chapter_title").val(title);
}

//计算字数
function getWords(editor){
	var content = UM.getEditor(editor).getContentTxt();
	//content = content.replace(" ", "");
	content = content.replace(/^\s+/, '').replace(/\s+$/, '');
	content = content.replace("\t", "");
	content = content.replace("\r", "");
	content = content.replace("\n", "");
	return content.length;
}



/************* 定时器 ****************/
function timer(){
	self.setInterval("showWords()",200);
	self.setInterval("autoSave()",1000);
}
function showWords(){
  var num = getWords('editor');
  $("#edit_foot").html("字数:"+num);
}
function autoSave(){
	var datas = {};
	saveContent('editor', datas);
}
//保存内容
var lastContent = null;
var lastTitle = null;
function saveContent(editor, datas){
	var content = UM.getEditor(editor).getContent();
	var title = $("#chapter_title").val();
  	if (content != lastContent || title != lastTitle) {
	  	datas.content = content;
	  	datas.title = title;
	  	datas.cid = $("#chapter_id").val();
	  	datas.countword = getWords('editor');
	  	console.log(datas);
	  	saveChapterContent(datas);
	  	lastContent = content;
	  	lastTitle = title;
	}
}