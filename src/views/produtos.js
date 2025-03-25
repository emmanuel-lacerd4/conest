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
    try {
        const fornecedores = await window.api.buscarTodosFornecedores()
        const fornecedorSelect = document.getElementById('inputFornecedorProduct')
        fornecedorSelect.innerHTML = '<option value="">Selecione um fornecedor</option>'

        // Verificar se fornecedores é um array e tem elementos válidos
        if (Array.isArray(fornecedores) && fornecedores.length > 0) {
            // Filtrar elementos válidos e ordenar
            const fornecedoresValidos = fornecedores
                .filter(fornecedor => fornecedor && typeof fornecedor.nomeFornecedor === 'string')
                .sort((a, b) => a.nomeFornecedor.localeCompare(b.nomeFornecedor))

            // Preencher o select com os fornecedores válidos
            fornecedoresValidos.forEach(fornecedor => {
                const option = document.createElement('option')
                option.value = fornecedor.nomeFornecedor
                option.textContent = fornecedor.nomeFornecedor
                fornecedorSelect.appendChild(option)
            })
        } else {
            console.warn('Nenhum fornecedor válido encontrado.')
        }
    } catch (error) {
        console.error('Erro ao carregar fornecedores:', error)
    }
}

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
        fornecedorPro: nomeFornecedorProduto.value,
        quantidadePro: quantidadeProduto.value || '0',
        unidadePro: unidadeProduto.value
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
                dataProduto.value = new Date(p.dataCadastro).toLocaleDateString('pt-BR')
                precoProduto.value = p.precoProduto
                nomeFornecedorProduto.value = p.nomeFornecedor || ''
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
                carregarFornecedores() // Recarregar a lista para garantir sincronia
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
                dataProduto.value = new Date(p.dataCadastro).toLocaleDateString('pt-BR')
                precoProduto.value = p.precoProduto
                nomeFornecedorProduto.value = p.nomeFornecedor || ''
                quantidadeProduto.value = p.quantidadeProduto || '0'
                unidadeProduto.value = p.unidadeProduto || ''
                if (p.caminhoImagemProduto) imagem.src = p.caminhoImagemProduto
                focoNome.value = ''
                foco.disabled = true
                focoNome.disabled = true
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                document.getElementById('btnCreate').disabled = true
                restaurarEnter()
                carregarFornecedores() // Recarregar a lista para garantir sincronia
            })
        })
    }
}

function buscarProdutoPorFornecedor() {
    let fornecedor = nomeFornecedorProduto.value.trim()
    if (fornecedor === '') {
        window.api.validarBusca()
        nomeFornecedorProduto.focus()
    } else {
        window.api.buscarProdutoPorFornecedor(fornecedor)
        window.api.renderizarProdutoPorFornecedor((event, dadosProduto) => {
            if (!dadosProduto) return
            const produtoRenderizado = JSON.parse(dadosProduto)
            arrayProduto = produtoRenderizado
            if (produtoRenderizado.length === 0) {
                alert('Nenhum produto encontrado para este fornecedor.')
                return
            }
            arrayProduto.forEach((p) => {
                idProduto.value = p._id
                barcodeProduto.value = p.barcodeProduto
                nomeProduto.value = p.nomeProduto
                dataProduto.value = new Date(p.dataCadastro).toLocaleDateString('pt-BR')
                precoProduto.value = p.precoProduto
                nomeFornecedorProduto.value = p.nomeFornecedor || ''
                quantidadeProduto.value = p.quantidadeProduto || '0'
                unidadeProduto.value = p.unidadeProduto || ''
                if (p.caminhoImagemProduto) imagem.src = p.caminhoImagemProduto
                foco.value = ''
                focoNome.value = ''
                foco.disabled = true
                focoNome.disabled = true
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                document.getElementById('btnCreate').disabled = true
                restaurarEnter()
                carregarFornecedores() // Recarregar a lista para garantir sincronia
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

nomeFornecedorProduto.addEventListener('change', function () {
    if (this.value) {
        buscarProdutoPorFornecedor()
    }
})

function excluirProduto() {
    window.api.deletarProduto(idProduto.value)
}

window.api.resetarFormulario(() => {
    resetForm()
})

function resetForm() {
    location.reload()
    carregarFornecedores() // Garantir que a lista seja recarregada ao resetar
}