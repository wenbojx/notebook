<?php
$stime=microtime(true); 
// comment out the following two lines when deployed to production
defined('YII_DEBUG') or define('YII_DEBUG', true);
defined('YII_ENV') or define('YII_ENV', 'dev');

require(__DIR__ . '/../vendor/autoload.php');
require(__DIR__ . '/../vendor/yiisoft/yii2/Yii.php');

$config = require(__DIR__ . '/../config/web.php');

(new yii\web\Application($config))->run();

$etime=microtime(true);//获取程序执行结束的时间
$total=$etime-$stime;   //计算差值
echo "<br />[页面执行时间：{$total} ]秒";