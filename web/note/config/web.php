<?php

$params = require(__DIR__ . '/params.php');

$config = [
    'id' => 'notebook',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log','commonTools'],
    'components' => [
        'request' => [
            // !!! insert a secret key in the following (if it is empty) - this is required by cookie validation
            'cookieValidationKey' => 'yifang*$#yifang',
            'enableCookieValidation' => false,
        ],
        'cache' => [
            'class' => 'yii\redis\Cache',
             'redis' => [
                'hostname' => 'localhost',
                'port' => 6379,
                'database' => 0,
            ],
        ],
        'session' => [
            'class' => 'yii\redis\Session',
             'redis' => [
                'hostname' => 'localhost',
                'port' => 6379,
                'database' => 0,
            ],
        ],
        /*
        'cache' => [
            'class' => 'yii\caching\MemCache',
            'servers' => [
                [
                    'host' => '127.0.0.1',
                    'port' => 11211,
                    'weight' => 60,
                ]
            ],
        ],
        
        'user' => [
            'identityClass' => 'app\models\User',
            'enableAutoLogin' => true,
        ],
        */
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => require(__DIR__ . '/db.php'),
        
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [
                'loginqq' => 'login/loginqq',
                'login' => 'login/login',
                'info' => 'api/userinfo/info',
            ],
        ],
        'commonTools' => [
            'class' => 'app\components\helpers\CommonTools',
        ],
    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
    ];
}

return $config;
