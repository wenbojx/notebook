//绑定事件
function bindAction_book(){

	$("#bar_chapter").click(function(e){
		chapterListInit();
	})
	$("#bar_share").click(function(e){
		shareChapterListInit();
	})
	$("#bar_delete").click(function(e){
		deleteChapterListInit();
	})
}

function chapterListInit() {
	var loadpage = "pages/book/chapterList.html";
	var callBackLoadLeft = function(result){
		$("#left_column").html(result);
	}
	loadPage(loadpage, callBackLoadLeft);
	
	//载入右侧编辑区
	var loadpage = "pages/book/editor.html";
	var callBackLoadRight = function(result){
		$("#right_column").html(result);
	}
	loadPage(loadpage, callBackLoadRight);
	
}

function shareChapterListInit() {
	var loadpage = "pages/book/shareList.html";
	var callBackLoadLeft = function(result){
		$("#left_column").html(result);
	}
	loadPage(loadpage, callBackLoadLeft);
	/*
	//载入右侧编辑区
	var loadpage = "pages/book/editor.html";
	var callBackLoadRight = function(result){
		$("#right_column").html(result);
	}
	loadPage(loadpage, callBackLoadRight);
	*/
}

function deleteChapterListInit() {
	var loadpage = "pages/book/deleteList.html";
	var callBackLoadLeft = function(result){
		$("#left_column").html(result);
	}
	loadPage(loadpage, callBackLoadLeft);
	/*
	//载入右侧编辑区
	var loadpage = "pages/book/editor.html";
	var callBackLoadRight = function(result){
		$("#right_column").html(result);
	}
	loadPage(loadpage, callBackLoadRight);
	*/
}