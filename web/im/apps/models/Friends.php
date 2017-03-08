<?php
namespace App\Model;
use Swoole;

class Friends extends Swoole\Model
{
    /**
     * 表名
     * @var string
     */
    public $table = 'friends';


    function getByUid($uid, $limit=100000){
        if (!is_int($uid)) {
            return false;
        }
        $where = array(
                'where'=>array('uid='.$uid, 'status in(1,2)'),
                'order'=>'addtime desc',
                'limit'=>$limit,
            );
        //$this->select = 'uid, fuid, status';
        $user = $this->gets($where); 
        //var_dump($user);
        return $user;
    }
}