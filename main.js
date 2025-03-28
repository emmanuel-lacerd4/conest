/**
 * Processo principal
 */

const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog, globalShortcut } = require('electron/main')
const path = require('node:path')

// Importação do módulo de conexão.
const { conectar, desconectar } = require('./database.js')

// Importação do Schema Clientes da camada model.
const clienteModel = require('./src/models/Clientes.js')

// Importação do Schema Fornecedores da camada model.
const fornecedorModel = require('./src/models/Fornecedores.js')

// Importação do Schema Produtos da camada model.
const produtoModel = require('./src/models/Produtos')

// Importar biblioteca nativa do JS para manipular arquivos.
const fs = require('fs')

// Importar a biblioteca jspdf (instalar antes usando o npm i jspdf).
const { jspdf, default: jsPDF } = require('jspdf')

// Janela principal
let win
function createWindow() {
    nativeTheme.themeSource = 'dark'
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

    win.loadFile('./src/views/index.html')

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
    let about
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        about = new BrowserWindow({
            width: 854,
            height: 480,
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
let client
function clientWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        client = new BrowserWindow({
            width: 1280,
            height: 720,
            resizable: false,
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    client.maximize()

    client.loadFile('./src/views/clientes.html')
}

// Janela fornecedores
let supplier
function supplierWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        supplier = new BrowserWindow({
            width: 1280,
            height: 720,
            resizable: false,
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    supplier.maximize()

    supplier.loadFile('./src/views/fornecedores.html')
}

// Janela produtos
let product
function productWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        product = new BrowserWindow({
            width: 1280,
            height: 720,
            resizable: false,
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    product.maximize()

    product.loadFile('./src/views/produtos.html')
}

// Janela relatórios
let report
function reportWindow() {
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        report = new BrowserWindow({
            width: 1280,
            height: 720,
            resizable: false,
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    report.maximize()

    report.loadFile('./src/views/relatorios.html')
}

app.whenReady().then(() => {
    globalShortcut.register('Ctrl+Shift+I', () => {
        const tools = BrowserWindow.getFocusedWindow()
        if (tools) {
            tools.webContents.openDevTools()
        }
    })

    app.on('will-quit', () => {
        globalShortcut.unregisterAll()
    })

    createWindow()
    ipcMain.on('db-connect', async (event) => {
        await conectar()
        setTimeout(() => {
            event.reply('db-message', "conectado")
        }, 500)
    })

    app.on('before-quit', async () => {
        await desconectar()
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

app.commandLine.appendSwitch('log-level', '3')

const template = [
    {
        label: 'Cadastro',
        submenu: [
            { label: 'Clientes', click: () => clientWindow() },
            { label: 'Fornecedores', click: () => supplierWindow() },
            { label: 'Produtos', click: () => productWindow() },
            { type: 'separator' },
            { label: 'Sair', accelerator: 'Alt+F4', click: () => app.quit() }
        ]
    },
    {
        label: 'Relatórios',
        submenu: [
            { label: 'Clientes', click: () => gerarRelatorioClientes() },
            { label: 'Fornecedores', click: () => gerarRelatorioFornecedores() },
            { label: 'Produtos', click: () => gerarRelatorioProdutos() }
        ]
    },
    {
        label: 'Zoom',
        submenu: [
            { label: 'Aplicar zoom', role: 'zoomIn' },
            { label: 'Reduzir', role: 'zoomOut' },
            { label: 'Restaurar o zoom padrão', role: 'resetZoom' }
        ]
    },
    {
        label: 'Ajuda',
        submenu: [
            { label: 'Repositório', click: () => shell.openExternal('https://github.com/emmanuel-lacerd4/conest') },
            { label: 'Sobre', click: () => aboutWindow() }
        ]
    }
]

/***********************************************/
/****************** Validações *****************/
/***********************************************/

ipcMain.on('dialog-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: 'Atenção!',
        message: 'Preencha o campo de busca.',
        buttons: ['OK']
    })
})

/***********************************************/
/****************** Clientes *******************/
/***********************************************/

ipcMain.on('notice-client', () => {
    dialog.showMessageBox({
        type: 'info',
        title: "Atenção!",
        message: "Pesquise um cliente antes de continuar.",
        buttons: ['OK']
    })
})

// CRUD Create
ipcMain.on('new-client', async (event, cliente) => {
    console.log(cliente)
    try {
        const novoCliente = new clienteModel({
            nomeCliente: cliente.nomeCli,
            cpfCliente: cliente.cpfCli,
            foneCliente: cliente.foneCli,
            emailCliente: cliente.emailCli,
            cepCliente: cliente.cepCli,
            cidadeCliente: cliente.cidadeCli,
            estadoCliente: cliente.estadoCli,
            enderecoCliente: cliente.enderecoCli,
            numeroCliente: cliente.numeroCli,
            complementoCliente: cliente.complementoCli,
            bairroCliente: cliente.bairroCli
        })
        await novoCliente.save()
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Cliente cadastrado com sucesso!",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        if (error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "O CPF já está cadastrado.\nVerifique se digitou corretamente.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('clear-cpf')
                }
            })
        } else {
            console.log(error)
        }
    }
})

// CRUD Read
ipcMain.on('search-client', async (event, cliNome) => {
    console.log(cliNome)
    try {
        const dadosCliente = await clienteModel.find({
            nomeCliente: new RegExp(cliNome, 'i')
        })
        console.log(dadosCliente)
        if (dadosCliente.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Clientes',
                message: 'Cliente não cadastrado.\nDeseja cadastrar este cliente?',
                defaultId: 0,
                buttons: ['Sim', 'Não']
            }).then((result) => {
                console.log(result)
                if (result.response === 0) {
                    event.reply('set-nameClient')
                } else {
                    event.reply('reset-form')
                }
            })
        }
        event.reply('client-data', JSON.stringify(dadosCliente))
    } catch (error) {
        console.log(error)
    }
})

// CRUD Delete
ipcMain.on('delete-client', async (event, idCliente) => {
    console.log(idCliente)
    const { response } = await dialog.showMessageBox(client, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'],
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir este cliente?'
    })
    console.log(response)
    if (response === 1) {
        try {
            const clienteExcluido = await clienteModel.findByIdAndDelete(idCliente)
            dialog.showMessageBox({
                type: 'info',
                title: 'Aviso',
                message: 'Cliente excluído com sucesso!',
                buttons: ['OK']
            })
            event.reply('reset-form')
        } catch (error) {
            console.log(error)
        }
    }
})

// CRUD Update
ipcMain.on('update-client', async (event, cliente) => {
    console.log("Dados recebidos para atualização (cliente):", cliente)
    try {
        const clienteExistente = await clienteModel.findOne({
            cpfCliente: cliente.cpfCli,
            _id: { $ne: cliente.idCli }
        })
        if (clienteExistente) {
            dialog.showMessageBox(client, {
                type: 'error',
                title: "Atenção!",
                message: "O CPF informado já está cadastrado para outro cliente.\nVerifique se digitou corretamente.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('clear-cpf')
                }
            })
            return
        }

        const clienteEditado = await clienteModel.findByIdAndUpdate(
            cliente.idCli, {
            nomeCliente: cliente.nomeCli,
            cpfCliente: cliente.cpfCli,
            foneCliente: cliente.foneCli,
            emailCliente: cliente.emailCli,
            cepCliente: cliente.cepCli,
            cidadeCliente: cliente.cidadeCli,
            estadoCliente: cliente.estadoCli,
            enderecoCliente: cliente.enderecoCli,
            numeroCliente: cliente.numeroCli,
            complementoCliente: cliente.complementoCli,
            bairroCliente: cliente.bairroCli
        },
            { new: true }
        )

        console.log("Cliente atualizado:", clienteEditado)
        dialog.showMessageBox(client, {
            type: 'info',
            message: 'Dados do cliente alterados com sucesso!',
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log("Erro ao atualizar cliente:", error)
        dialog.showMessageBox(client, {
            type: 'error',
            title: "Erro",
            message: "Erro ao atualizar cliente: " + error.message,
            buttons: ['OK']
        })
    }
})

/***********************************************/
/**************** Fornecedores ****************/
/*********************************************/

ipcMain.on('url-site', (event, site) => {
    let url = site.url
    shell.openExternal(url)
})

// CRUD Create
ipcMain.on('new-supplier', async (event, fornecedor) => {
    console.log("Dados recebidos do frontend:", fornecedor)
    try {
        const fornecedorExistente = await fornecedorModel.findOne({ cnpjFornecedor: fornecedor.cnpjFor })
        if (fornecedorExistente) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "CNPJ já está cadastrado.\nVerifique se digitou corretamente.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('clear-cnpj')
                }
            })
            return
        }
        const novoFornecedor = new fornecedorModel({
            nomeFornecedor: fornecedor.nomeFor,
            cnpjFornecedor: fornecedor.cnpjFor,
            foneFornecedor: fornecedor.foneFor,
            siteFornecedor: fornecedor.siteFor,
            cepFornecedor: fornecedor.cepFor,
            cidadeFornecedor: fornecedor.cidadeFor,
            estadoFornecedor: fornecedor.estadoFor,
            enderecoFornecedor: fornecedor.enderecoFor,
            numeroFornecedor: fornecedor.numeroFor,
            complementoFornecedor: fornecedor.complementoFor,
            bairroFornecedor: fornecedor.bairroFor
        })
        await novoFornecedor.save()
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Fornecedor cadastrado com sucesso!",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log("Erro ao cadastrar fornecedor:", error)
        dialog.showMessageBox({
            type: 'error',
            title: "Erro",
            message: "Erro ao cadastrar fornecedor: " + error.message,
            buttons: ['OK']
        })
    }
})

// CRUD Read
ipcMain.on('search-supplier', async (event, forNome) => {
    console.log(forNome)
    try {
        const dadosFornecedor = await fornecedorModel.find({
            nomeFornecedor: new RegExp(forNome, 'i')
        })
        console.log(dadosFornecedor)
        if (dadosFornecedor.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Fornecedor',
                message: 'Fornecedor não cadastrado.\nDeseja cadastrar este fornecedor?',
                defaultId: 0,
                buttons: ['Sim', 'Não']
            }).then((result) => {
                console.log(result)
                if (result.response === 0) {
                    event.reply('set-nameSupplier')
                } else {
                    event.reply('reset-form')
                }
            })
        }
        event.reply('supplier-data', JSON.stringify(dadosFornecedor))
    } catch (error) {
        console.log(error)
    }
})

// CRUD Delete
ipcMain.on('delete-supplier', async (event, idFornecedor) => {
    console.log(idFornecedor)
    const { response } = await dialog.showMessageBox(supplier, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'],
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir este fornecedor?'
    })
    console.log(response)
    if (response === 1) {
        try {
            const fornecedorExcluido = await fornecedorModel.findByIdAndDelete(idFornecedor)
            dialog.showMessageBox({
                type: 'info',
                title: 'Aviso',
                message: 'Fornecedor excluído com sucesso!',
                buttons: ['OK']
            })
            event.reply('reset-form')
        } catch (error) {
            console.log(error)
        }
    }
})

// CRUD Update
ipcMain.on('update-supplier', async (event, fornecedor) => {
    console.log("Dados recebidos para atualização (fornecedor):", fornecedor)
    try {
        const fornecedorExistente = await fornecedorModel.findOne({
            cnpjFornecedor: fornecedor.cnpjFor,
            _id: { $ne: fornecedor.idFor }
        })
        if (fornecedorExistente) {
            dialog.showMessageBox(supplier, {
                type: 'error',
                title: "Atenção!",
                message: "O CNPJ informado já está cadastrado para outro fornecedor.\nVerifique se digitou corretamente.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('clear-cnpj')
                }
            })
            return
        }
        const fornecedorEditado = await fornecedorModel.findByIdAndUpdate(
            fornecedor.idFor, {
            nomeFornecedor: fornecedor.nomeFor,
            cnpjFornecedor: fornecedor.cnpjFor,
            foneFornecedor: fornecedor.foneFor,
            siteFornecedor: fornecedor.siteFor,
            cepFornecedor: fornecedor.cepFor,
            cidadeFornecedor: fornecedor.cidadeFor,
            estadoFornecedor: fornecedor.estadoFor,
            enderecoFornecedor: fornecedor.enderecoFor,
            numeroFornecedor: fornecedor.numeroFor,
            complementoFornecedor: fornecedor.complementoFor,
            bairroFornecedor: fornecedor.bairroFor
        },
            { new: true }
        )
        console.log("Fornecedor atualizado:", fornecedorEditado)
        dialog.showMessageBox(supplier, {
            type: 'info',
            message: 'Dados do fornecedor alterados com sucesso!',
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log("Erro ao atualizar fornecedor:", error)
        dialog.showMessageBox(supplier, {
            type: 'error',
            title: "Erro",
            message: "Erro ao atualizar fornecedor: " + error.message,
            buttons: ['OK']
        })
    }
})

ipcMain.handle('get-all-suppliers', async () => {
    try {
        const fornecedores = await fornecedorModel.find({}, 'nomeFornecedor').sort({ nomeFornecedor: 1 })
        return fornecedores.map(f => f.nomeFornecedor)
    } catch (error) {
        console.error('Erro ao buscar fornecedores:', error)
        return []
    }
})

/********************************************/
/**************** Produtos  *****************/
/********************************************/

// CRUD Create
ipcMain.handle('open-file-dialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "Selecionar imagem",
        properties: ['openFile'],
        filters: [
            {
                name: 'Imagens',
                extensions: ['png', 'jpg', 'jpeg', 'jfif']
            }
        ]
    })

    if (canceled === true || filePaths.length === 0) {
        return null
    } else {
        return filePaths[0]
    }
})

ipcMain.on('new-product', async (event, produto) => {
    console.log("Dados recebidos do frontend (produto):", produto)
    let caminhoImagemSalvo = ""
    try {
        if (produto.caminhoImagemProduto) {
            const uploadDir = path.join(__dirname, 'uploads')
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir)
            }
            const fileName = `${Date.now()}_${path.basename(produto.caminhoImagemProduto)}`
            const uploads = path.join(uploadDir, fileName)
            fs.copyFileSync(produto.caminhoImagemProduto, uploads)
            caminhoImagemSalvo = uploads
        }
        const novoProduto = new produtoModel({
            barcodeProduto: produto.barcodeProduto,
            nomeProduto: produto.nomeProduto,
            caminhoImagemProduto: caminhoImagemSalvo,
            dataCadastro: produto.dataCadastro,
            precoProduto: produto.precoProduto,
            nomeFornecedor: produto.nomeFornecedor,
            quantidadeProduto: produto.quantidadeProduto,
            unidadeProduto: produto.unidadeProduto
        })
        await novoProduto.save()
        dialog.showMessageBox({
            type: 'info',
            title: 'Aviso',
            message: 'Produto cadastrado com sucesso.',
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        if (error.code === 11000) {
            dialog.showMessageBox({
                type: 'error',
                title: "Atenção!",
                message: "O Código de Barras já está cadastrado.\nVerifique se escaneou o código corretamente.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('clear-barcode')
                }
            })
        } else {
            console.log("Erro ao cadastrar produto:", error)
            dialog.showMessageBox({
                type: 'error',
                title: "Erro",
                message: "Erro ao cadastrar produto: " + error.message,
                buttons: ['OK']
            })
        }
    }
})

// CRUD Read
ipcMain.on('search-product', async (event, barcode) => {
    try {
        const dadosProduto = await produtoModel.find({ barcodeProduto: barcode })
        if (dadosProduto.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Produtos',
                message: 'Produto não cadastrado.\nDeseja cadastrar este produto?',
                defaultId: 0,
                buttons: ['Sim', 'Não']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('set-barcode')
                } else {
                    event.reply('reset-form')
                }
            })
        } else {
            event.reply('product-data', JSON.stringify(dadosProduto))
        }
    } catch (error) {
        console.log(error)
    }
})

ipcMain.on('search-name', async (event, proNome) => {
    try {
        const dadosProduto = await produtoModel.find({
            nomeProduto: new RegExp(proNome, 'i')
        })
        if (dadosProduto.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Produtos',
                message: 'Produto não cadastrado.\nDeseja cadastrar este produto?',
                defaultId: 0,
                buttons: ['Sim', 'Não']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('set-nameProduct')
                } else {
                    event.reply('reset-form')
                }
            })
        } else {
            event.reply('product-data-name', JSON.stringify(dadosProduto))
        }
    } catch (error) {
        console.log(error)
    }
})

// CRUD Update
ipcMain.on('update-product', async (event, produto) => {
    console.log("Dados recebidos para atualização (produto):", produto)
    try {
        const produtoExistente = await produtoModel.findOne({
            barcodeProduto: produto.barcodeProduto,
            _id: { $ne: produto._id }
        })
        if (produtoExistente) {
            dialog.showMessageBox(product, {
                type: 'error',
                title: "Atenção!",
                message: "O Código de Barras informado já está cadastrado para outro produto.\nVerifique se digitou corretamente.",
                buttons: ['OK']
            }).then((result) => {
                if (result.response === 0) {
                    event.reply('clear-barcode')
                }
            })
            return
        }
        let produtoEditado
        if (!produto.caminhoImagemProduto) {
            produtoEditado = await produtoModel.findByIdAndUpdate(
                produto._id, {
                barcodeProduto: produto.barcodeProduto,
                nomeProduto: produto.nomeProduto,
                precoProduto: produto.precoProduto,
                nomeFornecedor: produto.nomeFornecedor,
                quantidadeProduto: produto.quantidadeProduto,
                unidadeProduto: produto.unidadeProduto
            }, { new: true })
        } else {
            const uploadDir = path.join(__dirname, 'uploads')
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir)
            }
            const fileName = `${Date.now()}_${path.basename(produto.caminhoImagemProduto)}`
            const uploads = path.join(uploadDir, fileName)
            fs.copyFileSync(produto.caminhoImagemProduto, uploads)
            produtoEditado = await produtoModel.findByIdAndUpdate(
                produto._id, {
                barcodeProduto: produto.barcodeProduto,
                nomeProduto: produto.nomeProduto,
                caminhoImagemProduto: uploads,
                precoProduto: produto.precoProduto,
                nomeFornecedor: produto.nomeFornecedor,
                quantidadeProduto: produto.quantidadeProduto,
                unidadeProduto: produto.unidadeProduto
            }, { new: true })
        }
        console.log("Produto atualizado:", produtoEditado)
        dialog.showMessageBox(product, {
            type: 'info',
            message: 'Dados do produto alterados com sucesso.',
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log("Erro ao atualizar produto:", error)
        dialog.showMessageBox(product, {
            type: 'error',
            title: "Erro",
            message: "Erro ao atualizar produto: " + error.message,
            buttons: ['OK']
        })
    }
})

// CRUD Delete
ipcMain.on('delete-product', async (event, idProduto) => {
    console.log("ID do produto a ser deletado:", idProduto)
    const { response } = await dialog.showMessageBox(product, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'],
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir este produto?'
    })
    if (response === 1) {
        try {
            const produtoExcluido = await produtoModel.findByIdAndDelete(idProduto)
            dialog.showMessageBox({
                type: 'info',
                title: 'Aviso',
                message: 'Produto excluído com sucesso',
                buttons: ['OK']
            })
            event.reply('reset-form')
        } catch (error) {
            console.log("Erro ao excluir produto:", error)
        }
    }
})

/********************************************/
/**************** Relatórios ****************/
/********************************************/

async function gerarRelatorioClientes() {
    try {
        const clientes = await clienteModel.find().sort({ nomeCliente: 1 })
        console.log(clientes)
        const doc = new jsPDF('p', 'mm', 'a4')
        doc.setFontSize(16)
        doc.text("Relatório de Clientes", 16, 10)
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)
        let y = 45
        doc.text("Nome", 14, y)
        doc.text("Celular", 80, y)
        doc.text("E-mail", 130, y)
        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)
        y += 10
        clientes.forEach((c) => {
            if (y > 250) {
                doc.addPage()
                y = 20
            }
            doc.text(c.nomeCliente, 14, y)
            doc.text(c.foneCliente, 80, y)
            doc.text(c.emailCliente || "N/A", 130, y)
            y += 10
        })
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'clientes.pdf')
        doc.save(filePath)
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}

async function gerarRelatorioFornecedores() {
    try {
        const fornecedores = await fornecedorModel.find().sort({ nomeFornecedor: 1 })
        console.log(fornecedores)
        const doc = new jsPDF('p', 'mm', 'a4')
        doc.setFontSize(16)
        doc.text("Relatório de Fornecedores", 16, 10)
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)
        let y = 45
        doc.text("Nome", 14, y)
        doc.text("Celular", 80, y)
        doc.text("Site", 130, y)
        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)
        y += 10
        fornecedores.forEach((c) => {
            if (y > 250) {
                doc.addPage()
                y = 20
            }
            doc.text(c.nomeFornecedor, 14, y)
            doc.text(c.foneFornecedor, 80, y)
            doc.text(c.siteFornecedor || "N/A", 130, y)
            y += 10
        })
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'fornecedores.pdf')
        doc.save(filePath)
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}

async function gerarRelatorioProdutos() {
    try {
        const produtos = await produtoModel.find().sort({ nomeProduto: 1 })
        console.log(produtos)
        const doc = new jsPDF('p', 'mm', 'a4')
        doc.setFontSize(16)
        doc.text("Relatório de Produtos", 16, 10)
        const dataAtual = new Date().toLocaleDateString('pt-BR')
        doc.setFontSize(12)
        doc.text(`Data: ${dataAtual}`, 160, 10)
        let y = 45
        doc.text("Código de Barras", 14, y)
        doc.text("Produto", 80, y)
        doc.text("Valor", 160, y)
        y += 5
        doc.setLineWidth(0.5)
        doc.line(10, y, 200, y)
        y += 10
        produtos.forEach((c) => {
            if (y > 250) {
                doc.addPage()
                y = 20
            }
            doc.text(c.barcodeProduto, 14, y)
            doc.text(c.nomeProduto, 80, y)
            doc.text(c.precoProduto || "N/A", 160, y)
            y += 10
        })
        const tempDir = app.getPath('temp')
        const filePath = path.join(tempDir, 'produtos.pdf')
        doc.save(filePath)
        shell.openPath(filePath)
    } catch (error) {
        console.log(error)
    }
}