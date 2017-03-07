<?php
use App;
define('DEBUG', 'on');
define('WEBPATH', realpath(__DIR__ . '/../'));
require dirname(__DIR__) . '/libs/lib_config.php';

//require __DIR__'/phar://swoole.phar';
Swoole\Config::$debug = true;
Swoole\Error::$echo_html = false;

$AppSvr = new APP\Socket\WebSocket();
$AppSvr->loadSetting(__DIR__."/im.ini"); //加载配置文件
$AppSvr->setLogger(new \Swoole\Log\EchoLog(true)); //Logger

/**
 * 如果你没有安装swoole扩展，这里还可选择
 * BlockTCP 阻塞的TCP，支持windows平台
 * SelectTCP 使用select做事件循环，支持windows平台
 * EventTCP 使用libevent，需要安装libevent扩展
 */
$enable_ssl = false;
$server = Swoole\Network\Server::autoCreate('0.0.0.0', 80, $enable_ssl);
$server->setProtocol($AppSvr);
//$server->daemonize(); //作为守护进程
$server->run(array(
    'worker_num' => 2,
    'ssl_key_file' => __DIR__.'/ssl/ssl.key',
    'ssl_cert_file' => __DIR__.'/ssl/ssl.crt',
    //'max_request' => 1000,
    //'ipc_mode' => 2,
    //'heartbeat_check_interval' => 40,
    //'heartbeat_idle_time' => 60,
));

