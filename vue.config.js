const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    pluginOptions: {
        electronBuilder: {
            preload: 'src/preload.js',
            customFileProtocol: "./",
            builderOptions: {
                // 在这里的配置将会和默认配置合并，然后传递给electron-builder
                appId: 'assist_3d', // 项目唯一标识
                copyright: 'Copyright © year 2023', // 可用使用${}引用package.json里面配置项，配置项不存在会报错
                // 安装包名称，可自行配置
                artifactName: 'assist3d_Setup_${version}_${platform}.${ext}',
                directories: {
                    output: 'dist' // 打包产物的位置
                },
                win: {
                    icon: 'build/icons/icon.ico', // 应用图标
                    target: [
                        {
                            target: "nsis",
                            arch: [
                                // "x64",
                                "ia32"
                            ]
                        }
                    ] // 打包的目标类型,支持很多类型，具体看文档
                },
                nsis: {
                    oneClick: false, // 是否一键安装
                    perMachine: true, //true全用户安装【目录为：C:\Program Files (x86)】，false安装到当前用户
                    allowElevation: true, // 允许请求提升。若为false，则用户必须使用提升的权限重新启动安装程序。
                    allowToChangeInstallationDirectory: true, //是否允许修改安装目录
                    installerIcon: "./build/icons/icon.ico",// 安装时图标
                    uninstallerIcon: "./build/icons/icon.ico",//卸载时图标
                    installerHeaderIcon: "./build/icons/icon.ico", // 安装时头部图标
                    createDesktopShortcut: true, // 是否创建桌面图标
                    createStartMenuShortcut: true,// 是否创建开始菜单图标
                    shortcutName: "assist_3d", // 快捷方式名称
                    runAfterFinish: true,//是否安装完成后运行
                }
            },
        }
    }
})
