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

// Importação do Schema Fornecedores da camada model
const fornecedorModel = require('./src/models/Fornecedores.js')

// Importação do Schema Produtos da camada model
const produtoModel = require('./src/models/Produtos')

// Janela principal
let win
function createWindow() {
    nativeTheme.themeSource = 'dark'
    win = new BrowserWindow({
        width: 1010,
        height: 720,
        resizable: false, // Impede redimensionamento
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // Menu personalizado (comentar para debugar)
    // Menu.setApplicationMenu(Menu.buildFromTemplate(template))

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
    let about
    nativeTheme.themeSource = 'dark'
    const main = BrowserWindow.getFocusedWindow()
    if (main) {
        about = new BrowserWindow({
            width: 360,
            height: 215,
            autoHideMenuBar: true,
            resizable: false, // Impede redimensionamento
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
            height: 800,
            resizable: false, // Impede redimensionamento
            //autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    //client.maximize()

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
            resizable: false, // Impede redimensionamento
            //autoHideMenuBar: true,
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
            resizable: false, // Impede redimensionamento
            //autoHideMenuBar: true,
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
            resizable: false, // Impede redimensionamento
            //autoHideMenuBar: true,
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
    createWindow()
    // Melhor local para estabelecer a conexão com o banco de dados
    // Importar antes o módulo de conexão no início do código
    // No MongoDB é mais eficiente manter uma única conexão aberta durante todo o tempo de vida do aplicativo e usá-la quando necessário. Fechar e reabrir constantemente a conexão aumenta a sobrecarga e reduz o desempenho do servidor.
    // Conexão com o banco ao iniciar a aplicação
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
                type: 'separator'
            },
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
                role: 'zoomIn'
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
/***********************************************/
/****************** Clientes ******************/
/*********************************************/

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Recebimento dos dados de formulário clientes.
ipcMain.on('new-client', async (event, cliente) => {
    // Teste de recebimento dos dados (Passo 2 - slide) Importante!
    console.log(cliente)
    // Passo 3 - slide (cadastrar os dados no banco de dados).
    try {
        // Criar um novo objeto usando a classe modelo.
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
        // A linha abaixo usa a biblioteca moongoose para salvar
        await novoCliente.save()

        // Confirmação de cliente adicionado no banco
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Cliente adicionado com sucesso!",
            buttons: ['OK']
        })
        // Enviar uma resposta para o renderizador resetar o form.
        event.reply('reset-form')
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('dialog-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: 'Atenção!',
        message: 'Preencha um nome no campo de busca.',
        buttons: ['OK']
    })
})

ipcMain.on('search-client', async (event, cliNome) => {
    // Teste de recebimento do nome do cliente a ser pesquisado(passo 2).
    console.log(cliNome)
    //Passos 3 e 4 - Pesquisar no banco de dados o cliente pelo nome.
    // find() -> buscar no banco de dados (mongoose).
    // RegExp -> filtro pelo nome do cliente 'i' insensitive (maiúsculo ou minúsculo).
    // Atenção: nomeCliente -> model | cliNome -> renderizador.
    try {
        const dadosCliente = await clienteModel.find({
            nomeCliente: new RegExp(cliNome, 'i')
        })
        console.log(dadosCliente) // Teste dos passos 3 e 4.
        // Passo 5 - slide -> enviar os dados do cliente para o renderizador (JSON.stringfy converte para JSON).

        // Melhoria na experiência do usuário (se não existir o cliente cadstrado, enviar mensagem e questionar se o usuário deseja cadastrar um novo cliente).
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
                    // Enviar ao renderizador um pedido para setar o nome do cliente (trazendo do campo de busca) e liberar o botão adicionar.
                    event.reply('set-nameClient')
                } else {
                    // Enviar ao renderizador um pedido para limpar os campos do formulário.
                    event.reply('reset-form')
                }
            })
        }
        event.reply('client-data', JSON.stringify(dadosCliente))
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('delete-client', async (event, idCliente) => {
    // Teste de recebimento do id do cliente (passo 2 - slide)
    console.log(idCliente)
    // Confirmação antes de excluir o cliente (IMPORTANTE!)
    // Client é a variável ref a janela de clientes.
    const { response } = await dialog.showMessageBox(client, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'], //[0,1]
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir este cliente?'
    })
    // Apoio a lógica.
    console.log(response)
    if (response === 1) {
        // Passo 3 slide.
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
// Fim do CRUD Delete <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('update-client', async (event, cliente) => {
    // Teste de recebimento dos dados do cliente (passo 2).
    console.log(cliente)
    try {
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
            {
                new: true
            }
        )
    } catch (error) {
        console.log(error)
    }
    dialog.showMessageBox(client, {
        type: 'info',
        message: 'Dados do cliente alterados com sucesso!',
        buttons: ['OK']
    }).then((result) => {
        if (result.response === 0) {
            event.reply('reset-form')
        }
    })
})
// Fim do CRUD Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

/***********************************************/
/**************** Fornecedores ****************/
/*********************************************/

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Recebimento dos dados de formulário fornecedores.
ipcMain.on('new-supplier', async (event, fornecedor) => {
    // Teste de recebimento dos dados (Passo 2 - slide) Importante!
    console.log(fornecedor)

    // Passo 3 - slide (cadastrar os dados no banco de dados)
    try {
        // Criar um novo objeto usando a classe modelo
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
        // A linha abaixo usa a biblioteca mongoose para salvar
        await novoFornecedor.save()

        // Confirmação de fornecedor adicionado no banco de dados
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Fornecedor adicionado com sucesso!",
            buttons: ['OK']
        })
        // Enviar uma resposta para o renderizador resetar o form.
        event.reply('reset-form')
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('dialog-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: 'Atenção!',
        message: 'Preencha um nome no campo de busca.',
        buttons: ['OK']
    })
})

ipcMain.on('search-supplier', async (event, forNome) => {
    // Teste de recebimento do nome do fornecedor a ser pesquisado(passo 2)
    console.log(forNome)
    // Passos 3 e 4 - pesquisar no banco de dados o fornecedor pelo nome
    // find() -> buscar no banco de dados (moongose)
    // RegExp -> filtro pelo nome do fornecedor 'i' insensitive (maiúsculo ou minúsculo)
    // Atenção: nomeFornecedor -> model | forNome -> renderizador
    try {
        const dadosFornecedor = await fornecedorModel.find({
            nomeFornecedor: new RegExp(forNome, 'i')
        })
        console.log(dadosFornecedor) // Testes dos passos 3 e 4
        // Passo 5 - slide -> enviar os dados do fornecedor para o renderizador (JSON.stringfy converte para JSON).

        // Melhoria na experiência do usuário (se não existir o fornecedor cadstrado, enviar mensagem e questionar se o usuário deseja cadastrar um novo fornecedor).
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
                    // Enviar ao renderizador um pedido para setar o nome do fornecedor (trazendo do campo de busca) e liberar o botão adicionar.
                    event.reply('set-nameSupplier')
                } else {
                    // Enviar ao renderizador um pedido para limpar os campos do formulário.
                    event.reply('reset-form')
                }
            })
        }

        event.reply('supplier-data', JSON.stringify(dadosFornecedor))
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('delete-supplier', async (event, idFornecedor) => {
    // Teste de recebimento do id do fornecedor (passo 2 - slide)
    console.log(idFornecedor)
    // Confirmação antes de excluir o fornecedor (IMPORTANTE!)
    // Supplier é a variável ref a janela de fornecedores
    const { response } = await dialog.showMessageBox(supplier, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'], //[0,1]
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir este fornecedor?'
    })
    // Apoio a lógica
    console.log(response)
    if (response === 1) {
        // Passo 3 slide
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
// Fim do CRUD Delete <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('update-supplier', async (event, fornecedor) => {
    // Teste de recebimento dos dados do fornecedor (passo 2).
    console.log(fornecedor)
    try {
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
            {
                new: true
            }
        )
    } catch (error) {
        console.log(error)
    }
    dialog.showMessageBox(supplier, {
        type: 'info',
        message: 'Dados do fornecedor alterados com sucesso!',
        buttons: ['OK']
    }).then((result) => {
        if (result.response === 0) {
            event.reply('reset-form')
        }
    })
})
// Fim do CRUD Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

/***********************************************/
/****************** Produtos ******************/
/*********************************************/

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Recebimento dos dados de formulário produtos.
ipcMain.on('new-product', async (event, produto) => {
    // Teste de recebimento dos dados (Passo 2 - slide) Importante!
    console.log(produto)
    // Passo 3 - slide (cadastrar os dados no banco de dados).
    try {
        // Criar um novo objeto usando a classe modelo.
        const novoProduto = new produtoModel({
            nomeProduto: produto.nomePro,
            codProduto: produto.codPro,
            precoProduto: produto.precoPro
        })
        // A linha abaixo usa a biblioteca mongoose para salvar.
        await novoProduto.save()

        // Confirmação de cliente adicionado no banco de dados.
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Produto adicionado com sucesso!",
            buttons: ['OK']
        })
        // Enviar uma resposta para o renderizador resetar o form.
        event.reply('reset-form')
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('dialog-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: 'Atenção!',
        message: 'Preencha um nome no campo de busca.',
        buttons: ['OK']
    })
})

ipcMain.on('search-product', async (event, proNome) => {
    // Teste de recebimento do nome do produto a ser pesquisado(passo 2).
    console.log(proNome)
    // Passos 3 e 4 - pesquisar no banco de dados o produto pelo nome.
    // find() -> buscar no banco de dados (moongose).
    // RegExp -> filtro pelo nome do produto 'i' insensitive (maiúsculo ou minúsculo).
    // Atenção: nomeProduto -> model | proNome -> renderizador.
    try {
        const dadosProduto = await produtoModel.find({
            nomeProduto: new RegExp(proNome, 'i')
        })
        console.log(dadosProduto) // Testes dos passos 3 e 4.
        // Passo 5 - slide -> enviar os dados do produto para o renderizador (JSON.stringfy converte para JSON).

        // Melhoria na experiência do usuário (se não existir o produto cadstrado, enviar mensagem e questionar se o usuário deseja cadastrar um novo produto).
        if (dadosProduto.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Produtos',
                message: 'Produto não cadastrado.\nDeseja cadastrar este produto?',
                defaultId: 0,
                buttons: ['Sim', 'Não']
            }).then((result) => {
                console.log(result)
                if (result.response === 0) {
                    // Enviar ao renderizador um pedido para setar o nome do produto (trazendo do campo de busca) e liberar o botão adicionar.
                    event.reply('set-nameProduct')
                } else {
                    // Enviar ao renderizador um pedido para limpar os campos do formulário.
                    event.reply('reset-form')
                }
            })
        }
        event.reply('product-data', JSON.stringify(dadosProduto))
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('dialog-search', () => {
    dialog.showMessageBox({
        type: 'warning',
        title: 'Atenção!',
        message: 'Preencha um nome no campo de busca.',
        buttons: ['OK']
    })
})

ipcMain.on('search-product', async (event, proCod) => {
    // Teste de recebimento do nome do produto a ser pesquisado(passo 2).
    console.log(proCod)
    // Passos 3 e 4 - pesquisar no banco de dados o produto pelo nome.
    // find() -> buscar no banco de dados (moongose).
    // RegExp -> filtro pelo nome do produto 'i' insensitive (maiúsculo ou minúsculo).
    // Atenção: codProduto -> model | proCod -> renderizador.
    try {
        const dadosProdutoCod = await produtoModel.find({
            codProduto: new RegExp(proCod, 'i')
        })
        console.log(dadosProdutoCod) // Testes dos passos 3 e 4.
        // Passo 5 - slide -> enviar os dados do produto para o renderizador (JSON.stringfy converte para JSON).

        // Melhoria na experiência do usuário (se não existir o produto cadstrado, enviar mensagem e questionar se o usuário deseja cadastrar um novo produto).
        if (dadosProdutoCod.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Produtos',
                message: 'Produto não cadastrado.\nDeseja cadastrar este produto?',
                defaultId: 0,
                buttons: ['Sim', 'Não']
            }).then((result) => {
                console.log(result)
                if (result.response === 0) {
                    // Enviar ao renderizador um pedido para setar o nome do produto (trazendo do campo de busca) e liberar o botão adicionar.
                    event.reply('set-nameProduct')
                } else {
                    // Enviar ao renderizador um pedido para limpar os campos do formulário.
                    event.reply('reset-form')
                }
            })
        }
        event.reply('product-data', JSON.stringify(dadosProdutoCod))
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<