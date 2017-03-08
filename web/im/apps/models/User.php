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


    public function getByUid($uid)
    {
        $user = $this->get($uid);
        return $user->get();
    }
}