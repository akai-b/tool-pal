const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  invoke: (channel, req) => ipcRenderer.invoke(channel, req),
})
