<?php
error_reporting(E_ALL);
$server = new swoole_websocket_server("0.0.0.0", 80);

$server->on('open', function (swoole_websocket_server $server, $request) {
    echo "server: handshake success with fd{$request->fd}\n";
});

$server->on('message', function (swoole_websocket_server $server, $frame) {
    echo "receive from {$frame->fd}:{$frame->data},opcode:{$frame->opcode},fin:{$frame->finish}\n";
    $server->push($frame->fd, "this is server");
    /*
    foreach($server->connections as $fd) {
    	echo "fd:".$fd."\n";
		$server->push($fd, $fd."-".$frame->data);
	}
	*/
});

$server->on('close', function ($ser, $fd) {
    echo "client {$fd} closed\n";
});

$server->start();