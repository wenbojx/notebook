<?php

namespace app\components\login;

use Yii;
use yii\base\Component;
use yii\base\InvalidConfigException;

/**
* 
*/
class QqSdk extends Component
{
		//配置APP参数
	private $app_id = 101358269;
	private $app_secret = 'bd348353aaa0065c5edd23ae52eed30b';
	private $redirect = 'http://www.yiluhao.com/loginqq';

	function __construct() 
	{ 

	} 

	/**
	* [get_access_token 获取access_token]
	* @param [string] $code [登陆后返回的$_GET['code']]
	* @return [array] [expires_in 为有效时间 , access_token 为授权码 ; 失败返回 error , error_description ]
	*/ 

	function get_access_token($code) 
	{ 
		//获取access_token
		$token_url = "https://graph.qq.com/oauth2.0/token?grant_type=authorization_code&client_id={$this->app_id}&redirect_uri=".urlencode($this->redirect)."&client_secret={$this->app_secret}&code={$code}"; 
		$token = array(); 
		//expires_in 为access_token 有效时间增量 
		$content = Yii::$app->commonTools->curl_get_content($token_url);

		parse_str($content, $token); 

		return $token; 
	} 


	/**
	* [get_open_id 获取用户唯一ID，openid]
	* @param [string] $token [授权码]
	* @return [array] [成功返回client_id 和 openid ;失败返回error 和 error_msg]
	*/ 

	function get_open_id($token) 
	{ 
		$str = Yii::$app->commonTools->curl_get_content('https://graph.qq.com/oauth2.0/me?access_token=' . $token);
		if (strpos($str, "callback") !== false) { 
			$lpos = strpos($str, "("); 
			$rpos = strrpos($str, ")"); 
			//$str = substr($str, $lpos + 1, $rpos – $lpos -1);
			$str = substr($str, $lpos +1, $rpos - $lpos -1);
		} 
		$user = json_decode($str, TRUE); 
		return $user; 
	} 

	 
	/**
	* [get_user_info 获取用户信息]
	* @param [string] $token [授权码]
	* @param [string] $open_id [用户唯一ID]
	* @return [array] [ret：返回码，为0时成功。msg为错误信息,正确返回时为空。...params]
	*/ 

	function get_user_info($token, $open_id) 
	{ 
		//组装URL
		$user_info_url = 'https://graph.qq.com/user/get_user_info?'. 'access_token=' . $token . '&oauth_consumer_key=' . $this->app_id . '&openid=' . $open_id . '&format=json'; 

		$info = json_decode(Yii::$app->commonTools->curl_get_content($user_info_url), TRUE); 
		return $info; 
	} 
}