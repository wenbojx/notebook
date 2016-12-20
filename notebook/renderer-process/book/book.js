ipcRenderer.on('getBookInfo', function(event, datas) {
	//console.log(datas);
	callBackGetBookInfo(datas);
});
function callBackGetBookInfo(datas){
	$("#book_book").attr('title',datas['title']);
	var src = "datas/images/" + datas['pic'] ;
	$("#book_book_pic").attr('src', src);
}

ipcRenderer.on('getChapterList', function(event, datas) {
	callBackGetChapterList(datas);
});
function callBackGetChapterList(datas){
	//console.log(datas.length);
	var chapterDatas = sortChaterDatas(datas);
	
}
function sortChaterDatas(datas){
	var sortData = new Array();
	var j = 0;
	for (var i = 0; i < datas.length; i++) {
		if (datas[i]['fid'] == 0) {
			//console.log(datas[i]);
			var id = datas[i]['id'];
			sortData[id] = new Array();
			sortData[id]['node'] = datas[i];
			sortData[id]['child'] = new Array();
			//datas.splice(i, 1);
			j++;
		}
	}
	j = 0;
	for (var i = 0; i < datas.length; i++) {
		var fid = datas[i]['fid'];
		if (fid != 0 && typeof(sortData[fid]) != "undefined") {

			sortData[fid]['child'][j] = datas[i];
			//datas.splice(i, 1);
			j++;
		}
	}
	console.log(sortData);
	return sortData;
}

