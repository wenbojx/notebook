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
/*
    public function check_login($datas){
        if(!$datas['email'] || !$datas['passwd']){
            return false;
        }
        $user_datas = $this->find_by_email($datas['email']);
        if(!$user_datas){
            return false;
        }
        if($user_datas['passwd'] != $this->encrypt($datas['passwd'])){
            return false;
        }
        unset($user_datas['passwd']);
        return $user_datas;
    }
    */
    public function addUser($username, $status, $passwd, $createtime){
        if(!$username ){
            return false;
        }

        $data['username'] = $username;
        $data['status'] = isset($status)?$status:1;
        $data['createtime'] = $createtime;
        $data['passwd'] = $this->encrypt($passwd, $this->createtime);
        
        $id = $this->put($data);
        return $id;
    }
    /**
    用户注册时间作为盐
    */
    public function encrypt($passwd, $salt){
        $passwd .= Swoole::$php->config['params']['encryptPrefix'].$salt;
        return md5($passwd);
    }
}