<?php

namespace app\models;

use Yii;
use yii\db\ActiveRecord;
use app\models\Ycache;

class Ydao extends ActiveRecord{
    private $cache_obj = null;
    const TALBLE_KEY_PREFIX = 'db_table_';

    public $cache_expire_time = 600;
    public $cache_expire_time_pk = 900;

/*
    public function __construct($scenario='insert'){
        parent::__construct($scenario);
    }
*/
    public static function tableName(){
        return parent::tableName();
    }

    public function insert($runValidation=false,$attributes=null){
        return parent::insert($runValidation,$attributes);
    }
    /*
    public function insert(false, $attributes=null){
        var_dump($attributes);
        exit;
        return parent::insert(false, $attributes);
    }
    */
    public function update($runValidation = false, $attributes=null){
        return parent::update($attributes);
    }
    public function delete(){
        return parent::delete();
    }
    public static function find(){
        return parent::find();
    }
    public static function findAll($condition='',$params=array()){
        return parent::findAll($condition, $params);
    }
    public static function findByPk($pk,$condition='',$params=array()){
        $key = $this->getPkKey($pk);
        if(!$datas = $this->getCacheObj()->get($key)){
            $datas = parent::findByPk($pk,$condition,$params);
            $this->getCacheObj()->set($key, $datas, $this->cache_expire_time_pk);
        }
        return $datas;
    }
    public static function findAllByPk($pk,$condition='',$params=array()){
        return parent::findAllByPk($pk,$condition,$params);
    }
    public static function findByAttributes($attributes,$condition='',$params=array()){
        return parent::findByAttributes($attributes,$condition,$params);
    }
    public static function findAllByAttributes($attributes,$condition='',$params=array()){
        return parent::findAllByAttributes($attributes,$condition,$params);
    }
    public static function findBySql($sql,$params=array()){
        return parent::findBySql($sql,$params);
    }
    public static function findAllBySql($sql,$params=array()){
        return parent::findAllBySql($sql,$params);
    }
    public static function count($condition='',$params=array()){
        return parent::count($condition,$params);
    }
    public static function countByAttributes($attributes,$condition='',$params=array()){
        return parent::countByAttributes($attributes,$condition,$params);
    }
    public static function countBySql($sql,$params=array()){
        return parent::countBySql($sql, $params);
    }
    public static function updateByPk($pk,$attributes,$condition='',$params=array()){
        $key = $this->getPkKey($pk);
        if ($datas = parent::updateByPk($pk,$attributes,$condition,$params)){
            $this->getCacheObj()->remove($key);
            return $datas;
        }
        return false;
    }
    public static function updateAll($attributes,$condition='',$params=array()){
        return parent::updateAll($attributes,$condition,$params);
    }
    public static function deleteByPk($pk,$condition='',$params=array()){
        return parent::deleteByPk($pk,$condition,$params);
    }
    public static function deleteAll($condition='',$params=array()){
        return parent::deleteAll($condition,$params);
    }
    public static function deleteAllByAttributes($attributes,$condition='',$params=array()){
        return parent::deleteAllByAttributes($attributes,$condition,$params);
    }
    public static function getPkKey($pk){
        return self::TALBLE_KEY_PREFIX.$this->tableName().'_pk_'.$pk;
    }
    /**
     * @return Ymemcache
     */
    private function getCacheObj(){
        if(!$this->cache_obj){
            $this->cache_obj = new Ymemcache();
        }
        return $this->cache_obj;
    }
}
