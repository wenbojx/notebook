<?php
namespace App\Model;
use Swoole;

class UserBind extends Swoole\Model
{
    /**
     * 表名
     * @var string
     */
    public $table = 'userbind';


    public function getBindByOauthId($oauth_id){

        $where['where'][] = 'oauth_id="'.$oauth_id.'"';
        $user = $this->gets($where);
        if(!$user){
            return false;
        }
        return $user[0];

    }

    public function bindUser($uid, $oauth_type=1, $oauth_id, $access_token){
        if(!$uid || !$oauth_id ){
            return false;
        }

        $data['uid'] = $uid;
        $data['oauth_type'] = $oauth_type;
        $data['oauth_id'] = $oauth_id;
        $data['access_token'] = $access_token;
        
        $id = $this->put($data);

        return $id;
    }
}