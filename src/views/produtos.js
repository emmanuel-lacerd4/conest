/**
 * Processo de renderização da tela de Produtos
 * produtos.html
 */

const foco = document.getElementById('searchProduct')
const btnRead = document.getElementById('btnRead')

// Configuração inicial do formulário
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    foco.focus()
})

// Função para manipular o evento da tecla Enter
function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarProdutoBar()
    }
}

document.getElementById('frmProduct').addEventListener('keydown', teclaEnter)

let arrayProduto = []

// Captura dos inputs do formulário
let formProduto = document.getElementById('frmProduct')
let idProduto = document.getElementById('inputIdProduct')
let barcodeProduto = document.getElementById('inputBarcodeProduct')
let nomeProduto = document.getElementById('inputNameProduct')
let precoProduto = document.getElementById('inputPrecoProduct')
let imagem = document.getElementById('imageProductPreview')

let caminhoImagem = "" // Inicializa a variável para armazenar o caminho da imagem

// Função para fazer upload da imagem
async function uploadImage() {
    caminhoImagem = await api.selecionarArquivo()
    console.log("Caminho da imagem selecionada:", caminhoImagem)
    imagem.src = `file://${caminhoImagem}` // Atualiza a visualização da imagem no formulário
}

// Evento de submit do formulário
formProduto.addEventListener('submit', async (event) => {
    event.preventDefault()

    console.log("Dados do produto:", {
        id: idProduto.value,
        barcode: barcodeProduto.value,
        nome: nomeProduto.value,
        imagem: caminhoImagem,
        preco: precoProduto.value
    })

    const produto = {
        idPro: idProduto.value || undefined,
        barcodePro: barcodeProduto.value,
        nomePro: nomeProduto.value,
        caminhoImagemPro: caminhoImagem || "", // Usa o caminho da imagem selecionada ou uma string vazia
        precoPro: precoProduto.value
    }

    if (!produto.idPro) {
        console.log("Cadastrando novo produto:", produto)
        api.novoProduto(produto)
    } else {
        console.log("Editando produto existente:", produto)
        api.editarProduto(produto)
    }
})

let isSearching = false

btnRead.addEventListener('click', (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isSearching) {
        isSearching = true
        buscarProduto()
    }
})

// Função genérica para buscar produtos
function buscarProdutoGenerico(campo, valor, apiBusca, apiRenderiza) {
    if (valor !== "") {
        apiBusca(valor)
        apiRenderiza((event, dados) => {
            const renderizado = JSON.parse(dados)
            arrayProduto = renderizado
            if (arrayProduto.length === 0) {
                if (campo === 'nomeProduto') {
                    nomeProduto.value = valor
                    document.getElementById('searchProduct').value = ""
                    nomeProduto.focus()
                } else if (campo === 'barcodeProduto') {
                    barcodeProduto.value = valor
                    document.getElementById('searchBarcode').value = ""
                    barcodeProduto.focus()
                }
            } else {
                arrayProduto.forEach((c) => {
                    document.getElementById('inputIdProduct').value = c._id || "" // Preenchendo ID
                    document.getElementById('inputIdProduct').removeAttribute('readonly') // Tornando editável
                    document.getElementById('inputIdProduct').style.display = "block" // Tornando visível
                    document.getElementById('inputBarcodeProduct').value = c.barcodeProduto || ""
                    document.getElementById('inputNameProduct').value = c.nomeProduto || ""
                    document.getElementById('inputPrecoProduct').value = c.precoProduto || ""

                    // Atualiza a imagem do produto
                    if (c.caminhoImagemProduto) {
                        imagem.src = `file://${c.caminhoImagemProduto}`
                        caminhoImagem = c.caminhoImagemProduto // Atualiza o caminho da imagem para edição
                    } else {
                        imagem.src = "../public/img/camera.png" // Imagem padrão caso não haja imagem cadastrada
                        caminhoImagem = "" // Reseta o caminho da imagem
                    }

                    console.log("ID do produto encontrado:", c._id)

                    foco.value = ""
                    foco.disabled = true
                    btnRead.disabled = true
                    btnCreate.disabled = true
                    btnUpdate.disabled = false
                    btnDelete.disabled = false

                    document.getElementById('searchBarcode').value = ""
                    document.getElementById('searchBarcode').disabled = true
                    document.getElementById('searchProduct').value = ""
                    document.getElementById('searchProduct').disabled = true
                })
            }
            isSearching = false
        })
    } else {
        isSearching = false
    }
}

// Função para buscar produto por nome
function buscarProduto() {
    let proNome = document.getElementById('searchProduct').value.trim()

    if (proNome === "") {
        window.api.validarBusca()
        return
    }

    buscarProdutoGenerico('nomeProduto', proNome, api.buscarProduto, api.renderizarProduto)
}

// Função para buscar produto por código de barras
function buscarProdutoBar() {
    let proBar = document.getElementById('searchBarcode').value.trim()

    if (proBar === "") {
        window.api.validarBusca()
        return
    }

    buscarProdutoGenerico('barcodeProduto', proBar, api.buscarProdutoBar, api.renderizarProdutoBar)
}

// Função para excluir produto
function excluirProduto() {
    api.deletarProduto(idProduto.value)
}

// Função para resetar o formulário
api.resetarFormulario(() => {
    resetForm()
})

function resetForm() {
    location.reload()
}