<?php
namespace App;
use Swoole;

class Controller extends Swoole\Controller
{
    public function __construct($swoole)
    {   
        Swoole::$php->session->start();
        parent::__construct($swoole);
    }

}