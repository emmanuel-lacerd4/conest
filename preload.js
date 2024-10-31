/**
 * Segurança e desempenho
 */

const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('api', {
    fecharJanela: () => ipcRenderer.send('close-about')
})