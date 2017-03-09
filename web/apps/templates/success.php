<!DOCTYPE html>
<html>
    <head>
        <title>QQlogin</title>
    </head>
    <body>
登录成功

<script type="text/javascript">
	const ipcRenderer = require('electron').ipcRenderer;
	ipcRenderer.send('loginSucess', null);
</script>
</body>
</html>