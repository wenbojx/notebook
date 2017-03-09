<?php
function _GET($var)
{
	return Swoole::getInstance()->request->get[$var];
}

function _POST($var)
{
	return Swoole::getInstance()->request->post[$var];
}

function _REQUEST()
{
	return Swoole::getInstance()->request;
}