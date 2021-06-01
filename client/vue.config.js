module.exports = {
    devServer: {
        proxy: {
            '^/api/v1': {
                target: 'http://learnWebAppsBackend:3080',
                changeOrigin: true
            },
        }
    }
}