var fs = require('fs');
var sql = require('sql.js');
var path = require('path');
var common = require(path.join(global.APP_PATH, './main-process/common.js'));
var book = {};

/***************** 书相关 start ***************/


//获取书籍目录
book.getBookDbPath = function (){

	var dataPath = global.APP_PATH + '/datas/' + global.UID;
	var exists = fs.existsSync(dataPath);
	if(!exists){
		try{
			fs.mkdirSync(path);
		} catch (err){}
	}
	return dataPath + '/books.db';
}
var book_db = null;
book.initBookDb = function (){
	if (book_db) {
		return book_db;
	}
	var bookListDBPath = book.getBookDbPath();
	var filebuffer = fs.readFileSync(bookListDBPath);
	// Load the db
	book_db = new SQL.Database(filebuffer);
	return book_db;
}
book.saveDb = function (db){
	var data = db.export();
	var buffer = new Buffer(data);
	var bookListDBPath = book.getBookDbPath();
	fs.writeFileSync(bookListDBPath, buffer);
}
//获取书籍列表
book.getBookList = function (){
	console.log("getBookList");
	var db = book.initBookDb();
	var res = db.exec("SELECT * FROM book WHERE status = 1");

	var datas = common.convertDb(res);
	//console.log(res[0].values);
	return datas;

}
//获取书基本信息
book.getBookInfo = function (bid){
	if (!bid) {return false;}
	console.log("getBookInfo");
	var db = book.initBookDb();
	var res = db.exec("SELECT * FROM book WHERE id = "+bid+" limit 1");
	var datas = common.convertDb(res);
	return datas[0];
}
//获取章节
book.getChapterList = function (bid){
	if (!bid) {return false;}
	console.log("getChapterList");
	var db = book.initBookDb();
	var res = db.exec("SELECT * FROM chapter WHERE bid = "+bid+" order by id asc");
	var datas = common.convertDb(res);
	return datas;
}
book.getChapterContent = function (cid){
	console.log("getChapterContent"+cid);
	if (!cid) {
		return false;
	}
	var db = book.initBookDb();
	var res = db.exec("SELECT * FROM content WHERE cid = "+cid+" limit 1");
	var datas = common.convertDb(res);
	return datas[0];
}
book.saveChapterContent = function(datas){
	console.log("saveChapterContent");
	if (datas == null || datas.cid == null){
		return false;
	}
	var db = book.initBookDb();
	var chapter = book.getChapterContent(datas.cid);
	var sql = "";
	if (!chapter) {
		sql = "INSERT INTO content VALUES(null, "+ datas.cid +", "+datas.content+")";
		var res = db.run(sql);
	}
	console.log(sql);
	sql = "UPDATE chapter SET title = '"+datas.title+"', countword = '"+datas.countWord+"' limit 1";
	var res = db.run(sql);
	console.log(res);
	book.saveDb(db);
}


module.exports = book;


