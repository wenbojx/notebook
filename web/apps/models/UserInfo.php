<?php
namespace App\Model;
use Swoole;

class UserInfo extends Swoole\Model
{
    /**
     * 表名
     * @var string
     */
    public $table = 'userinfo';


    public function getByUid($uid)
    {
        if (!is_int($uid)) {
            //return false;
        }
        $where['where'][] = 'uid='.$uid;
        //$this->select = 'nickname, figureurl';
        $user = $this->gets($where);
        if(!$user){
            return false;
        }
        return $user[0];
    }

    public function addUserInfo($uid, $datas){
        if(!$uid){
            return false;
        }
        $data['uid'] = $uid;
        $data['nickname'] = $datas['nickname'];
        $data['gender'] = $datas['gender']=="男"?1:0;
        $data['province'] = $datas['province'];
        $data['city'] = $datas['city'];
        $data['year'] = $datas['year'];
        $data['figureurl'] = $datas['figureurl'];
        $id = $this->put($data);

        return $id;
        
    }
}