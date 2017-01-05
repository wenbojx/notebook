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
var db = null;
book.initBookDb = function (){
	if (db) {
		return db;
	}
	var bookListDBPath = book.getBookDbPath();
	var filebuffer = fs.readFileSync(bookListDBPath);
	// Load the db
	db = new SQL.Database(filebuffer);
	return db;
}
book.saveDb = function (){
	var data = db.export();
	var buffer = new Buffer(data);
	var bookListDBPath = book.getBookDbPath();
	fs.writeFileSync(bookListDBPath, buffer);
}
//获取书籍列表
book.getBookList = function (){
	common.log("getBookList");
	book.initBookDb();
	var res = db.exec("SELECT * FROM book WHERE status = 1");

	var datas = common.convertDb(res);
	//console.log(res[0].values);
	return datas;

}
//获取书基本信息
book.getBookInfo = function (bid){
	if (!bid) {return false;}
	common.log("getBookInfo");
	book.initBookDb();
	var res = db.exec("SELECT * FROM book WHERE id = "+bid+" limit 1");
	var datas = common.convertDb(res);
	return datas[0];
}
//获取正常章节
book.getChapterList = function (bid){
	common.log("getChapterList"+bid);
	if (!bid) {return false;}
	book.initBookDb();
	var sql = "SELECT * FROM chapter WHERE bid = "+bid+" AND status=1 order by id asc";
	//console.log(sql);
	var res = db.exec(sql);
	var datas = common.convertDb(res);
	//console.log(datas);
	return datas;
}
book.getChapterContent = function (cid){
	common.log("getChapterContent"+cid);
	if (!cid) {
		return false;
	}
	book.initBookDb();
	var res = db.exec("SELECT * FROM content WHERE cid = "+cid+" limit 1");
	var datas = common.convertDb(res);
	return datas[0];
}
//获取单章信息
book.getChapterInfo = function (id){
	book.initBookDb();
	var res = db.exec("SELECT * FROM chapter WHERE id="+id+" limit 1");
	var datas = common.convertDb(res);
	common.log(datas[0]);
	return datas[0];
}
//获取insert后的id
book.getChapterLastId = function(){
	book.initBookDb();
	var res = db.exec("SELECT * FROM chapter order by id desc limit 1");
	var datas = common.convertDb(res);
	//common.log(datas[0]);
	return datas[0]['id'];
}
//saveflag = true 保存
book.updatChapter = function(cid, datas, saveflag){
	book.initBookDb();
	common.log('updatChapter');
	if(!cid || datas==""){
		return false;
	}
	var sql = "UPDATE chapter SET ";
	for (var k in datas) {
		var n = Number(datas[k]);
		if (!isNaN(n))
		{
		    sql += k+"="+datas[k]+",";
		}
		else{
			sql += k+"='"+datas[k]+"',";
		}
	}

	sql = sql.substring(0, sql.length-1);
	sql += " where id="+cid;
	common.log(sql);
	var res = db.run(sql);
	if (!res) {
		return false;
	}
	if (saveflag) {
		book.saveDb();
	}
	return true;
}
//删除章节
book.deleteChapter = function(id){
	common.log("deleteChapter");
	if(!id){
		return;
	}
	var data = {}
	data.status = 2;
	book.updatChapter(id, data, true);
	//更新前后章节的排序
	var chapterInfo = book.getChapterInfo(id);
	if (chapterInfo['pre'] != 0) {
		var preData = {}
		preData.next = chapterInfo['next'];
		book.updatChapter(chapterInfo['pre'], preData, true);
	}
	if (chapterInfo['next'] != 0) {
		var nextData = {}
		nextData.pre = chapterInfo['pre'];
		book.updatChapter(chapterInfo['next'], nextData, true);
	}
}

book.saveChapterContent = function(datas){
	common.log("saveChapterContent");
	if (datas == null || datas.cid == null || datas.cid==''){
		return false;
	}
	book.initBookDb();
	var chapter = book.getChapterContent(datas.cid);
	var sql = "";
	var res = "";
	if (!chapter) {
		sql = "INSERT INTO content VALUES(null, "+ datas.cid +", '"+datas.content+"')";
	}
	else{
		sql = "UPDATE content SET content = '"+datas.content+"' where cid="+datas.cid;
	}
	common.log(sql);
	res = db.run(sql);
	if (!res) {
		return false;
	}
	var chapterData = {};
	chapterData.title = datas.title;
	chapterData.countword = datas.countword;
	var flag = book.updatChapter(datas.cid, chapterData, false);
	if (!flag) {
		return false;
	}
	book.saveDb();
	return true;
}

book.creatVolume = function (datas){
	common.log("creatVolume");
	book.initBookDb();
	//common.log(datas);
	datas.fid = 0;
	datas.countword = 0;
	datas.intro = '';
	var id = book.creatChapterAction(datas);
	//common.log(id);
	var next = {};
	next.next = id;
	if (datas.pre !=0 ) {
		book.updatChapter(datas.pre, next, false);
	}
	var pre = {};
	pre.pre = id;
	if (datas.next !=0 ) {
		book.updatChapter(datas.next, pre, false);
	}
	book.saveDb();
	return id;
}
book.creatChapter = function (datas){
	common.log("creatChapter");
	common.log(datas);
	book.initBookDb();
	datas.countword = 0;
	datas.intro = '';

	var id = book.creatChapterAction(datas);
	//common.log(id);
	var next = {};
	next.next = id;
	if (datas.pre !=0 ) {
		book.updatChapter(datas.pre, next, false);
	}
	var pre = {};
	pre.pre = id;
	if (datas.next !=0 ) {
		book.updatChapter(datas.next, pre, false);
	}
	book.saveDb();
	return id;
}
book.creatChapterAction = function (datas){
	if (!datas.bid || !datas.title) {
		return false;
	}
	var data = {};
	common.log(datas);
	data.bid = datas.bid;
	data.bookid = datas.bookid;
	data.type = datas.type;
	data.fid = datas.fid;
	data.title = datas.title;
	data.intro = datas.intro;
	data.countword = datas.countword;
	data.createtime = Date.now();
	data.updatetime = data.createtime;
	data.status = 1;
	data.pre = datas.pre;
	data.next = datas.next;
	
	var sql = "INSERT INTO chapter ";
	sql += "('id', 'bid', 'bookid', 'type', 'fid', 'title', 'intro', 'countword', 'createtime', 'updatetime', 'status', 'pre', 'next')";
	sql += " VALUES (null, "+data.bid+", "+data.bookid+", "+data.type+", '"+data.fid+"', ";
	sql += "'"+data.title+"', '"+data.intro+"', "+data.countword+", "+data.createtime+", ";
	sql += data.updatetime+", "+data.status+","+data.pre+", "+data.next+")";
	common.log(sql);
	res = db.run(sql);
	if (!res) {
		return false;
	}
	var lastId = book.getChapterLastId();
	
	return lastId;
}


module.exports = book;


