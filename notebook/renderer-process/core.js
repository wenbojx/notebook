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
function setCurrentBid(bidd){
	if(!bid){
		return;
	}
	bid = bidd;
}
function getCurrentUid(){
	return uid;
}
function setCurrentUid(uidd){
	if (!uidd) {
		return;
	}
	uid = uidd;
}
function getCurrentBookid(){
	return bookid;
}
function setCurrentBookid(bookidd){
	if (!bookidd) {return}
	bookid = bookidd;
}
function getCurrentCid(){
	return cid;
}
function setCurrentCid(cidd){
	if (!cidd) {return}
	cid = cidd;
}

//ajax加载页面
function loadPage(url, callBack){
	//console.log(callBack);
	$.get(url, function(result){
		callBack(result);
  	});
}
function initScrollbar(node){
	$('#'+node).perfectScrollbar();
}

function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return unescape(r[2]); return null; 
}
/************** 全屏模式 start ********************/



