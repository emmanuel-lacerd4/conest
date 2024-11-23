/**
 * Segurança e desempenho
 */

const { contextBridge, ipcRenderer } = require('electron')

// Estabelecer a conexão com o banco de dados (envio de pedido para o main.js abrir a conexão com o banco de dados)
ipcRenderer.send('db-connect')

contextBridge.exposeInMainWorld('api', {
    dbMensagem: (message) => ipcRenderer.on('db-message', message),
    fecharJanela: () => ipcRenderer.send('close-about'),
    janelaClientes: () => ipcRenderer.send('open-client'),
    janelaFornecedores: () => ipcRenderer.send('open-supplier'),
    janelaProdutos: () => ipcRenderer.send('open-product'),
    janelaRelatorios: () => ipcRenderer.send('open-report'),
    novoCliente: (cliente) => ipcRenderer.send('new-client', cliente),
    resetarFormulario: (args) => ipcRenderer.on('reset-form', args)
})