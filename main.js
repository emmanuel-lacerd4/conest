/**
 * Processo principal
 */

const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog } = require('electron/main')
const path = require('node:path')

// Importação do módulo de conexão
const { dbConnect, desconectar } = require('./database.js')

// Status de conexão com o banco de dados. No MongoDB é mais eficiente manter uma única conexão aberta durante todo o tempo de vida do aplicativo e usá-la quando necessário. Fechar e reabrir constantemente a conexão aumenta a sobrecarga e reduz o desempenho do servidor.
// A variável abaixo é usada para garantir que o banco de dados inicie desconectado (evitar abrir outra instância)
let dbcon = null

// Importação do Schema Clientes da camada model
const clienteModel = require('./src/models/Clientes.js')

// Janela principal
let win
function createWindow() {
    nativeTheme.themeSource = 'dark'
    win = new BrowserWindow({
        width: 1010,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // Menu personalizado (comentar para debugar)
    //Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

    // Botões
    ipcMain.on('open-client', () => {
        clientWindow()
    })

    ipcMain.on('open-supplier', () => {
        supplierWindow()
    })

    ipcMain.on('open-product', () => {
        productWindow()
    })

    ipcMain.on('open-report', () => {
        reportWindow()
    })
}

// Janela sobre
function aboutWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    let about
    if (main) {
        about = new BrowserWindow({
            width: 360,
            height: 215,
            autoHideMenuBar: true,
            resizable: false,
            minimizable: false,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }

    about.loadFile('./src/views/sobre.html')

    ipcMain.on('close-about', () => {
        console.log("Recebi a mensagem close-about")
        if (about && !about.isDestroyed()) {
            about.close()
        }
    })
}

// Janela clientes
function clientWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    let client
    if (main) {
        client = new BrowserWindow({
            width: 800,
            height: 600,
            //autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    client.loadFile('./src/views/clientes.html')
}

// Janela fornecedores
function supplierWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    let supplier
    if (main) {
        supplier = new BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    supplier.loadFile('./src/views/fornecedores.html')
}

// Janela produtos
function productWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    let product
    if (main) {
        product = new BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    product.loadFile('./src/views/produtos.html')
}

// Janela relatórios
function reportWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    let report
    if (main) {
        report = new BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    report.loadFile('./src/views/relatorios.html')
}

app.whenReady().then(() => {
    createWindow()

    // Melhor local para estabelecer a conexão com o banco de dados
    // Importar o módulo de conexão no início do código

    // Conexão com o banco de dados
    ipcMain.on('db-connect', async (event, message) => {
        // A linha abaixo estabelece a conexão com o banco de dados
        dbcon = await dbConnect()
        // Enviar ao renderizador uma mensagem para trocar o ícone status do banco de dados
        event.reply('db-message', "conectado")
    })

    // Desconectar do banco de dados ao encerrar a aplicação
    app.on('before-quit', async () => {
        await desconectar(dbcon)
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

const template = [
    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Sair',
                accelerator: 'Alt+F4',
                click: () => app.quit()
            }
        ]
    },
    {
        label: 'Zoom',
        submenu: [
            {
                label: 'Aplicar zoom',
                accelerator: 'CmdOrCtrl+=',
                click: () => win.webContents.zoomFactor += 0.1
            },
            {
                label: 'Reduzir',
                role: 'zoomOut'
            },
            {
                label: 'Restaurar o zoom padrão',
                role: 'resetZoom'
            },
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            {
                label: 'Repositório',
                click: () => shell.openExternal('https://github.com/emmanuel-lacerd4/conest')
            },
            {
                label: 'Sobre',
                click: () => aboutWindow()
            }
        ]
    }
]

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Recebimento dos dados de formulário
ipcMain.on('new-client', async (event, cliente) => {
    // Teste de recebimento dos dados (Passo 2 - slide) Importante!
    console.log(cliente)

    // Passo 3 - slide (cadastrar os dados no banco de dados)
    try {
        // Criar um novo objeto usando a classe modelo
        const novoCliente = new clienteModel({
            nomeCliente: cliente.nomeCli,
            foneCliente: cliente.foneCli,
            emailCliente: cliente.emailCli
        })
        // A linha abaixo usa a biblioteca mongoose para salvar
        await novoCliente.save()

        // Confirmação de cliente adicionado no banco de dados
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Cliente adicionado com sucesso!",
            buttons: ['OK']
        })
        // Enviar uma resposta para o renderizador resetar o form
        event.reply('reset-form')

    } catch (error) {
        console.log(error)
    }
})