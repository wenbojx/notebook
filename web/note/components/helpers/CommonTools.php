<?php

namespace app\components\helpers;

use Yii;
use yii\base\Component;
use yii\base\InvalidConfigException;
/**
* 
*/
class CommonTools extends Component
{
	public function encryptLocalToken($datas){
        $string = json_encode($datas);
        $string_pre = $string . Yii::$app->params['encryptPrefixLocal'];
        $value = md5($string_pre);
        return base64_encode($value . $string);
    }
	/**
    加密验证字符串
    */
    public function encryptToken($datas, $salt){
    	$string = serialize($datas);
        $prefix = Yii::$app->params['encryptPrefix'] . $salt;
        $value = Yii::$app->getSecurity()->hashData($string, $prefix);
        return base64_encode($value);
    }
    /**
	解密验证字符串
    */
    public function dencryptToken($string){
        $string = base64_decode($string);
    	$prefix = Yii::$app->params['encryptPrefix'];
        $value = Yii::$app->getSecurity()->validateData($string, $prefix);
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
