var currentDatas = null;

ipcRenderer.on('creatVolumeSuccess', function(event, datas) {
	callBackCreatVolumeSuccess()
	$("#creatVolumeInput").parent().remove();
    volumeListVue.volumeList.unshift(datas);
    creatVolumeFlag = false;
    setEditorContent("");
});
//获取指定书
function getBookById(bookId){
	ipcRenderer.send('getBookById', bookId);
}
//获取指定书成功 回调
ipcRenderer.on('getBookByBidSuccess', function(event, datas) {
      callBackGetBookByBidSuccess();
});

//当前编辑数据
ipcRenderer.on('currentBookInfo', function(event, datas) {
      currentDatas = datas;
});
//渲染书
ipcRenderer.on('renderBookInfo', function(event, datas) {
      renderBookInfo(datas);
});
var bookInfoVue = null;
function renderBookInfo(datas){
	if(!bookInfoVue){
		bookInfoVue = new Vue({
		  el: '#current-book-name',
		  data: {
		    bookName: datas.name,
		    bookId:datas.bookId
		  }
		})
	}
	else{
		bookInfoVue.bookName = datas.name;
		bookInfoVue.bookId = datas.$loki;
	}
	callBackRenderBookInfo(datas);
}
//渲染卷列表
var volumeListVue = null;
ipcRenderer.on('renderVolumeList', function(event, datas) {
      renderVolumeList(datas);
});
function renderVolumeList(datas){
	if(datas.length < 1){
		return;
	}
	//console.log(datas);
	if(!volumeListVue){
		volumeListVue = new Vue({
		  el: '#book-volume-list',
		  data: {
		    volumeList: datas,
		    currentvolumeId:currentDatas.volumeId
		  }
		})
	}
	else{
		volumeListVue.volumeList = datas;
	}
	callBackRenderVolumeList(datas);
}

//渲染章列表
ipcRenderer.on('renderChapterList', function(event, message) {
      renderChapterList(message);
});
var chapterListVue = null;
var chapterListVueFlag = true;

function renderChapterList(datas){
	if(datas.length < 0){
		return;
	}
	//console.log(datas);
	if(chapterListVueFlag){
		chapterListVue = new Vue({
		  el: '#chapter-list',
		  data: {
		    chapterList: datas,
		    currentChapterId: currentDatas.chapterId
		  }
		})
		chapterListVueFlag = false;
	}
	else {
		chapterListVue.chapterList = datas;
	}
	//回调处理函数
	callBackRenderChapterList(datas);
}

//渲染章内容
ipcRenderer.on('renderChapterContent', function(event, message) {
      renderChapterContent(message);
});
var chapterInfoVue = null;
var ChapterDatas = null;
function renderChapterContent(datas){
	//alert(datas.name+"abc");
	if(!datas.content){
		datas.content = "";
	}
	if(!chapterInfoVue){
		chapterInfoVue = new Vue({
		  el: '#edit-head',
		  data: {
		    title: datas.name
		  }
		})
		setEditorContent(datas.content);
		
	}
	else {
		//chapterContentVue.content = datas.content;
		setEditorContent(datas.content);
		chapterInfoVue.title = datas.name;
	}
	ChapterDatas = datas;
	//alert(datas.content);
}


ipcRenderer.on('getBookList', function(event, datas) {
      renderBookList(datas);
});
//渲染书库
var bookListVue = null;
function renderBookList(datas){
	if(datas.length < 1){
		return;
	}
	for(var i=0; i<datas.length; i++){
		if(datas[i].status == 1){
			ipcRenderer.send('renderBook', datas[i]);
		}
	}
	if(!bookListVue){
		bookListVue = new Vue({
		  el: '#book-box-list',
		  data: {
		    boxList: datas
		  }
		})
	}
	else {
		bookListVue.boxList = datas;
	}
	//回调处理函数
	callBackCreateBookList(datas);
}


function creatBook(){
	var bookName = $("#formBookName").val();
	var bookInfo = $("#formBookInfo").val();
	var type = $("#formBookType").val();
	if(bookName == ""){
		$("#formBookNameBox").addClass("has-error");
		return;
	}
	var book = {};
	book.name = bookName;
	book.info = bookInfo;
	
	if(type == "new"){
		ipcRenderer.send('creatBook', book);
	}
	if (type == "edit") {
		book.bookId = currentBookInfo.bookId;
		ipcRenderer.send('editBook', book);
	}	
}
ipcRenderer.on('creatBookSuccess', function(event, datas) {
      getBookById(datas.bookId);
      callBackCreatBookSuccess(datas);
      
});
ipcRenderer.on('editBookSuccess', function(event, datas) {
    callBackEditBookSuccess(datas);
});



//获取当前书ID
function getCurrentBookId(){
	return $("#current-book-name").attr("data-id");
}
//获取当前卷ID
function getCurrentVolumeId(){
	return $("#book-volume-list").find(".selected").attr("data-id");
}
//获取当前章ID
function getCurrentChapterId(){
	return $("#book-chapter-list").find(".selected").attr("data-id");
}
//获取当前章节名
function getCurrentChapterName(){
	var name = $("#book-chapter-list").find(".selected").find("a").text();
	return name;
}
/*********** 创建卷相关  start ****************/
//点击卷
function changeVolumeLable(volumeId){
	//alert(id);
	var bookId = getCurrentBookId();
	var datas = {};
	datas.bookId = bookId;
	datas.volumeId = volumeId;
	ipcRenderer.send('getChapterList', datas);
	volumeListVue.currentvolumeId = volumeId;
	//alert(bookId);
	//如果有正在添加的章节文本框
	if(creatChapterFlag){
		$("#creatChapterInput").parent().remove();
		creatChapterFlag = false;
	}
}
//点击章
function changeChapterLable(chapterId){
	var datas = {};
	datas.bookId = getCurrentBookId();
	datas.volumeId = getCurrentVolumeId();
	datas.chapterId = chapterId;
	chapterListVue.currentChapterId = chapterId;
	ipcRenderer.send('getChapterContent', datas);
}

var creatVolumeFlag = false;  //是否有未完成的添加卷动作
//创建卷
function creatVolume(){
	if(creatVolumeFlag){
		return;
	}
	creatVolumeFlag = true;
	var html = '<li class="selected"><i></i><input name="creatVolumeInput" id="creatVolumeInput" type="text" value="默认卷"></li>';
	$("#book-volume-list").prepend(html);
	$("#creatVolumeInput").blur(function(){
	  //creatVolumeAction();
	});
	$('#creatVolumeInput').bind('keypress',function(event){
        if(event.keyCode == "13"){
            creatVolumeAction();
        }
    });
}

function creatVolumeAction(){
	var volume = {};
	volume.bookId = getCurrentBookId();
	volume.name = $("#creatVolumeInput").val();
	ipcRenderer.send('creatVolume', volume);
	
}
//编辑卷
function editVolumeAction(volumeId, data){
	if(!volumeId){
		return false;
	}
	data.bookId = getCurrentBookId();
	data.volumeId = volumeId;
	ipcRenderer.send('editVolume', data);
}
//编辑卷成功
ipcRenderer.on('editVolumeSuccess', function(event, datas) {
    callBackEditVolumeSuccess(datas);
    //ipcRenderer.send('getVolumeList', datas.bookId);
});


/*********** 创建卷相关  end ****************/

/*********** 创建章相关  start ****************/
ipcRenderer.on('creatChapterSuccess', function(event, message) {
	//alert(message.name);
	$("#creatChapterInput").parent().remove();
    //$("#creatChapterInput").replaceWith('<a href="#">'+ message.name +'</a>');
    chapterListVue.chapterList.unshift(message);
    creatChapterFlag = false;
    setEditorContent("");
});

var creatChapterFlag = false;  //是否有未完成的添加卷动作
function creatChapter(){
	if(creatChapterFlag){
		return;
	}
	creatChapterFlag = true;
	var html = '<li class="selected"><i></i><input name="creatChapterInput" id="creatChapterInput" type="text" value="默认章"></li>';
	$("#book-chapter-list").prepend(html);
	$("#creatChapterInput").blur(function(){
	  //creatVolumeAction();
	});
	$('#creatChapterInput').bind('keypress',function(event){
        if(event.keyCode == "13"){
            creatChapterAction();
        }
    });
}
function creatChapterAction(){
	var datas = {};
	datas.bookId = getCurrentBookId();
	datas.name = $("#creatChapterInput").val();
	datas.volumeId = getCurrentVolumeId();
	ipcRenderer.send('creatChapter', datas);
	//chapterContentVue.content = "";
}
function editChatperAction(chapterId, data){
	if(!chapterId){
		return false;
	}
	data.bookId = getCurrentBookId();
	data.chapterId = chapterId;
	ipcRenderer.send('editChapter', data);
}
//编辑卷成功
ipcRenderer.on('editChapterSuccess', function(event, datas) {
    callBackEditChatperSuccess(datas);
    //ipcRenderer.send('getVolumeList', datas.bookId);
});

function saveChapterContent(editor, data){
	var datas = {};
	datas.content = data.content;
	datas.bookId = data.bookId;
	datas.name = data.name;
	datas.countWord = datas.countWord;
	datas.chapterId = data.chapterId;
	//alert(datas.content);
	ipcRenderer.send('saveChapterContent', datas);
}

/*********** 创建章相关  end ****************/


