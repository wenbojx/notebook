ipcRenderer.on('getBookInfo', function(event, datas) {
	callBackGetBookInfo(datas);
});
function callBackGetBookInfo(datas){
	$("#book_book").attr('title',datas['title']);
	var src = "datas/images/" + datas['pic'] ;
	$("#book_book_pic").attr('src', src);
}
//////////////////////////////////////////
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
		string = '';
		string += '<div class="'+ className + '" d-id="'+node['id']+'">';
		
		string += '<li id="chapter_node_'+node['id']+'" d-id="'+node['id']+'" d-title="'+node['title']+'" d-fid="'+node['fid']+'" d-type="'+node['type']+'">';
		string += '<i></i><span class="node_text" id="node_text_'+node['id']+'">'+node['title']+'</span></li>';
		string += '</div>';
		$("#chapter_list").append(string);
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
				string += '<i></i><span class="node_text" id="node_text_'+childNode['id']+'">'+childNode['title']+'</span></li>';

				$('#chapter_child_'+node['id']).append(string);
				//$('#chapter_child_li_'+childNode['id']).bind("click", {}, childClickHandler);  
				$('#chapter_child_li_'+childNode['id']).mousedown(function(e) {
					clickHandler(e);
				})
			}
		}
	}
	initScrollbar('chapter_list_box');
}

function sortArray(data){
    var next=0,result=[],id_arr=[];//photo_id_arr保存所有的photo_id
	data.sort(function(a,b){//排序只是为了保证data[0]取到的是链表的头元素
		return a.pre-b.pre;
	});
	for (i in data) {
		id_arr.push(data[i].id);
	}
	
	while(next!=-1){//如果元素的next(即下一个photo_id)在photo_id_arr中存在
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
///////////////////////////////////////
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
function saveChapterContent(datas){
	saveChapterContentIPC(datas);
}
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
	callBackCreatVolume(datas);
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
});
function callBackcreatChapter(){
	getChapterListIpc(bid);
	createNodeFlag = false;
}
