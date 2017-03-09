<?php

namespace app\models\login;

use Yii;
use app\models\Ydao;

/**
 * LoginForm is the model behind the login form.
 *
 * @property User|null $user This property is read-only.
 *
 */
class Login extends Ydao
{

	public function __construct() 
	{ 

	} 
	/**
	* 创建登录所需session
	*/
	public function loginSession($uid, $nickname, $figureurl){
		$session = Yii::$app->session;
		$session->set('uid', $uid);
		$session->set('nickname', $nickname);
		$session->set('figureurl', $figureurl);
	}

}
