<?php
namespace App\Controller;
use Swoole;

class Base extends Swoole\Controller
{

    public function __construct($swoole)
    {   
        $this->session->start();
        parent::__construct($swoole);
    }

}