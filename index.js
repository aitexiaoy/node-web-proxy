/**
 * Module dependencies.
 */
var express = require('express')
var proxy = require('http-proxy-middleware');
var path = require('path');
/**
 * Configure proxy middleware
 */
var jsonPlaceholderProxy = proxy({
    target: 'http://172.16.15.203:9393',     //代理地址
    changeOrigin: true,  
    ws:true,
    pathRewrite: {
        '^/api': ''                          //去掉'/api'
    },
    proxyTimeout: 60000,                     //连接超时时间
    cookieDomainRewrite: {                   //cookie cookie待验证
        "*": ""
    }
})

var app = express();       
//设置静态文件目录
app.use(express.static(path.join(__dirname, './static')));

/**
 * Add the proxy to express
 */
app.use('/api/*', jsonPlaceholderProxy);             //匹配api下的进行代理
//主页面
app.get('/index', function (req, res, next) {        //主页面，可以添加更多页面
    res.sendfile('./static/index.html');
})

app.listen(13077);                                    //开启端口

console.log('start success');