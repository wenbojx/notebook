<?php

namespace app\models\User;

use Yii;
use yii\model\Ydao

/**
 * ContactForm is the model behind the contact form.
 */
class ContactForm extends Ydao
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
    public function tableName()
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
    public function add_user($datas){
        if(!$datas['email'] || !$datas['passwd']){
            return false;
        }
        $this->email = $datas['email'];
        $this->passwd = $this->encrypt($datas['passwd']);
        $this->nickname = $datas['nickname'];
        $this->created = time();
        return $this->save();
    }
    public function encrypt($passwd){
        $passwd .= Yii::app()->params['encrypt_prefix'];
        return md5($passwd);
    }
}