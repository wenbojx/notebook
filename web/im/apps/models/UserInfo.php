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
        var_dump($uid);
        if (!is_int($uid)) {
            return false;
        }
        $where = array(
                'where'=>array('uid='.$uid),
            );

        //$this->select = 'nickname, figureurl';
        $user = $this->gets($where);
        if(!$user){
            return false;
        }
        return $user[0];
    }
}