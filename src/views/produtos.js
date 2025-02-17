/**
 * Processo de renderização da tela de Produtos
 * produtos.html
 */

const foco = document.getElementById('searchProduct')
const btnRead = document.getElementById('btnRead') // Seleciona o botão de busca

// Mudar as propriedades do documento html ao iniciar a janela.
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

// Função para remover o manipulador do evento da tecla Enter
function restaurarEnter() {
    document.getElementById('frmProduct').removeEventListener('keydown', teclaEnter)
}

// Manipulando o evento (tecla Enter) para o Código de Barras.
document.getElementById('frmProduct').addEventListener('keydown', teclaEnter)

// Array usado nos métodos para manipulação da estrutura de dados
let arrayProduto = []

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
let formProduto = document.getElementById('frmProduct')
let idProduto = document.getElementById('inputIdProduct')
let barcodeProduto = document.getElementById('inputBarcodeProduct')
let nomeProduto = document.getElementById('inputNameProduct')
let caminhoImagemProduto = document.getElementById('pathImageProduct')
let precoProduto = document.getElementById('inputPrecoProduct')

// Variável para controlar se a busca já está em andamento
let isSearching = false

// Alterando a busca por nome para ser feita apenas ao clicar no botão de busca
btnRead.addEventListener('click', (event) => {
    event.preventDefault() // Evita o comportamento padrão do botão (submit)
    event.stopPropagation() // Impede a propagação do evento

    // Verifica se já está buscando para evitar duplicação
    if (!isSearching) {
        isSearching = true
        buscarProduto()
    }
})

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
                    document.getElementById('inputBarcodeProduct').value = c.barcodeProduto
                    document.getElementById('inputNameProduct').value = c.nomeProduto
                    document.getElementById('inputPrecoProduct').value = c.precoProduto
                    document.getElementById('inputIdProduct').value = c._id
                    foco.value = ""
                    foco.disabled = true
                    btnRead.disabled = true
                    btnCreate.disabled = true
                    document.getElementById('btnUpdate').disabled = false
                    document.getElementById('btnDelete').disabled = false
                    restaurarEnter()
                    document.getElementById('searchBarcode').value = ""
                    document.getElementById('searchBarcode').disabled = true
                    document.getElementById('searchProduct').value = ""
                    document.getElementById('searchProduct').disabled = true
                })
            }
            // Reseta a flag de busca após a conclusão
            isSearching = false
        })
    } else {
        // Reseta a flag de busca se o valor estiver vazio
        isSearching = false
    }
}

// CRUD Read - Nome
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
    api.deletarProduto(idProduto.value)
}

// Reset Form
api.resetarFormulario((args) => {
    resetForm()
})

function resetForm() {
    location.reload()
}