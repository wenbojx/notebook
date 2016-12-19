const electron = require('electron')
var crypto = require('crypto');
var common = {};
/*
common.getCookie = function(){
	var filter = {
		  	domain: 'www.yiluhao.com',
		 	name:'localtoken'
		}
		electron.session.defaultSession.cookies.get(filter, (error, cookies) => {
			console.log(cookies);
			global.UID = '';
		})
}
common.getUid = function (){
	common.getCookie();
}
*/

//验证登录
common.checkLogin = function (loginSucess, loginFail){
	var filter = {
	  	domain: 'www.yiluhao.com',
	 	name:'localtoken'
	}
	electron.session.defaultSession.cookies.get(filter, (error, cookies) => {
	  if (!error) {
	  	 if(typeof(cookies[0]) == "undefined"){
	  	 	loginFail();
	  	 	return;
	  	 }
	  	var value = new Buffer(cookies[0].value, 'base64').toString();
	  	if (!value) {
	  		console.log("error");
	  		loginFail();
	  		return;
	  	}
	  	var dataString = value.substring(32);
	  	//console.log(dataString);
	 	var content = dataString + global.ENCRYPTPREFIXLOCAL;
	  	var md5 = crypto.createHash('md5');
	  	md5.update(content);
		var code = md5.digest('hex');
	  	var validate = value.substring(0,32);
	  	var time = Date.parse(new Date())/1000;
	  	var userDatas = JSON.parse(dataString);
	  	//验证时间，看是否过期
	  	if (code != validate || userDatas.time<time) {
	  		//验证失败，重新登录
	  		console.log("error");
	  		loginFail();
	  		return;
	  	}
	  	global.UID = userDatas.uid;
	  	loginSucess();
	  	//console.log(global.UID);
	  }
	  
	})
}
module.exports = common;