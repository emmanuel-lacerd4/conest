/**
 * Processo de renderização da tela de Produtos
 * produtos.html
 */

const foco = document.getElementById('searchProduct')
const focoNome = document.getElementById('searchProductName')

document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    foco.focus()
    focoNome.disabled = false
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
}

function restaurarEnterNome() {
    focoNome.removeEventListener('keydown', teclaEnterNome)
}

foco.addEventListener('keydown', teclaEnter)
focoNome.addEventListener('keydown', teclaEnterNome)

let arrayProduto = []

let formProduto = document.getElementById('frmProduct')
let idProduto = document.getElementById('inputIdProduct')
let barcodeProduto = document.getElementById('inputBarcodeProduct')
let nomeProduto = document.getElementById('inputNameProduct')
let caminhoImagemProduto = document.getElementById('pathImageProduct')
let imagem = document.getElementById('imageProductPreview')
let precoProduto = document.getElementById('inputPrecoProduct')

let caminhoImagem

async function uploadImage() {
    caminhoImagem = await window.api.selecionarArquivo()
    console.log("Caminho da imagem selecionada: ", caminhoImagem)
    if (caminhoImagem) {
        imagem.src = `file://${caminhoImagem}`
    }
    btnCreate.focus()
}

formProduto.addEventListener('submit', async (event) => {
    event.preventDefault()
    console.log("Dados do formulário: ", barcodeProduto.value, nomeProduto.value, caminhoImagem, precoProduto.value)
    if (idProduto.value === "") {
        const produto = {
            barcodePro: barcodeProduto.value,
            nomePro: nomeProduto.value,
            caminhoImagemPro: caminhoImagem ? caminhoImagem : "",
            precoPro: precoProduto.value
        }
        window.api.novoProduto(produto)
    } else {
        const produto = {
            idPro: idProduto.value,
            barcodePro: barcodeProduto.value,
            nomePro: nomeProduto.value,
            caminhoImagemPro: caminhoImagem ? caminhoImagem : "",
            precoPro: precoProduto.value
        }
        window.api.editarProduto(produto)
    }
})

function buscarProduto() {
    let barcode = foco.value.trim()
    console.log("Buscando por código de barras:", barcode)
    if (barcode === "") {
        window.api.validarBusca()
        foco.focus()
    } else {
        window.api.buscarProduto(barcode)
        window.api.renderizarProduto((event, dadosProduto) => {
            console.log("Dados recebidos do backend (barcode):", dadosProduto)
            if (!dadosProduto) {
                console.log("Nenhum dado recebido para código de barras:", barcode)
                return
            }
            const produtoRenderizado = JSON.parse(dadosProduto)
            arrayProduto = produtoRenderizado
            if (arrayProduto.length > 0) {
                arrayProduto.forEach((p) => {
                    idProduto.value = p._id
                    barcodeProduto.value = p.barcodeProduto
                    nomeProduto.value = p.nomeProduto
                    precoProduto.value = p.precoProduto
                    if (p.caminhoImagemProduto) {
                        imagem.src = p.caminhoImagemProduto
                    }
                    foco.value = ""
                    foco.disabled = true
                    focoNome.disabled = true
                    btnUpdate.disabled = false
                    btnDelete.disabled = false
                    btnCreate.disabled = true
                    restaurarEnter()
                })
            } else {
                console.log("Nenhum produto encontrado para o código de barras:", barcode)
            }
        })
    }
}

function buscarProdutoPorNome() {
    let nome = focoNome.value.trim()
    console.log("Buscando por nome:", nome)
    if (nome === "") {
        window.api.validarBusca()
        focoNome.focus()
    } else {
        window.api.buscarProdutoNome(nome)
        window.api.renderizarProdutoNome((event, dadosProduto) => {
            console.log("Dados recebidos do backend (nome):", dadosProduto)
            if (!dadosProduto) {
                console.log("Nenhum dado recebido para nome:", nome)
                return
            }
            const produtoRenderizado = JSON.parse(dadosProduto)
            arrayProduto = produtoRenderizado
            if (arrayProduto.length > 0) {
                arrayProduto.forEach((p) => {
                    idProduto.value = p._id
                    barcodeProduto.value = p.barcodeProduto
                    nomeProduto.value = p.nomeProduto
                    precoProduto.value = p.precoProduto
                    if (p.caminhoImagemProduto) {
                        imagem.src = p.caminhoImagemProduto
                    }
                    focoNome.value = ""
                    focoNome.disabled = true
                    foco.disabled = true
                    btnUpdate.disabled = false
                    btnDelete.disabled = false
                    btnCreate.disabled = true
                    restaurarEnter()
                    restaurarEnterNome()
                })
            } else {
                console.log("Nenhum produto encontrado para o nome:", nome)
            }
        })
    }
}

window.api.setarBarcode(() => {
    let campoBarcode = foco.value
    barcodeProduto.value = campoBarcode
    foco.value = ""
    nomeProduto.focus()
    restaurarEnter()
})

window.api.clearBarcode(() => {
    barcodeProduto.value = ""
    barcodeProduto.focus()
    barcodeProduto.style.borderColor = "red"
})

window.api.setarNomeProduto(() => {
    nomeProduto.value = focoNome.value
    focoNome.value = ""
    nomeProduto.focus()
    restaurarEnter()
    restaurarEnterNome()
})

function excluirProduto() {
    console.log("Excluindo produto com ID: ", idProduto.value)
    window.api.deletarProduto(idProduto.value)
}

window.api.resetarFormulario((args) => {
    resetForm()
})

function resetForm() {
    location.reload()
}