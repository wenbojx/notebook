<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;

class YController extends Controller
{

    public function __construct($id, $module, $config = []) { 
        $this->id = $id;
        $this->module = $module;
        parent::__construct($id, $module, $config);
        
        $session = Yii::$app->session;
        if (!$session->isActive) {
            $session->open();
        }
    } 
    /**
     * @inheritdoc
     */
    public function actions()
    {
        return [
            'error' => [
                'class' => 'yii\web\ErrorAction',
            ],
            
            'captcha' => [
                'class' => 'yii\captcha\CaptchaAction',
                'fixedVerifyCode' => YII_ENV_TEST ? 'testme' : null,
            ],
            
        ];
    }

}
