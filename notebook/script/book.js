
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


function initEditor(editor){
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
}
function setEditorContent(content){
	UM.getEditor('editor').setContent(content);
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