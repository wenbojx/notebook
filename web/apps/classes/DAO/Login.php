<?php
namespace App\DAO;

class Login
{
    /**
	* 创建登录所需session
	*/
	public function loginSession($uid, $nickname, $figureurl){
		$_SESSION['uid'] = $uid;
		//$_SESSION['nickname'] = $nickname;
		//$_SESSION['figureurl'] = $figureurl;
	}
}


