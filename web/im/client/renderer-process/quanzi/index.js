
function resetHeight(){
	var contentHeight = document.body.clientHeight - getElement("head").clientHeight
	getElement("user_list").style.height = contentHeight - getElement("user_search").clientHeight+"px";
	getElement("chat_list").style.height = contentHeight - getElement("chat_input").clientHeight+"px";
	console.log(getElement("chat_list").style.height);

}
//设置宽度
function resetWidth(){
	getElement("right").style.width = getElement("content").clientWidth-getElement("left").offsetWidth-getElement("center").offsetWidth + "px";
	
}

function initScrollbar(){
	$('#user_list').perfectScrollbar();
	$('#chat_list').perfectScrollbar();
}