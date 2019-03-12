/**
 * Module dependencies.
 */
var express = require('express')
var proxy = require('http-proxy-middleware');
var path = require('path');
const proxyIp = 'http://172.16.15.204';
const port=11199;

const proxyTable = require('./proxy-config.js');

/**
 * Configure proxy middleware
 */

var proxy_list = [];

function create_proxy() {
    for (let index in proxyTable) {
        let obj = {};
        obj.path = index;
        let options = {
            target: (function () {
                //判断代理设置端口没
                let port_t = (proxyTable[index].target.split(':'))[2];
                if (port_t) {
                    let proxyPort = port_t.replace('/', '');
                    return `${proxyIp}:${proxyPort}/`;
                } else {
                    return proxyTable[index].target;
                }
            })(),
            changeOrigin: proxyTable[index].changeOrigin,
            ws: true,
            pathRewrite: proxyTable[index].pathRewrite || {},
            proxyTimeout: 60000, //连接超时时间
        };
        obj.proxy = proxy(options);
        proxy_list.push(obj);
    }
}

create_proxy();


var app = express();
//设置静态文件目录
app.use(express.static(path.join(__dirname, '../dist')));

//代理
proxy_list.map(item => {
    app.use(item.path, item.proxy);
})

//主页面
app.get('/index', function (req, res, next) { //主页面，可以添加更多页面
    res.sendfile(path.join(__dirname, '../dist/index.html'));
})


app.listen(port || 11199); //开启端口

console.log('start success');