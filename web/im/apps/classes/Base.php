<?php
namespace App;
use Swoole;

/**
* 
*/
class Base extends Swoole\Object
{
	public $cache = null;
	public $cacheMaster = 'master';	
	public $session = null;
	function __construct()
	{
		$this->cache = Swoole::getInstance()->cache($this->cacheMaster);
		$this->session = Swoole::getInstance()->Session();
	}
}