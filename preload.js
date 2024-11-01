/**
 * Segurança e desempenho
 */

const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('api', {
    fecharJanela: () => ipcRenderer.send('close-about'),
    janelaClientes: () => ipcRenderer.send('open-client'),
    janelaFornecedores: () => ipcRenderer.send('open-supplier'),
    janelaProdutos: () => ipcRenderer.send('open-product'),
    janelaRelatorios: () => ipcRenderer.send('open-report')
})