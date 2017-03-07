function goToXiezuo(){
	//加载书架页
	var loadpage = "pages/home/home.html";
	var callBackLoadPage = function (result){
		//console.log(result);
		$("#content").html(result);
	}
	loadPage(loadpage, callBackLoadPage);
}
function goToQuanzi(){
	//加载书架页
	var loadpage = "pages/quanzi/index.html";
	var callBackLoadPage = function (result){
		$("#content").html(result);
	}
	loadPage(loadpage, callBackLoadPage);
}