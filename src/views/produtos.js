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

let caminhoImagem

async function uploadImage() {
    caminhoImagem = await api.selecionarArquivo()
    console.log(caminhoImagem)
    imagem.src = `file://${caminhoImagem}`
}

formProduto.addEventListener('submit', async (event) => {
    event.preventDefault()

    console.log(idProduto.value, barcodeProduto.value, nomeProduto.value, caminhoImagem, precoProduto.value)

    const produto = {
        idPro: idProduto.value || undefined,
        barcodePro: barcodeProduto.value,
        nomePro: nomeProduto.value,
        caminhoImagemPro: caminhoImagem ? caminhoImagem : "",
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

function buscarProduto() {
    let proNome = document.getElementById('searchProduct').value.trim()

    if (proNome === "") {
        window.api.validarBusca()
        return
    }

    buscarProdutoGenerico('nomeProduto', proNome, api.buscarProduto, api.renderizarProduto)
}

function buscarProdutoBar() {
    let proBar = document.getElementById('searchBarcode').value.trim()

    if (proBar === "") {
        window.api.validarBusca()
        return
    }

    buscarProdutoGenerico('barcodeProduto', proBar, api.buscarProdutoBar, api.renderizarProdutoBar)
}

function excluirProduto() {
    api.deletarProduto(idProduto.value)
}

api.resetarFormulario(() => {
    resetForm()
})

function resetForm() {
    location.reload()
}