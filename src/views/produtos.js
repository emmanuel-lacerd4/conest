/**
 * Processo de renderização da tela de Produtos
 * produtos.html
 */

const foco = document.getElementById('searchProduct')
const focoNome = document.getElementById('searchProductName')

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnUpdate').disabled = true
    document.getElementById('btnDelete').disabled = true
    foco.focus()
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
let imagem = document.getElementById('imageProductPreview')
let precoProduto = document.getElementById('inputPrecoProduct')
let fornecedorProduto = document.getElementById('inputFornecedorProduct')
let quantidadeProduto = document.getElementById('inputQuantidadeProduct')
let unidadeProduto = document.getElementById('inputUnidadeProduct')
let valorUnitarioProduto = document.getElementById('inputValorUnitarioProduct')

let caminhoImagem

async function uploadImage() {
    caminhoImagem = await window.api.selecionarArquivo()
    if (caminhoImagem) {
        imagem.src = `file://${caminhoImagem}`
    }
    document.getElementById('btnCreate').focus()
}

formProduto.addEventListener('submit', async (event) => {
    event.preventDefault()
    const barcodeLimpo = barcodeProduto.value.replace(/\D/g, '')
    const camposIds = ['inputBarcodeProduct', 'inputNameProduct', 'inputPrecoProduct']
    if (!verificarCampos(camposIds)) return

    const produto = {
        idPro: idProduto.value || '',
        barcodePro: barcodeLimpo,
        nomePro: nomeProduto.value,
        caminhoImagemPro: caminhoImagem || '',
        precoPro: precoProduto.value,
        fornecedorPro: fornecedorProduto.value,
        quantidadePro: quantidadeProduto.value || '0',
        unidadePro: unidadeProduto.value,
        valorUnitarioPro: valorUnitarioProduto.value || '0'
    }

    if (idProduto.value === '') {
        window.api.novoProduto(produto)
    } else {
        window.api.editarProduto(produto)
    }
})

function buscarProduto() {
    let barcode = foco.value.trim()
    if (barcode === '') {
        window.api.validarBusca()
        foco.focus()
    } else {
        window.api.buscarProduto(barcode)
        window.api.renderizarProduto((event, dadosProduto) => {
            if (!dadosProduto) return
            const produtoRenderizado = JSON.parse(dadosProduto)
            arrayProduto = produtoRenderizado
            arrayProduto.forEach((p) => {
                idProduto.value = p._id
                barcodeProduto.value = p.barcodeProduto
                nomeProduto.value = p.nomeProduto
                precoProduto.value = p.precoProduto
                fornecedorProduto.value = p.fornecedorProduto || ''
                quantidadeProduto.value = p.quantidadeProduto || '0'
                unidadeProduto.value = p.unidadeProduto || ''
                valorUnitarioProduto.value = p.valorUnitarioProduto || '0'
                if (p.caminhoImagemProduto) imagem.src = p.caminhoImagemProduto
                foco.value = ''
                foco.disabled = true
                focoNome.disabled = true
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                document.getElementById('btnCreate').disabled = true
                restaurarEnter()
            })
        })
    }
}

function buscarProdutoPorNome() {
    let nome = focoNome.value.trim()
    if (nome === '') {
        window.api.validarBusca()
        focoNome.focus()
    } else {
        window.api.buscarProdutoNome(nome)
        window.api.renderizarProdutoNome((event, dadosProduto) => {
            if (!dadosProduto) return
            const produtoRenderizado = JSON.parse(dadosProduto)
            arrayProduto = produtoRenderizado
            arrayProduto.forEach((p) => {
                idProduto.value = p._id
                barcodeProduto.value = p.barcodeProduto
                nomeProduto.value = p.nomeProduto
                precoProduto.value = p.precoProduto
                fornecedorProduto.value = p.fornecedorProduto || ''
                quantidadeProduto.value = p.quantidadeProduto || '0'
                unidadeProduto.value = p.unidadeProduto || ''
                valorUnitarioProduto.value = p.valorUnitarioProduto || '0'
                if (p.caminhoImagemProduto) imagem.src = p.caminhoImagemProduto
                focoNome.value = ''
                foco.disabled = true
                focoNome.disabled = true
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                document.getElementById('btnCreate').disabled = true
                restaurarEnter()
            })
        })
    }
}

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

function excluirProduto() {
    window.api.deletarProduto(idProduto.value)
}

window.api.resetarFormulario(() => {
    resetForm()
})

function resetForm() {
    location.reload()
}