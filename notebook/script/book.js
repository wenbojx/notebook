function bindAction(){
	bindCreatNode();
	bindRightClick();
}
function bindCreatNode(){
	$("#create_node").click(function(){
		if($("#creat_node_box").is(":hidden")){
		    $("#creat_node_box").show();
		}else{
		    $("#creat_node_box").hide(); 
		}
	})
}
//绑定页面中点击事件
function bindRightClick(){
	$("#create_volume").click(function(e){

	})
	$("#create_chapter").click(function(e){
		
	})
	$("#create_dagang").click(function(e){
		
	})
	$("#create_volume_id").click(function(e){
		console.log(e);
	})
	$("#create_chapter_id").click(function(e){
		
	})
	$("#create_dagang_id").click(function(e){
		
	})
	$("#chapter_list").mousedown(function(e) {
		if (3 == e.which) {
	        rightClickAction(e);
	    }
	})
}

//////////////////////////////////////////////////
function initScrollbar(node){
	$('#'+node).perfectScrollbar();
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
		width = width-40;
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
	self.setInterval("showWords()",500);
	self.setInterval("autoSave()",5000);
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
function saveContent(editor, datas){
	var content = UM.getEditor(editor).getContent();
  	if (content != lastContent) {
	  	datas.content = content;
	  	datas.title = $("#chapter_title").val();
	  	datas.cid = $("#chapter_id").val();
	  	datas.countword = getWords('editor');
	  	saveChapterContent(datas);
	  	lastContent = content;
	}
}

/*********** *****************/

function childClickHandler(id, title){
	if(!id || !title){
		return false;
	}
	getChapterContentIpc(id);
	setChapterId(id);
	setChapterTitle(title);
	
}
function nodeClickHandler(id){
	//console.log(id);
	if($("#chapter_child_"+id).is(":hidden")){
	    $("#chapter_child_"+id).show();
	}else{
	    $("#chapter_child_"+id).hide(); 
	}
	initScrollbar('chapter_list');
}
function clickHandler(e){
	    //console.log(e.which);
	    //左键为1
	    var id = $(e.currentTarget).attr("d-id");
	    var fid = $(e.currentTarget).attr("d-fid");
		var type = $(e.currentTarget).attr("d-type");
	    if (1 == e.which) {
	    	console.log(e);
	    	
			var title = $(e.currentTarget).attr("d-title");
			//console.log(fid+type+title);
			if ((fid=="0" && type=="2") || (fid!="0" && type=="2")) {
				childClickHandler(id, title);
			}
			else{
				nodeClickHandler(id);
			}
			addSelectClass(e.currentTarget.id);
			return;

	    } else if (3 == e.which) {
	        //右键为3
	        //console.log(e);
	        rightClickAction(e);
	    }
}
function rightClickAction(e){
	var offset = $("#chapter_list_contianer").offset();
	        console.log(offset);
	        var x = e.clientX - offset.left+5;
	        var y = e.clientY - offset.top+5;
	        //console.log(x+" "+y);
	        $("#right_click_column").css('left', x+"px");
	        $("#right_click_column").css('top',y+"px");
	        $("#right_click_column").show();
}
var lastNode = ''; //上一个点击的元素
function addSelectClass(node){
	if (!node) {return false;} 
	if (lastNode) {
		$("#"+lastNode).removeClass("selected");
	}
	$("#"+node).addClass("selected");
	lastNode = node;
}