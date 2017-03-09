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
}

