<?php

namespace app\models\user;

use Yii;
use app\models\Ydao;

class UserBind extends Ydao
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
        return '{{userbind}}';
    }

    public function getBindByOauthId($oauth_id){
        if (!$oauth_id) {
            return false;
        }
        $datas = $this->find()
            ->where(['oauth_id'=>$oauth_id])->one();
        if(!$datas){
            return false;
        }
        return $datas;
    }

    public function bindUser($uid, $oauth_type=1, $oauth_id, $access_token
){
        if(!$uid || !$oauth_id ){
            return false;
        }

        $this->uid = $uid;
        $this->oauth_type = $oauth_type;
        $this->oauth_id = $oauth_id;
        $this->access_token = $access_token;
        
        if( $this->save() ){
            return $this->attributes['id'];
        }
        return false;
    }

}