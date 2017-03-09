<?php
define('DEBUG', 'on');
define('WEBPATH', realpath(__DIR__ . '/../'));
define('ROOT_PATH',realpath(__DIR__ . '/../'));
require dirname(__DIR__) . '/libs/lib_config.php';

//设置PID文件的存储路径
Swoole\Network\Server::setPidFile(__DIR__ . '/app_server.pid');
/**
 * 显示Usage界面
 * php app_server.php start|stop|reload
 */
Swoole\Network\Server::start(function ()
{
   	$config = Swoole::getInstance()->config['im'];
    $webim = new App\Im\Server($config);
    $webim->loadSetting(__DIR__ . "/im.ini"); //加载配置文件
    /**
     * webim必须使用swoole扩展
     */
    $server = new Swoole\Network\Server($config['server']['host'], $config['server']['port']);
    $server->setProtocol($webim);
    $server->run($config['swoole']);
});