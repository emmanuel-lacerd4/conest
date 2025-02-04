/**
 * Processo de Renderização: 
 * produtos.html
 */

const foco = document.getElementById('searchProduct')

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

        // Verificar qual campo está focado e chamar a função correspondente
        if (document.activeElement === document.getElementById('searchProduct')) {
            buscarProduto()
        } else if (document.activeElement === document.getElementById('searchBarcode')) {
            buscarProdutoCod()
        }
    }
}

// Adicionando o evento da tecla Enter para o formulário
document.getElementById('frmProduct').addEventListener('keydown', teclaEnter)

// Função para remover o manipulador do evento da tecla Enter.
function restaurarEnter() {
    document.getElementById('frmProduct').removeEventListener('keydown', teclaEnter)
}

// Array usado nos métodos para manipulação da estrutura de dados.
let arrayProduto = []

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Passo 1 - slide (capturar os dados dos inputs form)
let formProduto = document.getElementById('frmProduct')
let idProduto = document.getElementById('inputIdProduct')
let nomeProduto = document.getElementById('inputNameProduct')
let codProduto = document.getElementById('inputCodProduct')
let precoProduto = document.getElementById('inputPrecoProduct')

// CRUD Create/Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
formProduto.addEventListener('submit', async (event) => {
    event.preventDefault()
    console.log(idProduto.value, nomeProduto.value, codProduto.value, precoProduto.value)

    if (idProduto.value === "") {
        const produto = {
            nomePro: nomeProduto.value,
            codPro: codProduto.value,
            precoPro: precoProduto.value
        }
        api.novoProduto(produto)
    } else {
        const produto = {
            idPro: idProduto.value,
            nomePro: nomeProduto.value,
            codPro: codProduto.value,
            precoPro: precoProduto.value
        }
        api.editarProduto(produto)
    }
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarProduto() {
    let proNome = document.getElementById('searchProduct').value

    if (proNome === "") {
        api.validarBusca() // Validação do campo obrigatório
        foco.focus()
    } else {
        api.buscarProduto(proNome)
        api.renderizarProduto((event, dadosProduto) => {
            const produtoRenderizado = JSON.parse(dadosProduto)
            arrayProduto = produtoRenderizado
            arrayProduto.forEach((c) => {
                document.getElementById('inputNameProduct').value = c.nomeProduto
                document.getElementById('inputCodProduct').value = c.codProduto
                document.getElementById('inputPrecoProduct').value = c.precoProduto
                document.getElementById('inputIdProduct').value = c._id
                foco.value = ""
                foco.disabled = true
                btnRead.disabled = true
                btnCreate.disabled = true
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                restaurarEnter()

                // Limpar e desabilitar o campo de busca de nome
                document.getElementById('searchProduct').value = ""  // Limpar o campo de nome
                document.getElementById('searchProduct').disabled = true // Desabilitar a barra de busca de nome

                // Limpar e desabilitar o campo de busca de código de barras
                document.getElementById('searchBarcode').value = ""  // Limpar o campo de código de barras
                document.getElementById('searchBarcode').disabled = true // Desabilitar a barra de busca de código de barras
            })
        })
    }

    api.setarNomeProduto(() => {
        let campoNome = document.getElementById('searchProduct').value
        document.getElementById('inputNameProduct').focus()
        document.getElementById('inputNameProduct').value = campoNome
        foco.value = ""
        foco.blur()
        btnCreate.disabled = false
        restaurarEnter()
        document.getElementById('searchProduct').disabled = true // Desabilitar o campo de nome
    })
}

function buscarProduto() {
    let proNome = document.getElementById('searchProduct').value

    if (proNome === "") {
        api.validarBusca() // Validação do campo obrigatório
        foco.focus()
    } else {
        api.buscarProduto(proNome)
        api.renderizarProduto((event, dadosProduto) => {
            const produtoRenderizado = JSON.parse(dadosProduto)
            arrayProduto = produtoRenderizado
            arrayProduto.forEach((c) => {
                document.getElementById('inputNameProduct').value = c.nomeProduto
                document.getElementById('inputCodProduct').value = c.codProduto
                document.getElementById('inputPrecoProduct').value = c.precoProduto
                document.getElementById('inputIdProduct').value = c._id
                foco.value = ""
                foco.disabled = true
                btnRead.disabled = true
                btnCreate.disabled = true
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                restaurarEnter()

                // Limpar e desabilitar o campo de busca de nome
                document.getElementById('searchProduct').value = ""  // Limpar o campo de nome
                document.getElementById('searchProduct').disabled = true // Desabilitar a barra de busca de nome

                // Limpar e desabilitar o campo de busca de código de barras, mas mantendo o foco em nome
                document.getElementById('searchBarcode').disabled = true // Desabilitar a barra de busca de código de barras

                // Focar no campo de nome do produto para continuar o cadastro
                document.getElementById('inputNameProduct').focus() // Focar no campo de nome do produto
            })
        })
    }

    api.setarNomeProduto(() => {
        let campoNome = document.getElementById('searchProduct').value
        document.getElementById('inputNameProduct').focus()
        document.getElementById('inputNameProduct').value = campoNome
        foco.value = ""
        foco.blur()
        btnCreate.disabled = false
        restaurarEnter()

        // Desabilitar novamente o campo de busca de nome
        document.getElementById('searchProduct').disabled = true // Desabilitar a barra de busca de nome
        // Deixe o campo de busca de código de barras habilitado para uso após o cadastro
        document.getElementById('searchBarcode').disabled = false // Reabilitar a barra de busca de código de barras
    })
}

function buscarProdutoCod() {
    let proCod = document.getElementById('searchBarcode').value

    if (proCod === "") {
        api.validarBusca() // Validação do campo obrigatório
        foco.focus()
    } else {
        api.buscarProdutoCod(proCod)
        api.renderizarProdutoCod((event, dadosProdutoCod) => {
            const produtoRenderizadoCod = JSON.parse(dadosProdutoCod)
            
            if (produtoRenderizadoCod.length === 0) {
                // Caso não encontre produto, limpar e bloquear o campo de código de barras
                document.getElementById('searchBarcode').value = ""  // Limpar o campo de código de barras
                document.getElementById('searchBarcode').disabled = true // Desabilitar a barra de busca de código de barras
                document.getElementById('searchProduct').disabled = true // Desabilitar a barra de busca de nome
                foco.focus() // Focar de volta no campo de busca
                document.getElementById('searchBarcode').focus() // Garantir que o foco vá para o campo de código de barras
                document.getElementById('searchBarcode').scrollIntoView({ behavior: 'smooth', block: 'center' }); // "Arrasta" até o campo de código de barras
                return // Sai da função caso não encontre o produto
            }

            arrayProduto = produtoRenderizadoCod
            arrayProduto.forEach((c) => {
                document.getElementById('inputNameProduct').value = c.nomeProduto
                document.getElementById('inputCodProduct').value = c.codProduto
                document.getElementById('inputPrecoProduct').value = c.precoProduto
                document.getElementById('inputIdProduct').value = c._id
                foco.value = ""
                foco.disabled = true
                btnRead.disabled = true
                btnCreate.disabled = true
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                restaurarEnter()

                // Limpar e desabilitar o campo de busca de nome
                document.getElementById('searchProduct').value = ""  // Limpar o campo de nome
                document.getElementById('searchProduct').disabled = true // Desabilitar a barra de busca de nome

                // Limpar e desabilitar o campo de busca de código de barras
                document.getElementById('searchBarcode').value = ""  // Limpar o campo de código de barras
                document.getElementById('searchBarcode').disabled = true // Desabilitar a barra de busca de código de barras
            })
        })
    }

    api.setarCodProduto(() => {
        let campoCod = document.getElementById('searchBarcode').value
        document.getElementById('inputCodProduct').focus()
        document.getElementById('inputCodProduct').value = campoCod
        foco.value = ""
        foco.blur()
        btnCreate.disabled = false
        restaurarEnter()
        document.getElementById('searchBarcode').disabled = true // Desabilitar o campo de código de barras
    })
}

// Função para formatar preço em Reais (R$ XX.XXX,XX)
function formatarPreco(input) {
    let value = input.value.replace(/\D/g, '')
    
    if (value === "") return

    value = (parseFloat(value) / 100).toFixed(2)
    value = value.replace('.', ',')
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

    input.value = value
}

document.getElementById('inputPrecoProduct').addEventListener('input', function () {
    formatarPreco(this)
})

// CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function excluirProduto() {
    api.deletarProduto(idProduto.value)
}
// Fim CRUD Delete <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Reset Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    resetForm()
})

function resetForm() {
    location.reload()
}
// Fim do reset form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<