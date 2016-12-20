
ipcRenderer.on('getBookList', function(event, datas) {
	//console.log(datas);
	callBackGetBookList(datas);

});
function callBackGetBookList(datas) {
	
	if (datas.length<1) { 
		return;
	}
	$.each(datas,function(i,n){
		//console.log(n);
		var string = '<li id="home_book_'+n['id']+'">';
		string += '<img width=80 src="./datas/images/'+n['pic']+'" /><br>';
		string += n['title'];
		string += '</li>';
		$("#home_book_list").append(string);
		$("#home_book_"+n['id']).click(function(){
			bid = n['id'];
			var loadpage = "pages/book.html";
			loadPage(loadpage);
		})
	});
}