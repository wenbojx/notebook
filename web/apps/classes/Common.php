<?php
namespace App;
use Swoole;
/**
* 
*/
class Common
{

	private $encryptKey = 'note#$wen';
	public function getCacheKey($mode, $value){
		return $mode.'-'.$value;
	}

	public function encryptLocalToken($datas){
        $string = json_encode($datas);
        $string_pre = $string . Swoole::$php->config['params']['encryptPrefixLocal'];
        $value = md5($string_pre);
        return base64_encode($value . $string);
    }
	/**
    加密验证字符串
    */
    public function encryptToken($datas, $salt){
    	$string = serialize($datas);
        $prefix = Swoole::$php->config['params']['encryptPrefix'] . $salt;
        //$value = Yii::$app->getSecurity()->hashData($string, $prefix);
        $value = openssl_encrypt($string, 'aes-128-ecb', $prefix, OPENSSL_RAW_DATA);
        return base64_encode($value);
    }
    /**
	解密验证字符串
    */
    public function dencryptToken($string){
        $string = base64_decode($string);
    	$prefix = Swoole::$php->config['params']['encryptPrefix'];
        //$value = Yii::$app->getSecurity()->validateData($string, $prefix);
        $value = openssl_decrypt($string, 'aes-128-ecb', $prefix, OPENSSL_RAW_DATA);
        $datas = unserialize($value);
        return $datas;
    }


	public function curlGetContent($url){
		$ch = curl_init(); 
		curl_setopt($ch, CURLOPT_URL, $url); 
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
		//设置超时时间为3s
		//curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, 3); 
		curl_setopt($ch, CURLOPT_HEADER, 0);
		$result = curl_exec($ch);
		curl_close($ch); 
		return $result; 
	}
}
