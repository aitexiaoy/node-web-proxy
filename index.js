/**
 * Module dependencies.
 */
var express = require('express')
var proxy = require('http-proxy-middleware');
var path = require('path');
const port=11199;

const proxyTable = require('./proxy-config.js');

/**
 * Configure proxy middleware
 */

var proxy_list = [];

function create_proxy() {

    proxyTable.forEach((item,key)=>{
        let obj = {};
        obj.path = key;
        let options = {
            target: item.target,
            changeOrigin: item.changeOrigin,
            ws:item.target|| true,
            pathRewrite: item.pathRewrite || {},
            proxyTimeout: item.proxyTimeout||60000, //连接超时时间
        };
        obj.proxy = proxy(options);
        proxy_list.push(obj);
    })
}

create_proxy();

var app = express();
//设置静态文件目录
app.use(express.static(path.join(__dirname, './static')));

//代理
proxy_list.map(item => {
    app.use(item.path, item.proxy);
})


app.listen(port || 11199); //开启端口

console.log('start success');