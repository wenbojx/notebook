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
		Yii::$app->session->set('uid', $uid);
		Yii::$app->session->set('nickname', $nickname);
		Yii::$app->session->set('figureurl', $figureurl);
	}

}
