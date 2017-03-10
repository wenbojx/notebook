<?php
namespace App\Im;
use Swoole;
use App;
use Swoole\Filter;

class Server extends App\CometServer
{
    /**
     * @var Store\File;
     */
    //protected $storage;
    //protected $users;
    //public $cacheMaster = 'master'; 
    //public $cache_prefix = "phpsess_";
    //protected $uid = 0;
    protected $clientUsers = array();  //存储每个连接对应的用户
    protected $userClients = array();    //存储每个用户对应的连接
    /**
     * 上一次发送消息的时间
     * @var array
     */
    protected $lastSentTime = array();

    const MESSAGE_MAX_LEN     = 1024; //单条消息不得超过1K
    const WORKER_HISTORY_ID   = 0;

    function __construct($config = array())
    {
        //$this->setLog($config);
        parent::__construct($config);
    }

    

    function onEnter($client_id)
    {
        echo "onEnter: " . $client_id;
    }

    /**
     * 下线时，通知所有人
     */
    function onExit($client_id)
    {
        if (!isset($this->clientUsers[$client_id])) {
            return false;
        }
        $uid = $this->clientUsers[$client_id];
        unset($this->userClients[$uid]);
        unset($this->clientUsers[$client_id]);
    }

    function onTask($serv, $task_id, $from_id, $data)
    {
        $this->log($serv."serv");
        /*
        $req = unserialize($data);
        if ($req)
        {
            switch($req['cmd'])
            {
                case 'getHistory':
                    $history = array('cmd'=> 'getHistory', 'history' => $this->storage->getHistory());
                    if ($this->isCometClient($req['fd']))
                    {
                        return $req['fd'].json_encode($history);
                    }
                    //WebSocket客户端可以task中直接发送
                    else
                    {
                        $this->sendJson(intval($req['fd']), $history);
                    }
                    break;
                case 'addHistory':
                    if (empty($req['msg']))
                    {
                        $req['msg'] = '';
                    }
                    $this->storage->addHistory($req['fd'], $req['msg']);
                    break;
                default:
                    break;
            }
        }
        */
    }

    function onFinish($serv, $task_id, $data)
    {
        $this->send(substr($data, 0, 32), substr($data, 32));
    }

    /**
     * 接收到消息时
     * @see WSProtocol::onMessage()
     */
    function onMessage($client_id, $ws)
    {
        $msg = json_decode($ws['message'], true);
        $func = 'cmd_'.$msg['cmd'];
        if (empty($msg['cmd']) || !method_exists($this, $func) ){
            $this->closeClient($client_id, 102, 'cmdError');
            return;
        }
        if ($msg['cmd'] == 'login') {
            $uid = $this->cmd_login($client_id, $msg);
            return;
        }
        $uid = $this->clientUsers[$client_id];
        if (!$uid) {
            $this->closeClient($client_id, 101, 'noLogin');
            return;
        }
        $this->$func($client_id, $uid, $msg);
    }
    

    /**
    登录认证
    */
    public function cmd_login($client_id, $msg){
        if (!$msg['sid']) {
            $this->closeClient($client_id, 101, 'noLogin');
        }
        //根据sid获取UID
        $uidString = $this->cache->get($this->cache_prefix.$msg['sid']);
        $uid = unserialize($uidString)['uid'];
        if(!$uid){
            $this->closeClient($client_id, 101, 'noLogin');
        }
        if(isset($this->userClients[$uid])){
            $client_id_tmp = $this->userClients[$uid];
            unset($this->clientUsers[$client_id_tmp]);
            unset($client_id_tmp);
        }
        $this->clientUsers[$client_id] = $uid;
        $this->userClients[$uid] = $client_id;
        return $uid;
    }
    /**
        关闭
    */
    public function closeClient($client_id, $code, $err_msg){
        $this->sendErrorMessage($client_id, $code, $err_msg);
        $this->close($client_id);
        return false;
    }
    /**
     * 设置用户上线状态
    */
    public function cmd_setOnline($uid){

    }
    /**
     * 获取好友列表
    */
    public function cmd_getFriends($client_id, $uid, $msg){
        if (!$uid) {
            return false;
        }
        $friendsDAO = new App\DAO\Friends();
        $friendList = $friendsDAO->getFriendsList($uid);
        $friends = $friendsDAO->getFriendsDetail($friendList);
        //var_dump($friends);
        $this->sendJson($client_id, $friends);
    }
    /**
    发送消息
    */
    public function cmd_sendMsg($client_id, $uid, $msg){
        if(!isset($msg['to']) || !$msg['to']){
            return;
        }
        //判断是否互为好友
        $to = $msg['to'];
        $toClientId = $this->userClients[$to];

        $tomsg['from'] = $uid;
        $tomsg['msg'] = $msg['msg'];
        $msgString = json_encode($tomsg);
        $state = $this->send($toClientId, $msgString);
        echo "\nsendstate:". $state;
    }

     /**
     * 获取在线列表
     */
    function cmd_getOnline($client_id, $msg)
    {
        $resMsg = array(
            'cmd' => 'getOnline',
        );
        $users = $this->storage->getOnlineUsers();
        $info = $this->storage->getUsers(array_slice($users, 0, 100));
        $resMsg['users'] = $users;
        $resMsg['list'] = $info;
        $this->sendJson($client_id, $resMsg);
    }

    
    
    /**
     * 获取历史聊天记录
     */
    function cmd_getHistory($client_id, $msg)
    {
        $task['fd'] = $client_id;
        $task['cmd'] = 'getHistory';
        $task['offset'] = '0,100';
        //在task worker中会直接发送给客户端
        $this->getSwooleServer()->task(serialize($task), self::WORKER_HISTORY_ID);
    }

    /**
     * 登录
     * @param $client_id
     * @param $msg
     */
    /*
    function cmd_login($client_id, $msg)
    {
        $info['name'] = Filter::escape(strip_tags($msg['name']));
        $info['avatar'] = Filter::escape($msg['avatar']);

        //回复给登录用户
        $resMsg = array(
            'cmd' => 'login',
            'fd' => $client_id,
            'name' => $info['name'],
            'avatar' => $info['avatar'],
        );

        //把会话存起来
        $this->users[$client_id] = $resMsg;

        $this->storage->login($client_id, $resMsg);
        $this->sendJson($client_id, $resMsg);

        //广播给其它在线用户
        $resMsg['cmd'] = 'newUser';
        //将上线消息发送给所有人
        $this->broadcastJson($client_id, $resMsg);
        //用户登录消息
        $loginMsg = array(
            'cmd' => 'fromMsg',
            'from' => 0,
            'channal' => 0,
            'data' => $info['name'] . "上线了",
        );
        $this->broadcastJson($client_id, $loginMsg);
    }
*/
    /**
     * 发送信息请求
     */
    function cmd_message($client_id, $msg)
    {
        $resMsg = $msg;
        $resMsg['cmd'] = 'fromMsg';

        if (strlen($msg['data']) > self::MESSAGE_MAX_LEN)
        {
            $this->sendErrorMessage($client_id, 102, 'message max length is '.self::MESSAGE_MAX_LEN);
            return;
        }

        $now = time();
        //上一次发送的时间超过了允许的值，每N秒可以发送一次
        if ($this->lastSentTime[$client_id] > $now - $this->config['webim']['send_interval_limit'])
        {
            $this->sendErrorMessage($client_id, 104, 'over frequency limit');
            return;
        }
        //记录本次消息发送的时间
        $this->lastSentTime[$client_id] = $now;

        //表示群发
        if ($msg['channal'] == 0)
        {
            $this->broadcastJson($client_id, $resMsg);
            $this->getSwooleServer()->task(serialize(array(
                'cmd' => 'addHistory',
                'msg' => $msg,
                'fd'  => $client_id,
            )), self::WORKER_HISTORY_ID);
        }
        //表示私聊
        elseif ($msg['channal'] == 1)
        {
            $this->sendJson($msg['to'], $resMsg);
            //$this->store->addHistory($client_id, $msg['data']);
        }
    }

    /**
     * 发送错误信息
    * @param $client_id
    * @param $code
    * @param $msg
     */
    function sendErrorMessage($client_id, $code, $msg)
    {
        $this->sendJson($client_id, array('cmd' => 'error', 'code' => $code, 'msg' => $msg));
    }

    /**
     * 发送JSON数据
     * @param $client_id
     * @param $array
     */
    function sendJson($client_id, $array)
    {
        $msg = json_encode($array);
        if ($this->send($client_id, $msg) === false)
        {
            $this->close($client_id);
        }
    }

    /**
     * 广播JSON数据
     * @param $client_id
     * @param $array
     */
    function broadcastJson($sesion_id, $array)
    {
        $msg = json_encode($array);
        $this->broadcast($sesion_id, $msg);
    }

    function broadcast($current_session_id, $msg)
    {
        foreach ($this->users as $client_id => $name)
        {
            if ($current_session_id != $client_id)
            {
                $this->send($client_id, $msg);
            }
        }
    }
}

