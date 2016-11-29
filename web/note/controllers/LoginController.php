<?php

namespace app\controllers;

use Yii;
use app\controllers\YController;
use app\models\login\LoginQq;
use app\models\login\Login;
use app\models\user\User;
use app\models\user\UserBind;
use app\models\user\UserInfo;
use yii\redis\Cache;
use yii\redis\Connection;

class LoginController extends YController
{

    

    /**
     * Displays homepage.
     *
     * @return string
     */
    public function actionLogin()
    {

        return $this->render('login');

    }
    /**
    * 登录验证
    */
    public function actionLoginqq()
    {
        /*
        $redis = Yii::$app->cache;
        //echo $redis->set('key','v111');
        //echo $redis->get('key1');
        $session = Yii::$app->session;
        //var_dump($session);
        echo $session->set('uid','1234567890');
        //echo $session->get('uid');
        exit();
        */
        
        $code = Yii::$app->request->get('code', 0);
        
        if (!$code) {
            return $this->render('failed');
        }
        $login_qq_obj = new LoginQq();
        //获取access_token
        $access_token = $login_qq_obj->getAccessToken($code);
        if (!$access_token) {
            return $this->render('failed');
        }
        $open_id = $login_qq_obj->getOpenId($access_token);
        if (!$open_id) {
            return $this->render('failed');
        }
        //判断用户是否注册过
        $user_bind_db = new UserBind();
        $bind_datas = $user_bind_db->getBindByOauthId($open_id);
        $user_info_db = new UserInfo();
        //如果没绑定，先绑定
        if(!$bind_datas){
            //注册用户
            $uid = $this->createUser($open_id, 0, 2);
            //绑定用户
            $bind = $user_bind_db->bindUser($uid, 1, $open_id, $access_token);
            //获取用户资料
            $user_info = $login_qq_obj->getUserInfo($access_token, $open_id);
            if ($user_info) {
                
                $user_info_db ->addUserInfo($uid, $user_info);
            }
        }
        else{
            $uid = $bind_datas['uid'];
            //获取用户详细信息
            $user_info = $user_info_db->getByUid($uid);
        }
        $login_mod = new Login();
        $login_mod->loginSession($uid, $user_info['nickname'], $user_info['figureurl']);
        //$session = Yii::$app->session;
        //var_dump($session);
        //$user_id = $session->get('uid');
        //echo $uid;
        $this->saveLoginState($uid, $user_info['nickname'], $user_info['figureurl']);
        $this->redirect('http://www.yiluhao.com/login');
        //return $this->render('success');
    }
    /**
    */
    private function saveLoginState($uid, $nickname, $figureurl){
        $cookies = Yii::$app->response->cookies;
        $time = time()+3600*24*30;
        $cookies->add(new \yii\web\Cookie([
            'name' => 'uid',
            'value' => $uid,
            'expire'=>$time
        ]));
        $cookies->add(new \yii\web\Cookie([
            'name' => 'nickname',
            'value' => $nickname,
            'expire'=>$time
        ]));
        $cookies->add(new \yii\web\Cookie([
            'name' => 'figureurl',
            'value' => $figureurl,
            'expire'=>$time
        ]));
    }
    /**
    * 登录成功
    */
    public function actionSuccess(){
        return $this->render('success');
    }
    private function createUser($user_name, $passwd, $status){
        $user_db = new User();
        $datas['username'] = $user_name;
        $datas['passwd'] = $passwd;
        $datas['status'] = 2;
        return $user_db->addUser($datas);
    }

}
