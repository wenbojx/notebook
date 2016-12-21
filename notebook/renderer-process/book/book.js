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
	for (var i in chapterDatas) {
		var node = chapterDatas[i]['node'];
		var child = chapterDatas[i]['child'];
		var className = node['type'] == 1 ? 'volume':'chapter';
		string = '';
		string += '<div class="'+ className + '">';
		
		string += '<li id="chapter_node_'+node['id']+'">';
		string += '<i></i><a href="javascript:void(0)">'+node['title']+'</a></li>';
		string += '</div>';
		$("#chapter_list").append(string);
		if(node['type'] == 2){
			$('#chapter_node_'+node['id']).bind("click", {id: node['id']}, childClickHandler);  
		}
		else{
			$('#chapter_node_'+node['id']).bind("click", {id: node['id']}, nodeClickHandler);
		}
		string = "";
		if(child.length >0 ) {
			string = '<ul style="display:none" class="chapter" id="chapter_child_'+node['id']+'"></ul>';
			$('#chapter_node_'+node['id']).after(string);
			string = '';
			for (var j in child) {
				string = '<li id="chapter_child_li_'+child[j]['id']+'">';
				string += '<i></i><a href="javascript:void(0)">'+child[j]['title']+'</a></li>';

				$('#chapter_child_'+node['id']).append(string);
				$('#chapter_child_li_'+child[j]['id']).bind("click", {id: child[j]['id']}, childClickHandler);  
			}
		}
	}
	initScrollbar('chapter_list');
	
}

function childClickHandler(event){
	var id= event.data.id;  
	getChapterContentIpc(id);
}
function nodeClickHandler(event){
	var id= event.data.id;  
	if($("#chapter_child_"+id).is(":hidden")){
	    $("#chapter_child_"+id).show();
	}else{
	    $("#chapter_child_"+id).hide(); 
	}
	initScrollbar('chapter_list');
}
function sortChaterDatas(datas, sort){
	var sortData = new Array();
	var sortPre = new Array();
	var j = 0;
	for (i in datas) {
		var fid = datas[i]['fid'];
		if (fid == 0) {
			//console.log(datas[i]);
			var id = datas[i]['id'];
			if (typeof(sortData[id]) == "undefined") {
				sortData[id] = new Array();
			}
			sortData[id]['node'] = datas[i];
			if (typeof(sortData[id]['child']) == "undefined") {
				sortData[id]['child'] = new Array();
			}
			sortPre[j] = id;
			j++;
		}
		else{
			if (typeof(sortData[fid]) == "undefined") {
				sortData[fid] = new Array();
				
			}
			if (typeof(sortData[fid]['child']) == "undefined"){
				sortData[fid]['child'] = new Array();
			}
			var length = sortData[fid]['child'].length;
			
			sortData[fid]['child'][length] = datas[i];
		}
	}
	if (sort == 'desc') {
		var sortDescData = new Array();
		var length = sortPre.length-1;
		var j = 0;
		for (var i = length; i >=0 ; i--) {
			var k = sortPre[i];
			sortDescData[j] = sortData[k];
			j++;
		}
		sortData = sortDescData;
	}

	return sortData;
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
	setChapterId(datas['cid']);
}
////////////////////////////////////////////////////
function saveChapterContent(datas){
	saveChapterContentIPC(datas);
}
ipcRenderer.on('saveChapterContent', function(event, datas) {
	callBackSaveChapterContent(datas);
});
function callBackSaveChapterContent(datas){
	
}
////////////////////////////////////////////////

