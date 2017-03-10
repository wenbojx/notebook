var ws = {};
var wsServer = 'ws://www.yiluhao.com:80';
var wsStatus = false; //连接状态

function createConnect(){
	ws = new WebSocket(wsServer);
	listenEvent();
}
function reConnect(){
	setTimeout(function(){
		createConnect();
	},5000)
}

function listenEvent() {
	//return;
    /**
     * 连接建立时触发
     */
    ws.onopen = function (e) {
        //连接成功
        console.log("connect im server success.");
        wsStatus = true;
    };

    //有消息到来时触发
    ws.onmessage = function (e) {

    };

    /**
     * 连接关闭事件
     */
    ws.onclose = function (e) {
    	console.log("onclosEerror: ");
    	reConnect();
    	wsStatus = false;
        //$(document.body).html("<h1 style='text-align: center'>连接已断开，请刷新页面重新登录。</h1>");
    };

    /**
     * 异常事件
     */
    ws.onerror = function (e) {
    	console.log("onerror: ");
    	reConnect();
    	wsStatus = false;
    	/*
        $(document.body).html("<h1 style='text-align: center'>服务器[" + webim.server +
            "]: 拒绝了连接. 请检查服务器是否启动. </h1>");
        console.log("onerror: " + e.data);
        */
    };
}
