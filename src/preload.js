const {contextBridge, ipcRenderer} = require('electron')

const getConfig = (key) => {
    return ipcRenderer.invoke('getConfig', key)
}

const setConfig = (key, value) => {
    ipcRenderer.invoke('setConfig', key, value)
}
const showDirChecker = () => {
    return ipcRenderer.invoke('showDirChecker')
}

const exportExcel = (path, data) => {
    return ipcRenderer.invoke('exportExcel', path, data)
}

contextBridge.exposeInMainWorld('electron', {
    platform: process.platform,
    setConfig,
    getConfig,
    showDirChecker,
    exportExcel
})

