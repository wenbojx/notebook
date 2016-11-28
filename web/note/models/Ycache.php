<?php
namespace app\models;

use Yii;
use yii\caching\MemCache;

class Ycache extends MemCache{
    private $mCacheFlag = true;

    public function __construct(){
        $this->mCacheFlag = Yii::app()->params['mCacheFlag'];
        echo 11111;
        return parent::init();
    }
    public function get($key){
        if(!$this->mCacheFlag){
            return false;
        }
        return parent::getValue($key);
    }
    public function set($key, $value, $expire){
        if(!$this->mCacheFlag){
            return false;
        }
        return parent::setValue($key, $value, $expire);
    }
    public function remove($key){
        if(!$this->mCacheFlag){
            return false;
        }
        return parent::deleteValue($key);
    }
}