<?php
namespace App\DAO;
use App;
use Swoole;

class UserInfo extends App\Base
{
	private $userInfoMod = null;

    public function getByUid($uid)
    {
    	$keyPre = Swoole::$php->config['keyprefix']['userinfo']['key'];
    	$expireTime = Swoole::$php->config['keyprefix']['userinfo']['expireTime'];

        $cacheKey = APP\Common::getCacheKey($keyPre, $uid);
		$userInfo = $this->cache->get($cacheKey);
		if ($userInfo) {
			$userInfo = json_decode($userInfo, true);
		}
		else{
        	$userInfo = $this->getUserInfoModel()->getByUid($uid);
        	if($userInfo) {
        		$userInfoString = json_encode($userInfo);
        		$this->cache->set($cacheKey, $userInfoString, $expireTime);
        	}
		}
		return $userInfo;
    }
    private function getUserInfoModel(){
		if($this->userInfoMod){
			return $this->userInfoMod;
		}
		return model('UserInfo');
	}
}