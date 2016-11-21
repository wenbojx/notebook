var loki = require('lokijs');
//用户相关
var user = {};
user.hello = function(name) {
    console.log('hello, '+ name);
}

//定义用户数据数据库地址
var userDbPath = global.APP_PATH + '/app/datas/user.db';
//当前书籍相关库
var bookInfoCoName = "bookInfo";

user.editCurrentBook = function(datas) {
	var bookInfo = {};
	
	var db = new loki(userDbPath);
	db.loadDatabase({}, function (result) {
		var coll = db.getCollection(bookInfoCoName);
		
		if(!coll){
			coll = db.addCollection(bookInfoCoName);
			bookInfo.bookId = datas.bookId ? datas.bookId : 0;
			console.log(datas);
			bookInfo.volumeId = datas.volumeId ? datas.volumeId : 0;
			bookInfo.chapterId = datas.chapterId ? datas.chapterId : 0;
			coll.insert(bookInfo);
		}
		else{
			var book = coll.get(1);
			book.bookId = datas.bookId ? datas.bookId : book.bookId;
			book.volumeId = datas.volumeId ? datas.volumeId : book.volumeId;
			book.chapterId = datas.chapterId ? datas.chapterId : book.chapterId;
			coll.update(book);
		}

	    db.save();
		
		console.log("edit currentBook");
	});
}
user.getCurrentBook = function(callBack){
	var db = new loki(userDbPath);
	db.loadDatabase({}, function (result) {
		var coll = db.getCollection(bookInfoCoName);
		if(!coll){
			callBack(false);
			return;
		}
		var book = coll.get(1);
		callBack(book);
		return;
	});
}

exports.user = user;