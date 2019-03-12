module.exports = {
    '/app': {
        target: 'http://172.16.15.203:8027/',
        changeOrigin: true,
    },
    '/app1': {
        target: 'http://172.16.15.203:8027/',
        changeOrigin: true,
        pathRewrite: {
            '^/app1': ''
        }
    },
}
