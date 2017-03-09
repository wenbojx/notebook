<?php
namespace App\Controller;
use Hoa\Core\Exception\Exception;
use Swoole;
use App;

class Login extends App\Controller
{
    private $get_user_db = null;
    private $successUrl = 'http://www.yiluhao.com/login/success';

    public function __construct($swoole)
    {
        parent::__construct($swoole);
    }

    //hello world
    public function desktoplogin()
    {
        //$this->assign('my_var', 'swoole view');
        $this->display('desktop_login.php');

    }
    //登录网关
    public function loginbridge()
    {
        //var_dump( Swoole::$php->config['params']);
        //var_dump(phpinfo());
        $type = _GET('type');
        switch ($type) {
            case 'qq':
                $url = $this->config['params']['qqLoginUrl'];
                $this->http->redirect($url);
                break;
            case 'weixin':
                echo 'errors';
                break;
        }

    }

    /**
    * 登录验证
    */
    public function loginqq()
    {
        
        $code = _GET('code');
        
        if (!$code) {
            return $this->display('failed.php');
        }
        $login_qq_obj = new App\DAO\LoginQq();
        //获取access_token
        $access_token = $login_qq_obj->getAccessToken($code);
        if (!$access_token) {
            return $this->display('failed.php');
        }
        $open_id = $login_qq_obj->getOpenId($access_token);
        if (!$open_id) {
            return $this->display('failed.php');
        }
        
        //return;
        //判断用户是否注册过
        $user_bind_db = model('UserBind');
        $bind_datas = $user_bind_db->getBindByOauthId($open_id);
        $user_info_db = model('UserInfo');
        $createtime = time();

        //如果没绑定，先绑定
        if(!$bind_datas){
            //注册用户
            $uid = $this->createUser($open_id, $open_id, $createtime);
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
            $user_info = $user_info_db->getByUid(intval($uid));
            $user_datas = $this->getUserDb()->getByUid($uid);
            $createtime = $user_datas['createtime'];
        }
        App\DAO\Login::loginSession($uid, $user_info['nickname'], $user_info['figureurl']);
        $this->saveLoginState($uid, $user_info['nickname'], $user_info['figureurl'], $createtime);
        $this->http->redirect($this->successUrl);
    }


    /**
    */
    private function saveLoginState($uid, $nickname, $figureurl, $createtime){
        
        $time = time()+3600*24*7;
        $this->http->setcookie('uid', $uid, $time);
        $this->http->setcookie('nickname', $nickname, $time);
        $this->http->setcookie('figureurl', $figureurl, $time);

        $datas  = array('uid' =>$uid , 'time'=>$time);
        $common = new APP\Common();
        $localtoken = $common->encryptLocalToken($datas);
        $this->http->setcookie('localtoken', $localtoken, $time);

        $token = $common->encryptToken($datas, $createtime);
        $this->http->setcookie('token', $token, $time);
    }
    /**
    * 登录成功
    */
    public function success(){
        return $this->display('success.php');
    }
    private function createUser($username, $passwd, $createtime){
        if(!$username || !$passwd){
            return false;
        }
        return $this->getUserDb()->addUser($username, 2, $passwd, $createtime);
    }
    private function getUserDb(){
        if(!$this->get_user_db){
            $this->get_user_db = model('User');
        }
        return $this->get_user_db;
    }

}