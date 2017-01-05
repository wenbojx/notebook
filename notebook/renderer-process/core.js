var uid = '';
var bid = '';
var cid = '';
var bookid = 0;

function getElement(element){
	return document.getElementById(element);
}
function getCurrentBid(){
	return bid;
}
function getCurrentUid(){
	return uid;
}
function getCurrentBookid(){
	return bookid;
}
function getCurrentCid(){
	return cid;
}
//ajax加载页面
function loadPage(url){
	$.get(url, function(result){
		$("#content").html(result);
  	});
}
/************** 全屏模式 start ********************/



