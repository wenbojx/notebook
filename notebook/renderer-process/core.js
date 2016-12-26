var uid = '';
var bid = '';
var bookid = 0;

function getElement(element){
	return document.getElementById(element);
}

//ajax加载页面
function loadPage(url){
	$.get(url, function(result){
		$("#content").html(result);
  	});
}
/************** 全屏模式 start ********************/
function fullScreenAction(){
	var datas = {};
	datas.chapterId = getCurrentChapterId();
	datas.bookId = getCurrentBookId();
	fullScreenIpc();
	//重置内容绑定
	chapterContentVue = null;
	chapterInfoVue = null;
}


