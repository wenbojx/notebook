<?php

namespace app\models\user;

use Yii;
use app\models\Ydao;

class UserInfo extends Ydao
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
        return '{{userinfo}}';
    }

    public function getByUid($uid){
        if (!$uid) {
            return false;
        }
        $datas = $this->find()
            ->where(['uid'=>$uid])->one();
        if(!$datas){
            return false;
        }
        return $datas;
    }
    public function addUserInfo($uid, $datas){

        if(!$uid){
            return false;
        }
        $this->uid = $uid;
        $this->nickname = $datas['nickname'];
        $this->gender = $datas['gender'];
        $this->province = $datas['province'];
        $this->city = $datas['city'];
        $this->year = $datas['year'];
        $this->figureurl = $datas['figureurl'];

        return $this->save();
        
    }
}