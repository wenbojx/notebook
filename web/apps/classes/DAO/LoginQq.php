<?php
namespace App\DAO;
use swoole;
use App;
use App\Common;

/**
 * LoginForm is the model behind the login form.
 *
 * @property User|null $user This property is read-only.
 *
 */
class LoginQq extends App\Base 
{
	//配置APP参数
	private $app_id = 101358269;
	private $app_secret = 'bd348353aaa0065c5edd23ae52eed30b';
	private $redirect = 'http://www.yiluhao.com/loginqq';

	function __construct() 
	{ 

	} 


	public function getAccessToken($code){
        if(!$code){
            return false;
        }
        $token = $this->get_access_token($code);
        if (!is_array($token) || !isset($token['access_token'])) {
            return false;
        }
        return $token['access_token'];
    }

    public function getOpenId($access_token){
        if(!$access_token){
            return false;
        }
        $open_id = $this->get_open_id($access_token);
        if (!is_array($open_id) || !isset($open_id['openid'])) {
            return false;
        }
        return $open_id['openid'];
    }

    public function getUserInfo($access_token, $open_id){
        if(!$access_token || !$open_id){
            return false;
        }
        $user_info = $this->get_user_info($access_token, $open_id);
        if (!is_array($user_info) ) {
            return false;
        }
        return $user_info;
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
		$content = APP\Common::curlGetContent($token_url);
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
		$str = APP\Common::curlGetContent('https://graph.qq.com/oauth2.0/me?access_token=' . $token);
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

		$info = json_decode(APP\Common::curlGetContent($user_info_url), TRUE); 
		return $info; 
	} 
}
