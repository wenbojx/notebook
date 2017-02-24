//设置高度
function resetHeight_chapterList(){
	var noteContentHeight = $("body").height() - $("#head").height();
	var chapterListHeight = noteContentHeight - $("#chapter_head").height();
	$("#chapter_list_box").height(chapterListHeight);
	//$("#left_column").height(noteContentHeight);
	//console.log(noteContentHeight);
}
//默认选中的章节
//var defaultChapterId = 186;
//var defaultChapterDatas = null;

ipcRenderer.on('getChapterList', function(event, datas) {
	callBackGetChapterList(datas);
});
function callBackGetChapterList(datas){
	if(datas.length < 1){
		return;
	}
	var chapterDatas = sortChaterDatas(datas, "asc");
	var string = "";
	$("#chapter_list").html("");
	for (var i in chapterDatas) {
		var node = chapterDatas[i]['node'];
		var child = chapterDatas[i]['child'];
		var className = 'volume';
		if (node['type'] != 1) {
			className = 'chapter';
		}
		var showTitle = subString(node['title'], 20, "...");
		string = '';
		string += '<div class="'+ className + '" d-id="'+node['id']+'">';
		
		string += '<li id="chapter_node_'+node['id']+'" d-id="'+node['id']+'" d-title="'+node['title']+'" d-fid="'+node['fid']+'" d-type="'+node['type']+'">';
		string += '<i></i><span class="node_text" id="node_text_'+node['id']+'">'+showTitle+'</span></li>';
		string += '</div>';
		$("#chapter_list").append(string);
		defaultSelectItem(node, false);
		//绑定事件
		//$('#chapter_node_'+node['id']).bind("click", {}, nodeClickHandler);
		$('#chapter_node_'+node['id']).mousedown(function(e) {
			clickHandler(e);
		})
		if (node['type'] == 1) {
			string = '<ul style="display:none" class="chapter" id="chapter_child_'+node['id']+'"></ul>';
			$('#chapter_node_'+node['id']).after(string);
		}
		if(child.length >0 ) {
			string = '';
			for (var j in child) {
				var childNode = child[j];
				string = '<li id="chapter_child_li_'+childNode['id']+'" ';
				string += 'd-id="'+childNode['id']+'" d-title="'+childNode['title']+'" ';
				string += 'd-fid="'+childNode['fid']+'" d-type="'+childNode['type']+'">';
				showTitle = subString(childNode['title'], 20, "...");
				string += '<i></i><span class="node_text" id="node_text_'+childNode['id']+'">'+showTitle+'</span></li>';

				$('#chapter_child_'+node['id']).append(string); 
				$('#chapter_child_li_'+childNode['id']).mousedown(function(e) {
					clickHandler(e);
				})
				defaultSelectItem(childNode, true);
			}
		}
	}
	initScrollbar('chapter_list_box');
}


//child是否子节点
function defaultSelectItem(datas, child){
	var id = datas['id'];
	var title = datas['title'];
	var defaultChapterId = getCurrentCid();
	if (defaultChapterId == 0 || defaultChapterId !=id) {
		return;
	}
	var node = "";
	if (child) {
		node = "chapter_child_li_" + id;
		$("#chapter_child_" + datas.fid).show();
	}
	else{
		node = "chapter_node_" + id;
	}
	$("#"+node).addClass("selected");
	lastClickNode = node;

	//defaultChapterDatas = datas;
	childClickHandler(id, title);
	return true
}

function sortArray(data){
    var next=0,result=[],id_arr=[];
	data.sort(function(a,b){
		return a.pre-b.pre;
	});
	for (i in data) {
		id_arr.push(data[i].id);
	}
	
	while(next!=-1){
		var cur=data[next];
		result.push(cur);
		next=id_arr.indexOf(cur.next);
	}
	return result;
}
function sortChaterDatas(datas, sort){
	//console.log(datas);
	var topLevel = new Array();
	var secendLevel = new Array();
	var j = 0;
	var k = 0;
	for (var i = 0; i < datas.length; i++) {
		var fid = datas[i]['fid'];
		if (fid == 0) {
			topLevel[j] = datas[i];
			j++;
		}
		else{
			if (typeof(secendLevel[fid]) == "undefined") {
				secendLevel[fid] = new Array();
			}
			secendLevel[fid][k] = datas[i];
			k++;
		}
	}
	topLevel = sortArray(topLevel);
	//console.log(topLevel);
	var sortDatas = new Array();
	for (var i = 0; i < topLevel.length; i++) {
		sortDatas[i] = new Array();
		sortDatas[i]['node'] = topLevel[i];
		sortDatas[i]['child'] = new Array();
		var id = topLevel[i]['id'];

		if (typeof(secendLevel[id]) != "undefined") {
			//console.log(secendLevel[id]);
			secendLevel[id] = sortArray(secendLevel[id]);
			sortDatas[i]['child'] = secendLevel[id];
		}
	}
	//console.log(sortDatas);
	return sortDatas;
}
//绑定事件
function bindAction_chapterList(){
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
		createVolume(e);
		$("#creat_node_box").hide();
	})
	$("#create_chapter").click(function(e){
		createChapter(e);
		$("#creat_node_box").hide();
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
	$("#rename_chapter_id").click(function(e){
		//console.log(e);
		renameChapter(e);
	})
	$("#flash_chapter_list").click(function(e){
		createNodeFlag = false;
		getChapterListIpc(bid);
	})
	$("#delete_chapter").click(function(e){
		delete_chapter(e);
	})
	$("#share_chapter_id").click(function(e){
		alert("share");
	})
	
	$("#chapter_list_box").mousedown(function(e) {
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
	var clickNode = '';
	if (right_click_child_id != "") {
		clickNode = right_click_child_id;
	}
	else if (left_click_child_id  != "" ) {
		clickNode = left_click_child_id;
	}
	else{
		clickNode = 'chapter_list';
	}
	console.log("clickNode:"+clickNode);
	if (createNodeFlag) {
		return false;
	}
	//1根目录  2子章节  3其它
	var clickType = 3;
	if (clickNode == 'chapter_list') {
		clickType = 1;
	}
	var fdStart = clickNode.indexOf("chapter_child_li_");
	if (fdStart == 0) {
		clickType = 2;
	}

	var string = '<div class="volume" id="creatVolumeDiv">';
	string += '<li>';
	string += '<i></i>';
	string += '<input type="text" name="volume_name" id="volume_name_input" value="卷名"/>';
	string += '<img src="assets/default/img/save_datas.png" onclick="createVolumeAction()"/></li></div>';
	if(clickType == 1){
		$("#chapter_list").append(string);
	}
	else if(clickType == 2){
		$("#"+clickNode).parent().parent().after(string);
	}
	else{
		$("#"+clickNode).parent().after(string);
	}
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
	var clickNode = '';
	if (right_click_child_id != "") {
		clickNode = right_click_child_id;
	}
	else if (left_click_child_id  != "" ) {
		clickNode = left_click_child_id;
	}
	else{
		clickNode = 'chapter_list';
	}
	console.log("clickNode:"+clickNode);

	//console.log(e);
	if (createNodeFlag) {
		return false;
	}
	//1、点击根元素 2、点击根章节  3、点击根卷   4、点击子章节
	var clickType = 1;
	var fdStart = clickNode.indexOf("chapter_child_li_");
	if (fdStart == 0) {
		clickType = 4;
	}
	if (clickNode == 'chapter_list') {
		clickType = 1;
	}
	var fvStart = clickNode.indexOf("chapter_node_");
	if (fvStart == 0) {
		if ($("#"+clickNode).attr('d-type') == 1) {
			clickType = 3;
		}
		else{
			clickType = 2;
		}
	}
	var clickRoot = false;
	if (clickType == 1 || clickType == 2){
		clickRoot = true;
	}

	var string = "";
	if (clickRoot) {
		string += '<div class="chapter">';
	}
	string += '<li id="creatChapterDiv">';
	string += '<i></i>';
	string += '<input type="text" name="chapter_name" id="chapter_name_input" value="章名"/>';
	string +='<img c_type="'+clickType+'" id="save_chapter_btn" src="assets/default/img/save_datas.png" onclick="createChapterAction()"/></li>';
	if (clickRoot) {
		string += '</div>';
	}
	//console.log(right_click_child_id);
	
	if(clickType == 4){
	   	var id = $("#"+clickNode).attr('d-id');
		$("#chapter_child_li_"+id).after(string);
	}
	else if(clickType == 2){
		$("#"+clickNode).parent().after(string);
	}
	else if (clickType == 1) {
		$("#chapter_list").append(string);
	}
	else if (clickType == 3){
		var id = $("#"+clickNode).attr('d-id');
		$('#chapter_child_'+id).append(string);
		$("#chapter_child_"+id).show();

	}
	createNodeFlag = true;
}
//clickType = 1、点击根元素 2、点击根章节  3、点击根卷   4、点击子章节
function createChapterAction(){
	var clickType = $("#save_chapter_btn").attr('c_type');
	var fid = 0;
	var pre = 0;
	var next = 0;

	if (clickType == 1 || clickType==2) {
		pre = $("#creatChapterDiv").parent().prev().attr("d-id");
		next = $("#creatChapterDiv").parent().next().attr("d-id");
	}
	else{
		fid = $("#creatChapterDiv").parent().parent().attr("d-id");
		pre = $("#creatChapterDiv").prev().attr("d-id");
		next = $("#creatChapterDiv").next().attr("d-id");
	}
	console.log(right_click_child_id);
	var datas = {};
	
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
function renameChapter(e){
	var cid = $("#"+right_click_child_id).attr('d-id');
	var title = $("#"+right_click_child_id).attr('d-title');
	if (!cid) {
		return;
	}
	var content = '<input type="text" value="'+title+'" name="rename_chapter_title" class="rename_chapter_title" id="rename_chapter_title">';
	content += '<input type="hidden" value="'+cid+'" name="rename_chapter_id"  id="rename_chapter_id">';
	var d = dialog({
	    title: '重命名',
	    content: content,
	    okValue: '确定',
	    ok: function () {
	    	var datas = {};
	    	datas.cid = cid;
	    	datas.title = $("#rename_chapter_title").val();
	    	renameChapterIPC(datas);
	    	setCurrentCid(cid);
	        return true;
	    },
	    cancelValue: '取消',
	    cancel: function () {}
	});
	d.showModal();
}

function delete_chapter(e){
	console.log(right_click_child_id);
	//var fvStart = right_click_child_id.indexOf("chapter_child_li");
	//chapter_node
	var id = $("#"+right_click_child_id).attr("d-id");
	if (!id) {
		return;
	}
	var datas = {};
	datas.id = id;
	deleteChapterIPC(datas);
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
var left_click_child_id = '';
function clickHandler(e){
	    //console.log(e.which);
	    //左键为1
	    var id = $(e.currentTarget).attr("d-id");
	    var fid = $(e.currentTarget).attr("d-fid");
		var type = $(e.currentTarget).attr("d-type");
	    if (1 == e.which) {
	    	//console.log(e);
			var title = $(e.currentTarget).attr("d-title");
			if ((fid=="0" && type=="2") || (fid!="0" && type=="2")) {
				childClickHandler(id, title);
			}
			else{
				nodeClickHandler(id);
			}
			left_click_child_id = $(e.currentTarget).attr("id");
			console.log("left_click_child_id:"+left_click_child_id);
			//defaultChapterId = id;
			setCurrentCid(id);

	    } else if (3 == e.which) {
	        //右键为3
	        //console.log(e);
	        rightClickAction(e);
	    }
	    //添加选中效果
	    addSelectClass(e.target.id);
}
var right_click_child_id = '';
function rightClickAction(e){
	right_click_child_id = e.target.id;
	if (!right_click_child_id) {
		return false;
	}
	if (right_click_child_id == "chapter_list_box"){
		right_click_child_id = "chapter_list";
	}
	var fvStart = right_click_child_id.indexOf("node_text_");
	if (fvStart == 0) {
		right_click_child_id = $("#"+right_click_child_id).parent().attr("id");
	}
	console.log("rightClickAction:"+right_click_child_id);
	var offset = $("#chapter_box").offset();
	//console.log(offset);
	var x = e.clientX - offset.left+5;
	var y = e.clientY - offset.top+5;
	//console.log(x+" "+y);
	$("#right_click_column").css('left', x+"px");
	$("#right_click_column").css('top',y+"px");
	$("#right_click_column").show();
}
var lastClickNode = ''; //上一个点击的元素
//var currentNode = '';//当前元素
function addSelectClass(node){
	if (!node) {return false;} 
	if (lastClickNode) {
		$("#"+lastClickNode).removeClass("selected");
	}
	var fvStart = node.indexOf("node_text_");
	if (fvStart == 0) {
		node = $("#"+node).parent().attr("id");
	}
	$("#"+node).addClass("selected");
	lastClickNode = node;
}

/*******************************/
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
////////////////////////////////////////////////////

ipcRenderer.on('saveChapterContent', function(event, datas) {
	callBackSaveChapterContent(datas);
});
//保存成功回调
function callBackSaveChapterContent(datas){
	//console.log(datas);
}
////////////////////////////////////////////////
function creatVolume(datas){
	creatVolumeIPC(datas);
}
ipcRenderer.on('creatVolume', function(event, datas) {
	callBackCreatVolume();
	setCurrentCid(datas);
	//console.log(datas);
});
function callBackCreatVolume(){
	getChapterListIpc(bid);
	createNodeFlag = false;
}
function creatChapter(datas){
	creatChapterIPC(datas);
}
ipcRenderer.on('creatChapter', function(event, datas) {
	callBackcreatChapter(datas);
	console.log(datas);
	setCurrentCid(datas);
});
function callBackcreatChapter(datas){
	getChapterListIpc(bid);
	createNodeFlag = false;
}
ipcRenderer.on('deleteChapter', function(event, datas) {
	callBackDeleteChapter(datas);
});
function callBackDeleteChapter(datas){
	getChapterListIpc(bid);
	//createNodeFlag = false;
}

ipcRenderer.on('renameChapter', function(event, datas) {
	getChapterListIpc(bid);
});