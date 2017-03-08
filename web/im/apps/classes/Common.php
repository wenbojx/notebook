<?php
namespace App;

/**
* 
*/
class Common
{

	public function getCacheKey($mode, $value){
		return $mode.'-'.$value;
	}
}