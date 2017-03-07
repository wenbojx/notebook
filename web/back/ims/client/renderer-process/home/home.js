
ipcRenderer.on('getBookList', function(event, datas) {
	//console.log(datas);
	callBackGetBookList(datas);

});


function callBackGetBookList(datas) {
	if (datas.length<1) { 
		return;
	}
	$("#home_book_list").html("");
	$.each(datas,function(i,n){
		//console.log(n);
		var string = '<li id="home_book_'+n['id']+'">';
		string += '<img width=80 src="./datas/images/'+n['pic']+'" /><br>';
		string += n['title'];
		string += '</li>';
		$("#home_book_list").append(string);
		$("#home_book_"+n['id']).click(function(){
			loadBookPage(n['id']);
		})
	});
}
function loadBookPage(b_id){
	bid = b_id;
	var loadpage = "pages/book/book.html";
	loadPage(loadpage, callBackLoadPage);
	function callBackLoadPage(result){
		$("#content").html(result);
	}
}
