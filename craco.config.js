const CracoLessPlugin = require("craco-less");
module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#f0f' },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
    babel: {
        plugins: [
            ["import", {
                "libraryName": "antd",// 加载的包
                "libraryDirectory": "es",
                "style": true,// 为true，按需加载的less文件，为css则按需加载css文件，css记得加双引号
            }, "antd"]
        ]
    },
}