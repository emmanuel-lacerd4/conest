/**
 * Processo de renderização da tela de Produtos
 * produtos.js
 */

const foco = document.getElementById('searchProduct')
const focoNome = document.getElementById('searchProductName')

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnUpdate').disabled = true
    document.getElementById('btnDelete').disabled = true
    document.getElementById('btnCreate').disabled = false
    foco.focus()
    carregarFornecedores()
})

function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarProduto()
    }
}

function teclaEnterNome(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarProdutoPorNome()
    }
}

function restaurarEnter() {
    foco.removeEventListener('keydown', teclaEnter)
    focoNome.removeEventListener('keydown', teclaEnterNome)
}

foco.addEventListener('keydown', teclaEnter)
focoNome.addEventListener('keydown', teclaEnterNome)

let arrayProduto = []

let formProduto = document.getElementById('frmProduct')
let idProduto = document.getElementById('inputIdProduct')
let barcodeProduto = document.getElementById('inputBarcodeProduct')
let nomeProduto = document.getElementById('inputNameProduct')
let dataProduto = document.getElementById('inputDataProduct')
let imagem = document.getElementById('imageProductPreview')
let precoProduto = document.getElementById('inputPrecoProduct')
let nomeFornecedorProduto = document.getElementById('inputFornecedorProduct')
let quantidadeProduto = document.getElementById('inputQuantidadeProduct')
let unidadeProduto = document.getElementById('inputUnidadeProduct')

let caminhoImagem

async function carregarFornecedores() {
    const fornecedorSelect = document.getElementById('inputFornecedorProduct')
    fornecedorSelect.innerHTML = '<option value="">Carregando fornecedores...</option>'

    try {
        const fornecedores = await window.api.buscarTodosFornecedores()
        fornecedorSelect.innerHTML = '<option value="">Selecione um fornecedor</option>'
        if (fornecedores && fornecedores.length > 0) {
            fornecedores.forEach(nome => {
                const option = document.createElement('option')
                option.value = nome
                option.textContent = nome
                fornecedorSelect.appendChild(option)
            })
        } else {
            fornecedorSelect.innerHTML += '<option value="">Nenhum fornecedor cadastrado</option>'
        }
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error)
        fornecedorSelect.innerHTML = '<option value="">Erro ao carregar fornecedores</option>'
    }
}

async function buscarProduto() {
    let barcode = foco.value.trim()
    if (barcode === '') {
        window.api.validarBusca()
        foco.focus()
    } else {
        window.api.buscarProduto(barcode)
        window.api.renderizarProduto(async (event, dadosProduto) => {
            if (!dadosProduto) return
            const produtoRenderizado = JSON.parse(dadosProduto)
            arrayProduto = produtoRenderizado
            arrayProduto.forEach(async (p) => {
                idProduto.value = p._id
                barcodeProduto.value = p.barcodeProduto
                nomeProduto.value = p.nomeProduto
                dataProduto.value = new Date(p.dataCadastro).toLocaleDateString('pt-BR')
                precoProduto.value = p.precoProduto
                quantidadeProduto.value = p.quantidadeProduto || '0'
                unidadeProduto.value = p.unidadeProduto || ''
                if (p.caminhoImagemProduto) imagem.src = p.caminhoImagemProduto
                foco.value = ''
                foco.disabled = true
                focoNome.disabled = true
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                document.getElementById('btnCreate').disabled = true
                restaurarEnter()
                await carregarFornecedores()
                nomeFornecedorProduto.value = p.nomeFornecedor || ''
            })
        })
    }
}

async function buscarProdutoPorNome() {
    let nome = focoNome.value.trim()
    if (nome === '') {
        window.api.validarBusca()
        focoNome.focus()
    } else {
        window.api.buscarProdutoNome(nome)
        window.api.renderizarProdutoNome(async (event, dadosProduto) => {
            if (!dadosProduto) return
            const produtoRenderizado = JSON.parse(dadosProduto)
            arrayProduto = produtoRenderizado
            arrayProduto.forEach(async (p) => {
                idProduto.value = p._id
                barcodeProduto.value = p.barcodeProduto
                nomeProduto.value = p.nomeProduto
                dataProduto.value = new Date(p.dataCadastro).toLocaleDateString('pt-BR')
                precoProduto.value = p.precoProduto
                quantidadeProduto.value = p.quantidadeProduto || '0'
                unidadeProduto.value = p.unidadeProduto || ''
                if (p.caminhoImagemProduto) imagem.src = p.caminhoImagemProduto
                focoNome.value = ''
                foco.disabled = true
                focoNome.disabled = true
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                document.getElementById('btnCreate').disabled = true
                await carregarFornecedores()
                nomeFornecedorProduto.value = p.nomeFornecedor || ''
            })
        })
    }
}

// Evento de submit para cadastrar/editar produto
formProduto.addEventListener('submit', (e) => {
    e.preventDefault()
    const produto = {
        _id: idProduto.value || undefined,
        barcodeProduto: barcodeProduto.value,
        nomeProduto: nomeProduto.value,
        dataCadastro: new Date(),
        precoProduto: precoProduto.value,
        nomeFornecedor: nomeFornecedorProduto.value || '',
        quantidadeProduto: quantidadeProduto.value || '0',
        unidadeProduto: unidadeProduto.value || '',
        caminhoImagemProduto: caminhoImagem || ''
    }
    if (idProduto.value) {
        window.api.editarProduto(produto)
    } else {
        window.api.novoProduto(produto)
    }
})

window.api.setarBarcode(() => {
    barcodeProduto.value = foco.value
    foco.value = ''
    nomeProduto.focus()
    restaurarEnter()
})

window.api.clearBarcode(() => {
    barcodeProduto.value = ''
    barcodeProduto.focus()
    barcodeProduto.style.borderColor = 'red'
})

window.api.setarNomeProduto(() => {
    nomeProduto.value = focoNome.value
    focoNome.value = ''
    nomeProduto.focus()
    restaurarEnter()
})

document.getElementById('inputBarcodeProduct').addEventListener('input', function () {
    formatarBarcode(this)
})

async function uploadImage() {
    try {
        const filePath = await window.api.selecionarArquivo()
        if (filePath) {
            caminhoImagem = filePath
            imagem.src = filePath
        }
    } catch (error) {
        console.error('Erro ao selecionar imagem:', error)
    }
}

function excluirProduto() {
    window.api.deletarProduto(idProduto.value)
}

window.api.resetarFormulario(() => {
    resetForm()
})

function resetForm() {
    location.reload()
}