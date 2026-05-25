import { app, protocol, BrowserWindow, ipcMain, clipboard, Menu } from 'electron'
import { join, resolve } from 'path'
import { codesFilter, CheckRule } from './filter-engine'
import Store from 'electron-store'

const isDevelopment = process.env.NODE_ENV !== 'production'

const store = new Store()

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

let mainWindow: BrowserWindow | null = null

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    minWidth: 1200,
    minHeight: 600,
    autoHideMenuBar: true,
    icon: join(__dirname, '../../build/icons/icon.ico'),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: isDevelopment
    }
  })
  win.maximize()

  if (isDevelopment && process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // macOS menu
  if (process.platform === 'darwin') {
    app.setName('Assist 3D')
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      { role: 'editMenu' },
      {
        label: 'View',
        submenu: [
          ...(isDevelopment ? [] : [{ role: 'toggleDevTools' }]),
          { role: 'togglefullscreen' }
        ]
      },
      {
        role: 'window',
        submenu: [
          { role: 'minimize' },
          { role: 'zoom' },
          { type: 'separator' },
          { role: 'front' }
        ]
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  }

  return win
}

function openChildWindow(param: { title: string; url: string; width: number; height: number }): void {
  const childWin = new BrowserWindow({
    title: param.title,
    width: param.width,
    height: param.height,
    icon: join(__dirname, '../../build/icons/icon.ico'),
    parent: mainWindow!,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      devTools: isDevelopment
    }
  })

  if (isDevelopment && process.env['ELECTRON_RENDERER_URL']) {
    childWin.loadURL(process.env['ELECTRON_RENDERER_URL'] + '#' + param.url)
  } else {
    childWin.loadFile(join(__dirname, '../renderer/index.html'), { hash: param.url })
  }

  childWin.on('closed', () => { childWin.destroy() })
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow()
  }
})

app.on('ready', () => {
  mainWindow = createWindow()
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.handle('setConfig', (_e, key: string, value: any) => {
  store.set(key, value)
})

ipcMain.handle('getConfig', (_e, key: string) => {
  return store.get(key)
})

ipcMain.handle('copy2Clipboard', (_e, data: string) => {
  clipboard.writeText(data)
})

ipcMain.handle('filterCodes', (_e, codeList: string[], ruleList: CheckRule[], igCounts: number[], orderType: boolean) => {
  return codesFilter(codeList, ruleList, igCounts, orderType)
})

ipcMain.handle('openWindow', (_e, param: { title: string; url: string; width: number; height: number }) => {
  return openChildWindow(param)
})
