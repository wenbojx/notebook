//const ipcRenderer = require('electron').ipcRenderer;
function getElement(element){
	return document.getElementById(element);
}

//最小化
function miniWindow(){
	ipcRenderer.send('miniWindow', null);
}

function closeWindow(){
	ipcRenderer.send('closeWindow', null);
}
function restoreWindow(){
	ipcRenderer.send('restoreWindow', null);
}

//切换到圈子
function goToQuanzi(){
	ipcRenderer.send('goToQuanzi', null);
}
//切换到圈子
function goToXiezuo(){
	ipcRenderer.send('goToXiezuo', null);
}

/************** 全屏模式 start ********************/
function fullScreen(){
	var datas = {};
	datas.chapterId = getCurrentChapterId();
	datas.bookId = getCurrentBookId();
	ipcRenderer.send('fullScreen', datas);
	//重置内容绑定
	chapterContentVue = null;
	chapterInfoVue = null;
}
function exitFullScreen(){
	ipcRenderer.send('exitFullScreen', true);
}
/************** 全屏模式 end ********************/

function toPinyin(inString){
	var pinyin = require("pinyin");
	inString = pinyin(inString, {style: pinyin.STYLE_NORMAL});
	var reString = "";
	for(var i=0; i<inString.length; i++){
		for(var j=0; j<inString[i].length; j++){
			reString += inString[i][j];
		}
	}
	return reString;
}


function initEditor(editor){
	var um = UM.getEditor(editor,{
            //这里可以选择自己需要的工具按钮名称,此处仅选择如下七个
            toolbar:[
            	'undo redo removeformat | bold italic underline strikethrough | forecolor backcolor |',
            'insertorderedlist insertunorderedlist | fontfamily fontsize' ,
            '| justifyleft justifycenter justifyright justifyjustify'
            ],
            //focus时自动清空初始化时的内容
            autoClearinitialContent:true,
            //关闭字数统计
            //wordCount:true,
            //关闭elementPath
            elementPathEnabled:false,
            //默认的编辑区域高度
            initialFrameHeight:300
            //更多其他参数，请参考umeditor.config.js中的配置项
       });
}
function setEditorContent(content){
	UM.getEditor('editor').setContent(content);
}
//计算字数
function getWords(editor){
	var content = UM.getEditor(editor).getContentTxt();
	//content = content.replace(" ", "");
	content = content.replace(/^\s+/, '').replace(/\s+$/, '');
	content = content.replace("\t", "");
	content = content.replace("\r", "");
	content = content.replace("\n", "");
	return content.length;
}

//3秒保存一次内容
var lastContent = null;
function autoSaveContent(editor, datas){
	var content = UM.getEditor(editor).getContent();
  if (content != lastContent) {
  	datas.content = content;
  	datas.name = getCurrentChapterName();
  	datas.countWord = getWords(editor);
  	saveChapterContent(editor, datas);
  	lastContent = content;
  }
}
