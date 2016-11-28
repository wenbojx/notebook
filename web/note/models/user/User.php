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
    public function addUser($datas){
        if(!$datas['username'] ){
            return false;
        }

        $this->username = $datas['username'];
        $this->status = isset($datas['status'])?$datas['status']:1;
        if( $this->status == 1){
        	$this->passwd = $this->encrypt($datas['passwd']);
    	}
    	else{
    		$this->passwd = 0;
    	}
        $this->createtime = time();
        if( $this->save() ){
        	return $this->attributes['id'];
        }
        return false;
    }
    public function encrypt($passwd){

        $passwd .= Yii::$app->params['encryptPrefix'];
        return md5($passwd);
    }
}