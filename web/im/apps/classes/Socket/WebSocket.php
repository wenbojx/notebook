<?php
namespace App\Socket;
use Swoole;

class WebSocket extends Swoole\Protocol\WebSocket
{
    protected $message;

    /**
     * @param     $serv swoole_server
     * @param int $worker_id
     */
    function onStart($serv, $worker_id = 0)
    {
        Swoole::$php->router(array($this, 'router'));
        parent::onStart($serv, $worker_id);
    }

    function router()
    {
        var_dump($this->message);
    }

    /**
     * 进入
     * @param $client_id
     */
    function onEnter($client_id)
    {
        $this->log("onEnter: " . $client_id);
        //通知所有好友
        $model = model('Friends');
        $user1 = $model->getByUid(11);
        var_dump($user1);
    }

    /**
     * 下线时，通知所有人
     */
    function onExit($client_id)
    {
        //将下线消息发送给所有人
        $this->log("onOffline: " . $client_id);
        //$this->broadcast($client_id, "onOffline: " . $client_id);
        //通知所有好友
    }

    

    /**
     * 接收到消息时
     */
    function onMessage($client_id, $ws)
    {
        //$model = model('User');
        //$user1 = $model->getByUid(11);

        $this->log("onMessage: ".$client_id.' = '.$ws['message'].' username:'.$user1['username']);
        $this->send($client_id, 'Server: '.$ws['message'].$user1['username']);
		//$this->broadcast($client_id, $ws['message']);
    }

    function broadcast($client_id, $msg)
    {
        foreach ($this->connections as $clid => $info)
        {
            if ($client_id != $clid)
            {
                $this->send($clid, $msg);
            }
        }
    }
    function onMessage_mvc($client_id, $ws)
    {
        $this->log("onMessage: ".$client_id.' = '.$ws['message']);

        $this->message = $ws['message'];
        $response = Swoole::$php->runMVC();

        $this->send($client_id, $response);
        //$this->broadcast($client_id, $ws['message']);
    }
}