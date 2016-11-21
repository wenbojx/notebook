
//获取书列表
function getBookList(){
	ipcRenderer.send('getBookList', null);
}
//获取当前书籍
function getCurrentBook(){
	ipcRenderer.send('getCurrentBook', null);
}
var currentBookInfo = null;
function callBackRenderBookInfo(datas){
	currentBookInfo = datas;
	//console.log(datas.info);
	initBookContextMenu();
}
function callBackRenderVolumeList(datas){
	initVolumeContextMenu();
}
function callBackGetBookByBidSuccess(){
	bookListOpen();
}


function callBackRenderChapterList(datas){
	$("#count_chapters").html(datas.length);
	initChapterContextMenu()
}
function callBackCreateBookList(datas){
	$("#books_count").html(datas.length);
}
function callBackCreatBookSuccess(datas) {
	$('#creatBookModal').modal('hide');
	getBookList();
}
function callBackCreatVolumeSuccess(datas){
	$("#creatVolumeInput").parent().remove();
    volumeListVue.volumeList.unshift(datas);
    initVolumeContextMenu();
}
//编辑书信息成功后回调
function callBackEditBookSuccess(datas){
	$("#formBookType").val("new");
	$("#formBookName").val("");
	$("#formBookInfo").val("");
	$('#creatBookModal').modal('hide');
	getBookById(datas.bookId);
	/*
	$("#formBookType").val("new");
	$("#formBookName").val("");
	$("#formBookInfo").val("");
	$('#creatBookModal').modal('hide');
	$("#currentBookNameText").text(datas.name);
	*/
}
      

/************* 定时器 ****************/
function timer(){
	self.setInterval("showWords()",200);
	self.setInterval("autoSave()",5000);
}
function showWords(){
  var num = getWords('editor');
  $("#edit-foot").html("字数:"+num);
}
function autoSave(){
	var datas = {};
	datas.bookId = getCurrentBookId();
	datas.name = getCurrentChapterName();
	datas.chapterId = getCurrentChapterId();
	autoSaveContent('editor', datas);
}

function bookListOpen(){
	
	if($("#book-box-list").is(":hidden")){
		$("#book-box-list").show();
		//$("#arrow-list").css({"background":"transparent url(./img/arrow_down_selected.png) no-repeat scroll 0px 0px"});
	}
	else{
		$("#book-box-list").hide();
		//$("#arrow-list").css({"background":"transparent url(./img/arrow_right_selected.png) no-repeat scroll 0px 0px"});
		console.log("hide");
	}

}

//设置高度
function resetHeight(){
	getElement("note-content").style.height = document.body.clientHeight - getElement("note-content").offsetTop+"px";
	getElement("chapter-list").style.height = getElement("note-content").clientHeight - getElement("article-head").clientHeight - getElement("article-foot").clientHeight+"px";
	getElement("volume-list").style.height = getElement("note-content").clientHeight - getElement("volume-head").clientHeight-getElement("volume-foot").clientHeight+"px";
	//getElement("editor").style.height = getElement("note-content").clientHeight - getElement("edit-head").clientHeight - getElement("edit-foot").clientHeight -51 +"px";
	var height = $("#note-content").height()-$("#edit-head").height()-$("#edit-foot").height() -41;
	//alert(height);
	$("#editor").height(height);
}
//设置宽度
function resetWidth(){
	getElement("note-right").style.width = getElement("note-content").clientWidth-getElement("note-left").offsetWidth + "px";
	getElement("note-right-child").style.width = getElement("note-right").clientWidth-getElement("note-left-child").offsetWidth + "px";
	//getElement("editor").style.width = getElement("editer-box").clientWidth - 20 + "px";
	
	var width = $("#editer-box").width();
	$(".edui-container").width(width-10);
	//$(".edui-toolbar").width(width);
	//$(".edui-btn-toolbar").width($("#item").width());
	$("#editor").width(width-12);
	
}
//显示隐藏卷列表
function hide_volume(){
	
	if($("#book-volume-list").is(":hidden")){
		$("#book-volume-list").show();
		$("#arrow-list").css({"background":"transparent url(./img/Btn_New_DropDown.png) no-repeat scroll 0px 0px"});
	}
	else{
		$("#book-volume-list").hide();
		$("#arrow-list").css({"background":"transparent url(./img/arrow_right_black.png) no-repeat scroll 0px 0px"});
		console.log("hide");
	}
}

function initScrollbar(){
	$('#volume-list').perfectScrollbar();
	$('#chapter-list').perfectScrollbar();
	$('#list_info').perfectScrollbar();
	$('#editor').perfectScrollbar();
}
function initBookContextMenu(){
	$('#current-book-name').contextmenu({
		  target:'#book-edit-menu', 
		  before: function(e,context) {
		    // execute code before context menu if shown
		  },//$('#creatBookModal').modal('hide');
		  onItem: function(context,e) {
		    if($(e.target).attr("tabindex") == 1){
		    	$("#formBookType").val("edit");
		    	$("#formBookName").val(currentBookInfo.name);
				$("#formBookInfo").val(currentBookInfo.info);
		    	$('#creatBookModal').modal('show');
		    }
		  }
	})
}
function initVolumeContextMenu(){
	$('.volumeNode').contextmenu({
		  target:'#volume-edit-menu', 
		  before: function(e,context) {
		    // execute code before context menu if shown
		  },
		  onItem: function(context,e) {
		    if($(e.target).attr("tabindex") == 1){
		    	//console.log($(context).attr("data-id"));
		    	editVolume(context);
		    }
		  }
	});
}
function initChapterContextMenu(){
	$('.chapterNode').contextmenu({
		  target:'#chapter-edit-menu', 
		  before: function(e,context) {
		    	//this.closemenu();
		  },
		  onItem: function(context,e) {
		    if($(e.target).attr("tabindex") == 1){
		    	//console.log($(context).attr("data-id"));
		    	editChater(context);
		    }
		  }
	});
}
var editVolumeFlag = false; //是否有未完成的编辑卷动作
function editVolume(context){
	if(editVolumeFlag){
		return;
	}
	editVolumeFlag = true;
	var value = $(context).find("a").text();
	var html = '<i></i><input name="editVolumeInput" id="editVolumeInput" type="text" value="'+value+'">';
	$(context).html(html);
	
	$("#editVolumeInput").blur(function(){
	  //creatVolumeAction();
	});
	$('#editVolumeInput').bind('keypress',function(event){
        if(event.keyCode == "13"){
        	var volumeId = $(context).attr("data-id");
			var name = $("#editVolumeInput").val();
			var data = {};
			data.name = name;
            editVolumeAction(volumeId, data);
        }
    });
}
var editChaterFlag = false; //是否有未完成的编辑章动作
function editChater(context){
	if(editChaterFlag){
		return;
	}
	editChaterFlag = true;
	var value = $(context).find("a").text();
	var html = '<i></i><input name="creatChapterInput" id="creatChapterInput" type="text" value="'+value+'">';
	$(context).html(html);
	
	$("#creatChapterInput").blur(function(){
	  //creatVolumeAction();
	});
	$('#creatChapterInput').bind('keypress',function(event){
        if(event.keyCode == "13"){
        	var chapterId = $(context).attr("data-id");
			var name = $("#creatChapterInput").val();
			var data = {};
			data.name = name;
            editChatperAction(chapterId, data);
        }
    });
}


function callBackEditChatperSuccess(datas){
	//alert("editSuccess");
	var html = '<a href="javascript:void(0)" onClick="changeChapterLable('+datas.$loki+')">'+datas.name+'</a>';
	$("#creatChapterInput").replaceWith(html);
	editChaterFlag = false;
}


function bindDrag(box, left, right, drag) {
    var oBox = getElement(box), oLeft = getElement(left), oRight = getElement(right), oLine = getElement(drag);  
    
    oLine.onmousedown = function(e) {
        var disX = (e || event).clientX;  
        oLine.left = oLine.offsetLeft;  
        document.onmousemove = function(e) {    
            var iT = oLine.left + ((e || event).clientX - disX);  
            var e=e||window.event,tarnameb=e.target||e.srcElement;  
            var maxT = oBox.clientWight - oLine.offsetWidth;  
            
            oLine.style.margin = 0;  
            iT < 0 && (iT = 0);  
            iT > maxT && (iT = maxT);  
            if(iT<100 || iT>oBox.clientWidth/2){
            	return false;
            }
            
            oLine.style.left = oLeft.style.width = iT + "px";  
            oRight.style.width = oBox.clientWidth - iT + "px"; 
            
            if(box == "note-content"){
            	getElement("note-right-child").style.width = getElement("note-content-child").clientWidth - getElement("drag-line-child").offsetLeft+"px";
            }
            //console.log(box+d.getElementById("note-right1").style.width+"-"+d.getElementById("note-content1").clientWidth);
            //var msg =box+'-top.width:'+oLine.style.width+'---oRight.width:'+oRight.style.width+'---oLine.offsetLeft:'+oLine.offsetLeft+'---disX:'+disX+'---tarnameb:'+tarnameb.tagName;  
            
            return false
        };    
        document.onmouseup = function() {  
            document.onmousemove = null;  
            document.onmouseup = null;    
            oLine.releaseCapture && oLine.releaseCapture()  
        };  
        oLine.setCapture && oLine.setCapture();  
        return false  
    };    
}  