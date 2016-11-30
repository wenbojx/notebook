<?php

namespace app\models\user;

use Yii;
use app\models\Ydao;

class User extends Ydao
{
	/**
     * Returns the static model of the specified AR class.
     * @param string $className active record class name.
     * @return Member the static model class
     */
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
    /**
     * @return string the associated database table name
     */
    public static function tableName()
    {
        return '{{user}}';
    }

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
    public function getByUid($uid){
        if (!$uid) {
            return false;
        }
        $datas = $this->find()
            ->where(['id'=>$uid])->one();
        if(!$datas){
            return false;
        }
        return $datas;

    }
    public function addUser($username, $status, $passwd, $createtime){
        if(!$username ){
            return false;
        }

        $this->username = $username;
        $this->status = isset($status)?$status:1;
        $this->createtime = $createtime;
        $this->passwd = $this->encrypt($passwd, $this->createtime);
        
        if( $this->save() ){
        	return $this->attributes['id'];
        }
        return false;
    }
    /**
    用户注册时间作为盐
    */
    public function encrypt($passwd, $salt){
        $passwd .= Yii::$app->params['encryptPrefix'].$salt;
        return md5($passwd);
    }
}