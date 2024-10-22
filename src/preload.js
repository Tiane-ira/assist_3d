const {contextBridge, ipcRenderer} = require('electron')

const getConfig = (key) => {
    return ipcRenderer.invoke('getConfig', key)
}

const setConfig = (key, value) => {
    ipcRenderer.invoke('setConfig', key, value)
}

const copy2Clipboard = (data) => {
    ipcRenderer.invoke('copy2Clipboard', data)
}

const filterCodes = (codeList, ruleList, igCounts, orderType) => {
    return ipcRenderer.invoke('filterCodes', codeList, ruleList, igCounts, orderType)
}

const openWindow = (param) => {
    return ipcRenderer.invoke('openWindow', param)
}

contextBridge.exposeInMainWorld('electron', {
    platform: process.platform,
    setConfig,
    getConfig,
    copy2Clipboard,
    filterCodes,
    openWindow
})

