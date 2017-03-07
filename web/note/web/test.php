<?php
$uid = '123456';
$key = 'yue#&wen'; 
$iv = 'yue$#wen'; 
$code = openssl_encrypt($uid, 'aes-128-ecb', $key, OPENSSL_RAW_DATA, $iv);
$code = base64_encode($code);
$uid = openssl_decrypt(base64_decode($code), 'aes-128-ecb', $key, OPENSSL_RAW_DATA, $iv);
echo $code."\n";
echo $uid;


exit();
