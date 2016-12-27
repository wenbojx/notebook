function bindAction(){
	bindCreatNode();
	bindRightClick();
	hideRightClickClumn();
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
		createVolume(e);
	})
	$("#create_chapter_id").click(function(e){
		//console.log(e);
		createChapter(e);
	})
	$("#create_dagang_id").click(function(e){
		
	})
	$("#flash_chapter_list").click(function(e){
		createNodeFlag = false;
		getChapterListIpc(bid);
	})
	$("#delete_chapter").click(function(e){
		delete_chapter(e);
	})
	
	$("#chapter_list").mousedown(function(e) {
		if (3 == e.which) {
	        rightClickAction(e);
	    }
	})
}
function hideRightClickClumn(){
	$("body").click(function(event){
		$("#right_click_column").hide(); 
	}); 
}
/************* 创建动作 *******************/
var createNodeFlag = false;
function createVolume(e){
	//console.log(e);
	if (createNodeFlag) {
		return false;
	}
	var string = '<div class="volume" id="creatVolumeDiv">';
	string += '<li>';
	string += '<i></i>';
	string += '<input type="text" name="volume_name" id="volume_name_input" value="卷名"/>';
	string += '<img src="assets/default/img/save_datas.png" onclick="createVolumeAction()"/></li></div>';
	if(right_click_child_id == 'chapter_list'){
		$("#"+right_click_child_id).append(string);
	}
	else{
		$("#"+right_click_child_id).parent().after(string);
	}
	
	console.log(right_click_child_id);
	createNodeFlag = true;
}
function createVolumeAction(){
	var datas = {};
	var pre = $("#creatVolumeDiv").prev().attr("d-id");
	var next = $("#creatVolumeDiv").next().attr("d-id");
	//console.log(pre+"-"+next);
	datas.pre = pre?pre:0;
	datas.next = next?next:0;
	datas.bid = bid;
	datas.bookid = bookid;
	datas.type = 1;
	datas.title = $("#volume_name_input").val();
	creatVolume(datas);
}
function createChapter(e){
	//console.log(e);
	if (createNodeFlag) {
		return false;
	}
	var clickRoot = false;
	if (right_click_child_id == 'chapter_list'){
		clickRoot = true;
	}

	var string = "";
	if (clickRoot) {
		string += '<div class="chapter">';
	}
	string += '<li id="creatChapterDiv">';
	string += '<i></i>';
	string += '<input type="text" name="chapter_name" id="chapter_name_input" value="章名"/>';
	string +='<img src="assets/default/img/save_datas.png" onclick="createChapterAction()"/></li>';
	if (clickRoot) {
		string += '</div>';
	}
	var fdStart = right_click_child_id.indexOf("chapter_child_li_");
	if(fdStart == 0){
	   	var id = $("#"+right_click_child_id).attr('d-id');
		$("#chapter_child_li_"+id).after(string);
	}
	else if (right_click_child_id == 'chapter_list') {
		$("#"+right_click_child_id).append(string);
	}
	else{
		var id = $("#"+right_click_child_id).attr('d-id');
		$('#chapter_child_'+id).append(string);
	}
	createNodeFlag = true;
}
function createChapterAction(){
	var fid = 0;
	if (right_click_child_id != 'chapter_list') {
		$("#"+right_click_child_id).append(string);
	}
	var datas = {};
	var pre = $("#creatChapterDiv").parent().prev().attr("d-id");
	var next = $("#creatChapterDiv").parent().next().attr("d-id");
	//console.log(pre+"-"+next);
	datas.pre = pre?pre:0;
	datas.next = next?next:0;
	datas.bid = bid;
	datas.fid = fid;
	datas.bookid = bookid;
	datas.type = 2;
	datas.title = $("#chapter_name_input").val();
	creatChapter(datas);
}
function delete_chapter(e){
	
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
	$("#chapter_list_box").height(chapterListHeight);

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
	initScrollbar('chapter_list_box');
}
function clickHandler(e){
	    //console.log(e.which);
	    //左键为1
	    var id = $(e.currentTarget).attr("d-id");
	    var fid = $(e.currentTarget).attr("d-fid");
		var type = $(e.currentTarget).attr("d-type");
	    if (1 == e.which) {
	    	//console.log(e);
	    	
			var title = $(e.currentTarget).attr("d-title");
			//console.log(fid+type+title);
			if ((fid=="0" && type=="2") || (fid!="0" && type=="2")) {
				childClickHandler(id, title);
			}
			else{
				nodeClickHandler(id);
			}
			//添加选中效果
			//addSelectClass(e.currentTarget.id);
			//return;

	    } else if (3 == e.which) {
	        //右键为3
	        //console.log(e);
	        rightClickAction(e);
	    }
	    //添加选中效果
	    addSelectClass(e.currentTarget.id);
}
var right_click_child_id = '';
function rightClickAction(e){
	right_click_child_id = e.currentTarget.id;
	var offset = $("#chapter_box").offset();
	//console.log(offset);
	var x = e.clientX - offset.left+5;
	var y = e.clientY - offset.top+5;
	//console.log(x+" "+y);
	$("#right_click_column").css('left', x+"px");
	$("#right_click_column").css('top',y+"px");
	$("#right_click_column").show();
}
var lastNode = ''; //上一个点击的元素
//var currentNode = '';//当前元素
function addSelectClass(node){
	if (!node) {return false;} 
	if (lastNode) {
		$("#"+lastNode).removeClass("selected");
	}
	$("#"+node).addClass("selected");
	lastNode = node;
}