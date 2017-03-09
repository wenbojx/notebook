<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    
    <script>if (typeof module === 'object') {window.module = module; module = undefined;}</script>
    <script src="http://www.wofu-sh.com/assets/jquery-3.0.0.min.js"></script>
    <title>Title</title>
</head>
<body>

<div style="margin: 50px auto">
<a id="qqLogin">QQ</a>
</div>

<script type="text/javascript">
const ipcRenderer = require('electron').ipcRenderer;
    $("#qqLogin").click(function(){
        ipcRenderer.send('qqLogin', null);
    })
</script>
</body>
</html>