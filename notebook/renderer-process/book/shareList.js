//设置高度
function resetHeight_deleteList(){
	var noteContentHeight = $("body").height() - $("#head").height();
	var chapterListHeight = noteContentHeight - $("#chapter_head").height();
	$("#chapter_list_box").height(chapterListHeight);
	//$("#left_column").height(noteContentHeight);
	console.log(noteContentHeight);
}


//绑定页面中点击事件
function DeleteListBindRightClick(){
	$("#chapter_list_box").mousedown(function(e) {
		if (3 == e.which) {
	        deleteListRightClickAction(e);
	    }
	})
	$("#delete_delete").click(function(e){
		//console.log(e);
		deleteDeleteChapter(e);
	})
	$("#delete_restore").click(function(e){
		//console.log(e);
		deleteRestoreChapter(e);
	})
	$("#delete_clean").click(function(e){
		//console.log(e);
		deleteCleanChapter(e);
	})
}

function getDeleteChapterList(){
	var datas = {};
	datas.bid = bid;
	datas.sort = 'desc';
	getDeleteChapterListIpc(datas);
}

ipcRenderer.on('getDeleteChapterList', function(event, datas) {
	callBackGetDeleteChapterList(datas);
});
function callBackGetDeleteChapterList(datas){
	if(datas.length < 1){
		return;
	}
	console.log(datas);
	var string = "";
	$("#chapter_list").html("");
	for (var i in datas) {
		var node = datas[i];
		var className = 'volume';
		if (node['type'] != 1) {
			className = 'chapter';
		}
		string = '';
		string += '<div class="'+ className + '" d-id="'+node['id']+'">';
		
		string += '<li id="chapter_node_'+node['id']+'" d-id="'+node['id']+'" d-title="'+node['title']+'" d-fid="'+node['fid']+'" d-type="'+node['type']+'">';
		string += '<i></i><span class="node_text" id="node_text_'+node['id']+'">'+node['title']+'</span></li>';
		string += '</div>';
		$("#chapter_list").append(string);
		//绑定事件
		//$('#chapter_node_'+node['id']).bind("click", {}, nodeClickHandler);
		$('#chapter_node_'+node['id']).mousedown(function(e) {
			deleteListClickHandler(e);
		})
	}
	initScrollbar('chapter_list_box');
}
function deleteListClickHandler(e){
	    //console.log(e.which);
	    //左键为1
	    var id = $(e.currentTarget).attr("d-id");
	    var fid = $(e.currentTarget).attr("d-fid");
		var type = $(e.currentTarget).attr("d-type");
	    if (1 == e.which) {
			var title = $(e.currentTarget).attr("d-title");
			//console.log(fid+type+title);
			if ((fid=="0" && type=="2") || (fid!="0" && type=="2")) {
				childClickHandler(id, title);
			}
			else{
				//nodeClickHandler(id);
			}
	    } else if (3 == e.which) {
	        //右键为3
	        deleteListRightClickAction(e);
	    }
	    //添加选中效果
	    addSelectClass(e.target.id);
}

var right_click_child_id = '';
function deleteListRightClickAction(e){
	console.log("deleteListRightClickAction");
	right_click_child_id = e.target.id;
	if (right_click_child_id == "chapter_list_box"){
		right_click_child_id = "chapter_list";
	}
	var fvStart = right_click_child_id.indexOf("node_text_");
	if (fvStart == 0) {
		right_click_child_id = $("#"+right_click_child_id).parent().attr("id");
	}
	console.log(right_click_child_id);
	var offset = $("#chapter_box").offset();
	//console.log(offset);
	var x = e.clientX - offset.left+5;
	var y = e.clientY - offset.top+5;
	//console.log(x+" "+y);
	$("#right_click_column").css('left', x+"px");
	$("#right_click_column").css('top',y+"px");
	$("#right_click_column").show();
}


function deleteDeleteChapter(e){
	var id = $("#"+right_click_child_id).attr("d-id");
	if (!id) {
		return;
	}
	var datas = {};
	datas.id = id;
	console.log(id);
	deleteDeleteChapterIPC(datas);
}
ipcRenderer.on('deleteDeleteChapter', function(event, datas) {
	getDeleteChapterList();
});

function deleteRestoreChapter(e){
	var id = $("#"+right_click_child_id).attr("d-id");
	if (!id) {
		return;
	}
	var datas = {};
	datas.id = id;
	console.log(id);
	deleteRestoreChapterIPC(datas);
}
ipcRenderer.on('deleteRestoreChapter', function(event, datas) {
	getDeleteChapterList();
});
function deleteCleanChapter(e){
	var datas = {};
	datas.bid = bid;
	//console.log(id);
	deleteCleanChapterIPC(datas);
}
ipcRenderer.on('deleteCleanChapter', function(event, datas) {
	getDeleteChapterList();
});