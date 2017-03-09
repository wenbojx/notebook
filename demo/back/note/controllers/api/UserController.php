<?php

namespace app\controllers\api;

use Yii;
use app\controllers\YController;
use yii\web\response;

class UserController extends YController
{

    

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionIndex()
    {
        echo 1;

    }
    public function actionGetbysessionid()
    {
        Yii::$app->response->format=Response::FORMAT_JSON;
        $sessionid = Yii::$app->request->get('sessionid', 0);
        if (!$sessionid) {
            return false;
        }

        $userinfo = array('uid' => 9, 'nickname'=>'abc', 'figureurl'=>'http://qzapp.qlogo.cn/qzapp/101358269/E7D636F5ADF7E7839DCD2865705F81BF/30' );
         
        return $userinfo;

    }
    
}
