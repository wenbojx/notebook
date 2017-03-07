<?php
namespace App\Model;
use Swoole;

class User extends Swoole\Model
{
    /**
     * 表名
     * @var string
     */
    public $table = 'user';


    function getByUid($uid)
    {
        $user = $this->get($uid); //id = 1
        return $user->get();
    }
}