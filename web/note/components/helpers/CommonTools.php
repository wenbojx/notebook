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
	
	function curl_get_content($url){
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
