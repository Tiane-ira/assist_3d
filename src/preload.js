const {contextBridge, ipcRenderer} = require('electron')

const showDirChecker = () => {
    return ipcRenderer.invoke('showDirChecker')
}

const exportExcel = (path, data) => {
    return ipcRenderer.invoke('exportExcel', path, data)
}

contextBridge.exposeInMainWorld('electron', {
    platform: process.platform,
    showDirChecker,
    exportExcel
})

