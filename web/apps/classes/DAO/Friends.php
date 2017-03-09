<?php
namespace App\DAO;
use swoole;
use App;
use App\Common;

/**
* 
*/
class Friends extends App\Base 
{
	private $userInfoObj = null;
	private $friendsMod = null;
	private $commonObj = null;
    //获取好友ID
	public function getFriendsList($uid){

		$keyPre = Swoole::$php->config['keyprefix']['friends']['key'];
    	$expireTime = Swoole::$php->config['keyprefix']['friends']['expireTime'];

		$cacheKey = $this->gCommonObj()->getCacheKey($keyPre, $uid);
		$friends = $this->cache->get($cacheKey);
		if ($friends) {
			$friends = json_decode($friends, true);
		}
		else{
        	$friendsDatas = $this->getFriendsModel()->getByUid($uid);
        	if ($friendsDatas) {
        		foreach ($friendsDatas as $key => $value) {
        			$friends[] = $value['fuid'];
        		}
        		$friendsString = json_encode($friends);
        		$this->cache->set($cacheKey, $friendsString, $expireTime);
        	}
		}
		return $friends;
	}
	//获取好友详细信息
	public function getFriendsDetail($friendList){
		//$friendList = $this->getFriendsList($uid);
		if(!$friendList){
			return false;
		}
		$keyPre = Swoole::$php->config['keyprefix']['userinfo']['key'];
		$keys = array();
		foreach ($friendList as $value) {
			$keys[] = $this->gCommonObj()->getCacheKey($keyPre, $value);
		}
		//
		$noInfo = array();
		$friendsDatas = $this->cache->getMultiple($keys);
		foreach ($friendsDatas as $k=> $v) {
			if (!$v) {
				$uid = $friendList[$k];
				$friendsDatas[$k] = $this->getUserInfoObject()->getByUid(intval($uid));
			}
			else{
				$v = unserialize($v);
				$friendsDatas[$k] = json_decode($v, true);
			}
		}
		return $friendsDatas;
	}
	private function getUserInfoObject(){
		if ($this->UserInfoObj) {
			return $this->userInfoObj;
		}
		return new App\DAO\UserInfo();
	}
	private function getFriendsModel(){
		if($this->friendsMod){
			return $this->friendsMod;
		}
		return model('Friends');
	}
	private function gCommonObj(){
		if (!$this->commonObj) {
			$this->commonObj = new APP\Common();
		}
		return $this->commonObj;
	}
}