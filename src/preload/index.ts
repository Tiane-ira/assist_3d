import { contextBridge, ipcRenderer } from 'electron'

const electronAPI = {
  platform: process.platform,

  getConfig: (key: string) => {
    return ipcRenderer.invoke('getConfig', key)
  },

  setConfig: (key: string, value: any) => {
    return ipcRenderer.invoke('setConfig', key, value)
  },

  copy2Clipboard: (data: string) => {
    return ipcRenderer.invoke('copy2Clipboard', data)
  },

  filterCodes: (codeList: string[], ruleList: any[], igCounts: number[], orderType: boolean) => {
    return ipcRenderer.invoke('filterCodes', codeList, ruleList, igCounts, orderType)
  },

  openWindow: (param: { title: string; url: string; width: number; height: number }) => {
    return ipcRenderer.invoke('openWindow', param)
  }
}

contextBridge.exposeInMainWorld('electron', electronAPI)
