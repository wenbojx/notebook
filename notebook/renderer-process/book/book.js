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
	console.log(datas);
	callBackGetChapterList(datas);
});
function callBackGetChapterList(datas){
	
}

