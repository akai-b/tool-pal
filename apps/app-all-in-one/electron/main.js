const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../dist/renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// ─── IPC 处理 ─────────────────────────────────────────────────────────────────

ipcMain.handle('fs:readFile', async (_event, { path: filePath }) => {
  const buf = fs.readFileSync(filePath)
  return new Uint8Array(buf)
})

ipcMain.handle('fs:writeFile', async (_event, { path: filePath, data }) => {
  fs.writeFileSync(filePath, Buffer.from(data))
})

ipcMain.handle('fs:showSaveDialog', async (_event, { defaultPath, filters }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({ defaultPath, filters })
  return canceled ? null : filePath
})

ipcMain.handle('fs:showOpenDialog', async (_event, { filters, multiSelections }) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters,
    properties: multiSelections ? ['openFile', 'multiSelections'] : ['openFile'],
  })
  return canceled ? null : filePaths
})

ipcMain.handle('app:version', () => app.getVersion())
ipcMain.handle('app:platform', () => process.platform)
