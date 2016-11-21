var fs = require('fs');
var loki = require('lokijs');
var userJs = require(global.APP_PATH + "/app/js/user/user.js");

var book = {};
book.hello = function(name) {
    console.log('hello, '+ name);
}

var dataPath = global.APP_PATH + '/app/datas/';
/***************** 书相关 start ***************/
//bookDB地址
var bookListDBPath = dataPath + 'bookList.db';
//书列表库名
var bookListCoName = 'bookList';
//书详细库名
var bookInfoCoName = 'bookInfo';
//书卷库名
var bookVolumeCoName = 'bookVolume';
//书章节库名
var bookChapterCoName = 'bookChapter';
//书内容库名
var bookChapterContentCoName = 'bookChapterContent';


//获取书籍目录
book.getBookDbDirPath = function (bookId){
	var folder = 'book_' + bookId + "/";
	
	var path = dataPath+folder;
	var exists = fs.existsSync(path);
	if(!exists){
		try{
			fs.mkdirSync(path);
		} catch (err){}
	}
	return path;
}
//获取书籍数据文件地址
book.getBookDbPath = function (bookId){
	var path = book.getBookDbDirPath(bookId);
	var fileName = 'book.db';
	return path+fileName;
}
//获取章节内容文件地址
book.getChapterDbPath = function (bookId, chapterId){
	var path = book.getBookDbDirPath(bookId);
	var fileName = 'chapter_' + chapterId + '.db';
	return path+fileName;
}


//创建书籍
book.creatBook = function(event, datas, callBack){
	var bookDatas = {};
	
	bookDatas.name = datas.name;
	//bookDatas.info = datas.info;
	bookDatas.status = 1; //1正常状态， 2回收站，3删除
	bookDatas.countVolume = 1;
	bookDatas.countChapter = 1;
	bookDatas.countWord = 0;
	bookDatas.creatTime = new Date().getTime();
	bookDatas.updateTime = new Date().getTime();
	var db = new loki(bookListDBPath);
	db.loadDatabase({}, function (result) {
		var coll = db.getCollection(bookListCoName);
		if(!coll){
			coll = db.addCollection(bookListCoName);
		}
	    var inObj = coll.insert(bookDatas);
		db.save();
		//callBack(inObj.$loki);
		console.log("create book");
		bookDatas.bookId = inObj.$loki;
		bookDatas.info = datas.info;
		//创建默认的卷章
		book.creatBookDefaultDb(bookDatas, callBack);
		//console.log(bookDatas);
	});
}
//修改书
/**
 * @param 
 * 	datas.bookId 
 * 	datas.name
	datas.info
	datas.status
	datas.countVolume
	datas.countChapter 
	datas.countWord
 */
book.editBook = function(event, datas, callBack){
	//console.log(datas);
	if (!datas.bookId) {
		if(callBack){
	    	callBack(-1);
	    }
		return;
	}
	var db = new loki(bookListDBPath);
	db.loadDatabase({}, function () {
	    var coll = db.getCollection(bookListCoName);
	    var datasColl = null;
	    datasColl = coll.get(datas.bookId);
	    //console.log(datasColl);
		datasColl.name = datas.name?datas.name:datasColl.name;
		datasColl.status = datas.status?datas.status:datasColl.status;
		datasColl.countVolume = datas.countVolume?datas.countVolume:datasColl.countVolume;
		datasColl.countChapter = datas.countChapter?datas.countChapter:datasColl.countChapter;
		datasColl.countWord = datas.countWord?datas.countWord:datasColl.countWord;
	    datasColl.updateTime = new Date().getTime();
    	datasColl = coll.update(datasColl);
	    db.save();
	    db.close();
      	console.log("editBook-list");
      	
      	db = initDB(datas.bookId);
      	
		db.loadDatabase({}, function (result) {
	    	coll = db.getCollection(bookInfoCoName);
		    var datasColl = coll.get(1);
		    
		    datasColl.name = datas.name?datas.name:datasColl.name;
		    datasColl.info = datas.info?datas.info:datasColl.info;
		    datasColl.status = datas.status?datas.status:datasColl.status;
		    
	    	datasColl = coll.update(datasColl);
		    db.save();
			db.close();
			console.log("editBookName-book");
			if(callBack){
		    	callBack(datas);
		    }
		});
    });

	
}

//var db = null;
//初始化书籍详细
function initDB(bookId){
	var dbPath = book.getBookDbPath(bookId);
	var db = new loki(dbPath);
	return db;
}
//初始化章节内容DB
function initChapterDB(bookId, chapterId){
	var dbPath = book.getChapterDbPath(bookId, chapterId);
	var db = new loki(dbPath);
	return db;
}

//创建默认书相关详细数据库
book.creatBookDefaultDb = function (datas, callBack){
	var bookInfo = {};
	bookInfo.name = datas.name;
	bookInfo.info = datas.info;
	bookInfo.creatTime = datas.creatTime;
	bookInfo.countVolume = 1;
	bookInfo.countChar = 0;
	bookInfo.bookId = datas.bookId;
	bookInfo.status = 1; //1正常状态， 2回收站，3删除
	book.creatBookInfo(bookInfo, creatVolumeCallBack);
	function creatVolumeCallBack(bookId){
		var volume = {};
		volume.bookId = datas.bookId;
		volume.name = '默认卷';
		//volume.info = '写点简介吧';
		volume.status = 1; //1正常状态， 2回收站，3删除
		volume.creatTime = new Date().getTime();
		book.creatVolume(null, volume, creatChapterCallBack);
	}

	function creatChapterCallBack(datas){
		var chapter = {};
		chapter.bookId = datas.bookId;
		chapter.volumeId = datas.$loki;
		chapter.name = '默认章';
		chapter.status = 1; //1当前编辑状态， 2正常状态， 3回收站，4删除
		chapter.creatTime = new Date().getTime();
		//console.log(chapter);
		book.creatChapter(null, chapter, success);
		
	}
	function success(){
		console.log("creat book default success");
		callBack(datas);
	}
	
}
//创建书基本信息
book.creatBookInfo = function (datas, callBack){
	if(!datas.bookId || !datas.name){
		return false;
	}
	var db = initDB(datas.bookId);
	db.loadDatabase({}, function (result) {
    	coll = db.getCollection(bookInfoCoName);
	    if(!coll){
			coll = db.addCollection(bookInfoCoName);
		}
    	
    	var inObj = coll.insert(datas);
		db.save();
		userJs.user.editCurrentBook({'bookId':datas.bookId});
		console.log("add book info");
		callBack(inObj.$loki);
		db.close();
	});
}
//创建卷
/**
 * volume.name = datas.name;
	volume.bookId = datas.bookId;
	volume.countChapter = 1;
	volume.countWords = 0;
	volume.status = 1; //1正常状态， 2回收站，3删除
	volume.createTime = new Date().getTime();
	volume.updateTime= new Date().getTime();
 */
book.creatVolume = function (event, datas, callback){
	if(!datas.bookId || !datas.name){
		return false;
	}
	
	var db = initDB(datas.bookId);
	db.loadDatabase({}, function (result) {
		var coll = db.getCollection(bookVolumeCoName);
	    if(!coll){
			coll = db.addCollection(bookVolumeCoName);
		}
	    var inObj = coll.insert(datas);
		db.save();
		console.log("add book volume");
		userJs.user.editCurrentBook({'volumeId':inObj.$loki});
		callback(inObj);
		db.close();
	});
}

//修改卷
/**
 * 	datas.bookId
 * 	datas.volumeId
 * 	datas.name
	datas.countChapter
	datas.countWords
	datas.status
	datas.createTime
	datas.updateTime
 */
book.editVolume = function(event, datas, callBack){
	if (!datas.bookId || !datas.volumeId) {
		if(callBack){
	    	callBack(-1);
	    }
		return;
	}
	var db = initDB(datas.bookId);
	db.loadDatabase({}, function () {
	    var coll = db.getCollection(bookVolumeCoName);
	    
	    var datasColl = coll.get(datas.volumeId);
	    datasColl.updateTime = new Date().getTime();
	    datasColl.name = datas.name?datas.name:datasColl.name;
		datasColl.countChapter = datas.countChapter?datas.countChapter:datasColl.countChapter;
		datasColl.countWords = datas.countWords?datas.countWords:datasColl.countWords;
		datasColl.status = datas.status?datas.status:datasColl.status;
    	datasColl = coll.update(datasColl);
	    db.save();
	    db.close();
      	console.log("editVolume-list");
      	if(callBack){
	    	callBack(datasColl);
	    }
   });
}

//创建章节
/**
 * 	datas.bookId 
	datas.volumeId
	datas.name
	datas.status = 1; //1当前编辑状态， 2正常状态， 3回收站，4删除
	datas.creatTime
	datas.updateTime
 */
book.creatChapter = function (event, datas, callback){
	if(!datas.bookId || !datas.name || !datas.volumeId){
		return false;
	}
	var db = initDB(datas.bookId);
	
	db.loadDatabase({}, function (result) {
		var coll = db.getCollection(bookChapterCoName);
    	if(!coll){
			coll = db.addCollection(bookChapterCoName);
		}
    	//console.log(datas);
    	var inObj = coll.insert(datas);
		db.save();
		console.log("add book chapter");
		userJs.user.editCurrentBook({'chapterId':inObj.$loki});
		callback(inObj);
		db.close();
	});
}
//修改章
/**
 *  datas.bookId 
	datas.chapterId
	datas.name
	datas.status = 1; //1当前编辑状态， 2正常状态， 3回收站，4删除
	datas.creatTime
	datas.updateTime
 */
book.editChapter = function(event, datas, callBack){
	if (!datas.bookId || !datas.chapterId) {
		if(callBack){
	    	callBack(-1);
	    }
		return;
	}
	var db = initDB(datas.bookId);
	db.loadDatabase({}, function () {
	    var coll = db.getCollection(bookChapterCoName);
	    var datasColl = coll.get(datas.chapterId);
	    
	    datasColl.updateTime = new Date().getTime();
	    datasColl.name = datas.name?datas.name:datasColl.name;
		datasColl.status = datas.status?datas.status:datasColl.status;
    	datasColl = coll.update(datasColl);
	    db.save();
	    db.close();
      	console.log("editChapter-list");
      	if(callBack){
		 	callBack(datasColl);
		}
   });
   var data = {};
   data.name = datas.name;
   data.bookId = datas.bookId;
   data.chapterId = datas.chapterId;
   book.saveChapterContent(null, data, null);
   
}


//保存章节内容
/**
 * datas.bookId
	datas.chapterId
	datas.name
	datas.content
	datas.countWord
 */
book.saveChapterContent = function (event, datas, callBack){
	//console.log(datas.bookId);
	if(!datas.bookId || !datas.chapterId){
		callBack(false);
		return;
	}
	var db = initChapterDB(datas.bookId, datas.chapterId);
	//console.log(db);
	db.loadDatabase({}, function () {
	    var coll = db.getCollection(bookChapterContentCoName);
	    var datasColl = null;
	    //console.log(coll);
	    if(!coll){
			coll = db.addCollection(bookChapterContentCoName);
			datas.createTime = new Date().getTime();
			datas.updateTime = new Date().getTime();
			datasColl = coll.insert(datas);
			
		}
	    else{
	    	datasColl = coll.get(1);
	    	datasColl.updateTime = new Date().getTime();
	    	datasColl.content = datas.content?datas.content:datasColl.content;
	    	datasColl.name = datas.name?datas.name:datasColl.name;
	    	datasColl.countWord = datas.countWord?datas.countWord:datasColl.countWord;

    		datasColl = coll.update(datasColl);
    	}
	    //console.log(datasColl);
	    db.save();
	    if (callBack) {
	    	callBack(datasColl);
	    }
      	console.log("saveChapterContent");
      	db.close();
    });
}

//获取书籍列表
book.getBookList = function (callBack){
	console.log("getBookList");
	var db = new loki(bookListDBPath);
	db.loadDatabase({}, function (result) {
	    var coll = db.getCollection(bookListCoName);
	    if(!coll){
	    	return;
	    }
	    var bookList = coll.find({
	    	'status' : { '$in' : [1] }
	    });
    	//console.log(bookList);
    	callBack(bookList);
    	
	});
}
//获取书基本信息
book.getBookBaseInfo = function (bookId, callBack){
	var db = initDB(bookId);
    db.loadDatabase({}, function () {
      var coll = db.getCollection(bookInfoCoName);
      if(!coll){
      	callBack(false);
      	return;
      }
	  var bookInfo = coll.get(1);
      callBack(bookInfo);
      db.close();
    });
}

//获取卷列表信息
book.getVolumeList = function (bookId, callBack){
	var db = initDB(bookId);
	db.loadDatabase({}, function () {
	    var coll = db.getCollection(bookVolumeCoName);
	    //console.log(coll);
	    if(!coll){
	    	callBack(false);
	      	return;
	    }
	    var where = {'status' : { '$in' : [1] }};
   		var datas = coll.chain().find(where).simplesort('$loki', 'desc').data();
   		//console.log(where);
      	callBack(datas);
      	db.close();
    });
}

//获取章节列表信息
book.getChapterList = function (bookId, volumeId, callBack){
	var db = initDB(bookId);
	db.loadDatabase({}, function () {
	    var coll = db.getCollection(bookChapterCoName);
	    //console.log(coll);
	    if(!coll){
	    	callBack(false);
	      	return;
	    }
    	var where = {'$and':[{'status' : 1}, {'volumeId':volumeId}]};
   		var datas = coll.chain().find(where).simplesort('$loki', 'desc').data();
   		//console.log(where);
      	callBack(datas);
      	db.close();
    });
}
//获取章节内容
book.getChapterContent = function (bookId, chapterId, callBack){
	var db = initChapterDB(bookId, chapterId);
	db.loadDatabase({}, function () {
	    var coll = db.getCollection(bookChapterContentCoName);
	    var datas = null;
	    if(!coll){
			callBack({});
			return;
		}
	    else{
    		datas = coll.get(1);
    	}
      	callBack(datas);
      	db.close();
    });
}
exports.book = book;


