/**
 * Processo de renderização da tela de Produtos
 * produtos.html
 */

const foco = document.getElementById('searchProduct')
const btnRead = document.getElementById('btnRead') // Seleciona o botão de busca.

// Configuração inicial do formulário.
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    foco.focus()
})

// Função para manipular o evento da tecla Enter.
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

// Manipulando o evento (tecla Enter).
document.getElementById('frmProduct').addEventListener('keydown', teclaEnter)

// Array usado nos métodos para manipulação da estrutura de dados.
let arrayProduto = []

// Captura dos inputs do formulário
let formProduto = document.getElementById('frmProduct')
let idProduto = document.getElementById('inputIdProduct')
let barcodeProduto = document.getElementById('inputBarcodeProduct')
let nomeProduto = document.getElementById('inputNameProduct')
let caminhoImagemProduto = document.getElementById('pathImageProduct')
let precoProduto = document.getElementById('inputPrecoProduct')
let imagem = document.getElementById('imageProductPreview')

// Variável usada para armazenar o caminho da imagem.
let caminhoImagem

// CRUD Create/Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Solicitar ao main.js o uso do explorador de arquivos e armazenar o caminho da imagem selecionada na variável caminhoImagem.
async function uploadImage() {
    caminhoImagem = await api.selecionarArquivo()
    console.log(caminhoImagem)
    imagem.src = `file://${caminhoImagem}`
}

formProduto.addEventListener('submit', async (event) => {
    event.preventDefault()
    // Teste de recebimento dos inputs do formulário (passo 1).
    console.log(idProduto.value, barcodeProduto.value, nomeProduto.value, caminhoImagem, precoProduto.value)
    // Criar um objeto.
    // caminhoImagemPro: caminhoImagem ? caminhoImagem: ""
    // ? : (operador ternário (if else)) correção de BUG se não existir caminho da imagem (se nenhuma imagem selecionada) enviar string vazia ""
        if (idProduto.value === "" || idProduto.value === undefined) { // Verifica se o ID está vazio ou undefined
        const produto = {
            barcodePro: barcodeProduto.value,
            nomePro: nomeProduto.value,
            caminhoImagemPro: caminhoImagem ? caminhoImagem: "",
            precoPro: precoProduto.value
        }
        console.log("Cadastrando novo produto:", produto) // Verifique se o objeto está sendo montado corretamente.
        api.novoProduto(produto) // Chama a função para cadastrar um novo produto.
    } else {
        const produto = {
            idPro: idProduto.value,
            barcodePro: barcodeProduto.value,
            nomePro: nomeProduto.value,
            caminhoImagemPro: caminhoImagem,
            precoPro: precoProduto.value
        }
        console.log("Editando produto existente:", produto) // Verifique se o objeto está sendo montado corretamente
        api.editarProduto(produto) // Chama a função para editar um produto existente
    }
})

// Variável para controlar se a busca já está em andamento.
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
                    // Preenche os campos do formulário
                    document.getElementById('inputBarcodeProduct').value = c.barcodeProduto || ""
                    document.getElementById('inputNameProduct').value = c.nomeProduto || ""
                    document.getElementById('inputPrecoProduct').value = c.precoProduto || ""
                    document.getElementById('inputIdProduct').value = c._id || "" // Preenche o ID do produto
                    console.log("ID do produto encontrado:", c._id) // Adicione este console.log para depuração

                    // Desabilita campos e botões
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
            isSearching = false
        })
    } else {
        isSearching = false
    }
}

// CRUD Read - Nome
function buscarProduto() {
    let proNome = document.getElementById('searchProduct').value

    // Validação para campo vazio
    if (proNome.trim() === "") {
        // Envia uma mensagem ao main.js para exibir a caixa de diálogo
        window.api.validarBusca()
        return // Interrompe a execução da função
    }

    buscarProdutoGenerico('nomeProduto', proNome, api.buscarProduto, api.renderizarProduto)
}

// CRUD Read - Código de Barras
function buscarProdutoBar() {
    let proBar = document.getElementById('searchBarcode').value

    // Validação para campo vazio
    if (proBar.trim() === "") {
        // Envia uma mensagem ao main.js para exibir a caixa de diálogo
        window.api.validarBusca()
        return // Interrompe a execução da função
    }

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
    // Recarregar a página.
    location.reload()
}