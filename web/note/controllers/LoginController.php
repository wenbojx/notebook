<?php

namespace app\controllers;

use Yii;
//use yii\filters\AccessControl;
use yii\web\Controller;
use yii\web\Response;
use app\models\login\LoginQq;
//use yii\filters\VerbFilter;
//use app\models\LoginForm;
//use app\models\ContactForm;

class LoginController extends Controller
{

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

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionLogin()
    {
        return $this->render('login');
    }
    public function actionLoginqq()
    {
        /*
        Yii::$app->response->format=Response::FORMAT_JSON;
        return ['code'=>320,'message'=>'true'];
        */
        //$qq_sdk = new Qq_sdk(); 
        $token = LoginQq::get_access_token($_GET['code']); 
        print_r($token); 

        $open_id = Yii::$app->loginqq->get_open_id($token['access_token']); 
        print_r($open_id); 
        $user_info = Yii::$app->loginqq->get_user_info($token['access_token'], $open_id['openid']); 
        print_r($user_info); 

        return $this->render('login');
    }

}
