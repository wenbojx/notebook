<?php
namespace App;
use Swoole;

class CometServer extends Swoole\Protocol\CometServer
{
    public $cacheMaster = 'master'; 
    public $cache_prefix = "phpsess_";
    public $cache = null;

    function __construct($config = array())
    {
        $this->setLog($config);
        $this->cache = Swoole::getInstance()->cache($this->cacheMaster);
        parent::__construct($config);
    }

    function onMessage($client_id, $ws)
    {
    }

    function setLog($config){
        //检测日志目录是否存在
        $log_dir = dirname($config['webim']['log_file']);
        if (!is_dir($log_dir))
        {
            mkdir($log_dir, 0777, true);
        }
        if (!empty($config['webim']['log_file']))
        {
            $logger = new Swoole\Log\FileLog($config['webim']['log_file']);
        }
        else
        {
            $logger = new Swoole\Log\EchoLog(true);
        }
        $this->setLogger($logger);   //Logger
    }
}

