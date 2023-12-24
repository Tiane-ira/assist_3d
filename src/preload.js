const {contextBridge, ipcRenderer} = require('electron')

const hello = () => {
    ipcRenderer.invoke('hello','jack')
}

contextBridge.exposeInMainWorld('myApi', {
    platform: process.platform,
    hello
})

