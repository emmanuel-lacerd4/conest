/**
 * Processo principal
 */

const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain, dialog, globalShortcut } = require('electron/main')
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

// importar biblioteca nativa do JS para manipular arquivos.
const fs = require('fs')

// Janela principal
let win
function createWindow() {
    nativeTheme.themeSource = 'dark'
    win = new BrowserWindow({
        width: 1280,
        height: 720,
        resizable: false, // Impede redimensionamento
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    // Menu personalizado
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))

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
            width: 854,  // Largura
            height: 480,  // Altura
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
            height: 720,
            resizable: false, // Impede redimensionamento.
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    client.maximize() // Tela cheia.

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
            resizable: false, // Impede redimensionamento.
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    supplier.maximize() // Tela cheia.

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
            resizable: false, // Impede redimensionamento.
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    product.maximize() // Tela cheia.

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
            resizable: false, // Impede redimensionamento.
            autoHideMenuBar: true,
            parent: main,
            modal: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        })
    }
    report.maximize() // Tela cheia.

    report.loadFile('./src/views/relatorios.html')
}

app.whenReady().then(() => {
    //Registrar atalho global para devtools em qualquer janela ativa
    globalShortcut.register('Ctrl+Shift+I', () => {
        const tools = BrowserWindow.getFocusedWindow()
        if (tools) {
            tools.webContents.openDevTools()
        }
    })

    // Desregistrar atalho globais antes de sair
    app.on('will-quit', () => {
        globalShortcut.unregisterAll()
    })

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

// Reduzir logs não críticos (mensagens no console quando executar Devtools).
app.commandLine.appendSwitch('log-level', '3')

const template = [
    {
        label: 'Cadastro',
        submenu: [
            {
                label: 'Clientes',
                click: () => clientWindow()
            },
            {
                label: 'Fornecedores',
                click: () => supplierWindow()
            },
            {
                label: 'Produtos',
                click: () => productWindow()
            },
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
        label: 'Relatórios'
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
/****************** Validações *****************/
/***********************************************/

// Aviso para buscas em campo vazio.
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

// Informação (pop-up) ao abrir a janela.
ipcMain.on('notice-client', () => {
    dialog.showMessageBox({
        type: 'info',
        title: "Atenção!",
        message: "Pesquise um cliente antes de continuar.",
        buttons: ['OK']
    })
})

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
        // Confirmação do cliente cadastrado ao banco.
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Cliente cadastrado com sucesso!",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                // Enviar uma resposta para o renderizador resetar o form.
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

// Acessar site externo
ipcMain.on('url-site', (event, site) => {
    let url = site.url
    //console.log(url)
    shell.openExternal(url)
})

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

        // Confirmação de fornecedor cadastrado no Banco de Dados.
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Fornecedor cadastrado com sucesso!",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                // Enviar uma resposta para o renderizador resetar o form.
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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

/***********************************************/
/****************** Produtos ******************/
/*********************************************/

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Obter o caminho da imagem (executar o open dialog).
ipcMain.handle('open-file-dialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        title: "Selecionar imagem",
        properties: ['openFile'],
        filters: [
            {
                name: 'Imagens',
                extensions: ['png', 'jpg', 'jpeg']
            }
        ]
    })

    if (canceled === true || filePaths.length === 0) {
        return null
    } else {
        return filePaths[0] // Retorna o caminho do arquivo.
    }

})

ipcMain.on('new-product', async (event, produto) => {
    // Teste de recebimento dos dados produto.
    console.log(produto) // Teste do passo 2 (recebimento do produto).

    // Resolução de BUG (quando a imagem não for selecionada).
    let caminhoImagemSalvo = ""

    try {
        // Correção de BUG (validação de imagem).
        if (produto.caminhoImagemPro) {

            //============================================= (imagens #1)
            // Criar a pasta uploads se não existir.
            //__dirname (caminho absoluto).
            const uploadDir = path.join(__dirname, 'uploads')
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir)
            }

            //============================================= (imagens #2)
            // Gerar um nome único para o arquivo (para não sobrescrever).
            const fileName = `${Date.now()}_${path.basename(produto.caminhoImagemPro)}`
            const uploads = path.join(uploadDir, fileName)

            //============================================= (imagens #3)
            //Copiar o arquivo de imagem para pasta uploads.
            fs.copyFileSync(produto.caminhoImagemPro, uploads)

            //============================================= (imagens #4)
            // Alterar a variável caminhoImagemSalvo para uploads.
            caminhoImagemSalvo = uploads
        }
        // Cadastrar o produto no Banco de Dados.
        const novoProduto = new produtoModel({
            barcodeProduto: produto.barcodePro,
            nomeProduto: produto.nomePro,
            caminhoImagemProduto: caminhoImagemSalvo,
            precoProduto: produto.precoPro
        })
        // Adicionar o produto no Banco de Dados.
        await novoProduto.save()

        // Confirmação.
        dialog.showMessageBox({
            type: 'info',
            message: "Produto cadastrado com sucesso!",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Inicio do CRUD READ - Código de Barras >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-product', async (event, barcode) => {
    console.log(barcode) // Teste do passo 2.
    try {
        // Passos 3 e 4 (fluxo do slide).
        const dadosProduto = await produtoModel.find({
            barcodeProduto: barcode
        })
        console.log(dadosProduto) // Testes do passo 4.
        // Validação (se não existir produto cadastro).
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
                    // Enviar ao renderizador um pedido para setar o código de barras.
                    event.reply('set-barcode')
                } else {
                    // Enviar ao renderizador um pedido para limpar os campos do formulário.
                    event.reply('reset-form')
                }
            })
        }
        // Passo 5: fluxo (envio dos dados do produto ao renderizador).
        event.reply('product-data', JSON.stringify(dadosProduto))

    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD READ - Código de Barras <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read - Código de Barras >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('search-barcode', async (event, proBar) => {
    console.log(proBar) // Teste do passo 2.
    try {
        // Passo 3 e 4 (fluxo do slide).
        const dadosProdutoBar = await produtoModel.find({
            barcodeProduto: proBar
        })
        console.log(dadosProdutoBar) // Teste passo 4.
        // Validação (se não existir produto cadastrado).
        if (dadosProdutoBar.length === 0) {
            dialog.showMessageBox({
                type: 'warning',
                title: 'Produtos',
                message: 'Produto não cadastrado.\nDeseja cadastrar este produto?',
                defaultId: 0,
                buttons: ['Sim', 'Não']
            }).then((result) => {
                console.log(result)
                if (result.response === 0) {
                    // Enviar ao renderizador um pedido para setar o código de barras.
                    event.reply('set-barcode')
                } else {
                    // Enviar ao renderizador um pedido para limpar os campos do formulário.
                    event.reply('reset-form')
                }
            })
        }
        // Passo 5: fluxo (envio dos dados produto ao renderizador)
        event.reply('product-data-barcode', JSON.stringify(dadosProdutoBar))
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Read Código de Barras <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('delete-product', async (event, idProduto) => {
    // Teste de recebimento do id do produto (passo 2 - slide).
    console.log(idProduto)
    // Confirmação antes de excluir o produto (IMPORTANTE!).
    // product é a variável ref a janela de produtos.
    const { response } = await dialog.showMessageBox(product, {
        type: 'warning',
        buttons: ['Cancelar', 'Excluir'], //[0,1]
        title: 'Atenção!',
        message: 'Tem certeza que deseja excluir este produto?'
    })
    // Apoio a lógica.
    console.log(response)
    if (response === 1) {
        // Passo 3 slide
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
            console.log(error)
        }
    }

})
// Fim do CRUD Delete <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('update-product', async (event, produto) => {
    // Teste de recebimento dos dados do produto
    console.log("Dados recebidos para edição:", produto) // Verifique os dados recebidos

    try {
        // Verificar se uma nova imagem foi selecionada
        let caminhoImagemSalvo = produto.caminhoImagemPro || "" // Mantém o caminho atual se não houver nova imagem

        if (produto.caminhoImagemPro && produto.caminhoImagemPro !== "") {
            // Criar a pasta uploads se não existir
            const uploadDir = path.join(__dirname, 'uploads')
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir)
            }

            // Gerar um nome único para o arquivo (para não sobrescrever)
            const fileName = `${Date.now()}_${path.basename(produto.caminhoImagemPro)}`
            const uploads = path.join(uploadDir, fileName)

            // Copiar o arquivo de imagem para a pasta uploads
            fs.copyFileSync(produto.caminhoImagemPro, uploads)

            // Atualizar o caminho da imagem para o novo arquivo
            caminhoImagemSalvo = uploads
        }

        // Atualizar o produto no banco de dados
        const produtoEditado = await produtoModel.findByIdAndUpdate(
            produto.idPro, {
            nomeProduto: produto.nomePro,
            barcodeProduto: produto.barcodePro,
            caminhoImagemProduto: caminhoImagemSalvo, // Incluir o caminho da imagem
            precoProduto: produto.precoPro
        }, {
            new: true // Retorna o documento atualizado
        }
        )

        console.log("Produto editado com sucesso:", produtoEditado) // Verifique o produto editado

        // Confirmação
        dialog.showMessageBox({
            type: 'info',
            title: "Aviso",
            message: "Dados alterados com sucesso!",
            buttons: ['OK']
        }).then((result) => {
            if (result.response === 0) {
                event.reply('reset-form')
            }
        })
    } catch (error) {
        console.log(error)
    }
})
// Fim do CRUD Update <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<