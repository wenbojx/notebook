<?php

if(empty($_GET['code'])) 
{ 
	exit('参数非法'); 
} 
include('qqSDK.php'); 

$qq_sdk = new Qq_sdk(); 
$token = $qq_sdk->get_access_token($_GET['code']); 
print_r($token); 

$open_id = $qq_sdk->get_open_id($token['access_token']); 
print_r($open_id); 
$user_info = $qq_sdk->get_user_info($token['access_token'], $open_id['openid']); 
print_r($user_info); 
