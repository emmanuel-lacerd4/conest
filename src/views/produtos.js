/**
 * Processo de renderização da tela de Produtos
 * produtos.html
 */

// Captura dos elementos do DOM
const foco = document.getElementById('searchProduct')
const btnUpdate = document.getElementById('btnUpdate')
const btnDelete = document.getElementById('btnDelete')
const btnRead = document.getElementById('btnRead')
const btnCreate = document.getElementById('btnCreate')
const formProduto = document.getElementById('frmProduct')
const idProduto = document.getElementById('inputIdProduct')
const barcodeProduto = document.getElementById('inputBarcodeProduct')
const nomeProduto = document.getElementById('inputNameProduct')
const caminhoImagemProduto = document.getElementById('pathImageProduct')
const precoProduto = document.getElementById('inputPrecoProduct')

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
        buscarProdutoBar() // Busca pelo código de barras
    }
}

// Adicionando o evento da tecla Enter para o campo de código de barras
document.getElementById('searchBarcode').addEventListener('keydown', teclaEnter)

// Alterando a busca por nome para ser feita apenas ao clicar no botão de busca
btnRead.addEventListener('click', buscarProduto)

// Função para remover o manipulador do evento da tecla Enter
function restaurarEnter() {
    formProduto.removeEventListener('keydown', teclaEnter)
}

// Array usado nos métodos para manipulação da estrutura de dados
let arrayProduto = []

// CRUD Create/Update
formProduto.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (idProduto.value === "") {
        const produto = {
            barcodePro: barcodeProduto.value,
            nomePro: nomeProduto.value,
            precoPro: precoProduto.value
        }
        api.novoProduto(produto)
    } else {
        const produto = {
            idPro: idProduto.value,
            barcodePro: barcodeProduto.value,
            nomePro: nomeProduto.value,
            precoPro: precoProduto.value
        }
        api.editarProduto(produto)
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
                // Se não houver produtos, limpa o campo de busca e preenche o campo de nome do produto
                if (campo === 'nomeProduto') {
                    nomeProduto.value = valor // Preenche o campo de nome do produto com o valor da busca
                    document.getElementById('searchProduct').value = "" // Limpa o campo de busca
                    foco.focus() // Coloca o foco no campo de busca
                }
            } else {
                // Se houver produtos, preenche os campos do formulário
                arrayProduto.forEach((c) => {
                    nomeProduto.value = c.nomeProduto
                    barcodeProduto.value = c.barcodeProduto
                    precoProduto.value = c.precoProduto
                    idProduto.value = c._id
                    foco.value = ""
                    foco.disabled = true
                    btnRead.disabled = true
                    btnCreate.disabled = true
                    btnUpdate.disabled = false
                    btnDelete.disabled = false
                    restaurarEnter()
                    document.getElementById('searchBarcode').value = ""
                    document.getElementById('searchBarcode').disabled = true
                    document.getElementById('searchProduct').value = ""
                    document.getElementById('searchProduct').disabled = true
                })
            }
        })
    }
}

// CRUD Read
function buscarProduto() {
    let proNome = document.getElementById('searchProduct').value
    buscarProdutoGenerico('nomeProduto', proNome, api.buscarProduto, api.renderizarProduto)
}

// CRUD Read - Código de Barras
function buscarProdutoBar() {
    let proBar = document.getElementById('searchBarcode').value
    buscarProdutoGenerico('barcodeProduto', proBar, api.buscarProdutoBar, api.renderizarProdutoBar)
}

// CRUD Delete
function excluirProduto() {
    if (idProduto.value) {
        api.deletarProduto(idProduto.value)
        resetForm()
    }
}

// Reset Form
api.resetarFormulario(() => {
    resetForm()
})

function resetForm() {
    idProduto.value = ""
    barcodeProduto.value = ""
    nomeProduto.value = ""
    precoProduto.value = ""
    caminhoImagemProduto.value = ""
    foco.value = ""
    foco.disabled = false
    btnRead.disabled = false
    btnCreate.disabled = false
    btnUpdate.disabled = true
    btnDelete.disabled = true
    document.getElementById('searchBarcode').disabled = false
    document.getElementById('searchProduct').disabled = false
    foco.focus()
}