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

        // Verificar se o foco está no campo de código de barras e chamar a função correspondente
        if (document.activeElement === document.getElementById('searchBarcode')) {
            buscarProdutoCod() // Busca pelo código de barras
        }
    }
}

// Adicionando o evento da tecla Enter para o campo de código de barras
document.getElementById('searchBarcode').addEventListener('keydown', teclaEnter)

// Alterando a busca por nome para ser feita apenas ao clicar no botão de busca
document.getElementById('btnRead').addEventListener('click', () => {
    buscarProduto() // Chama a função de busca por nome
})

// Função para remover o manipulador do evento da tecla Enter.
function restaurarEnter() {
    document.getElementById('frmProduct').removeEventListener('keydown', teclaEnter)
}

// Array usado nos métodos para manipulação da estrutura de dados.
let arrayProduto = []

// CRUD Create/Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
let formProduto = document.getElementById('frmProduct')
let idProduto = document.getElementById('inputIdProduct')
let nomeProduto = document.getElementById('inputNameProduct')
let codProduto = document.getElementById('inputCodProduct')
let precoProduto = document.getElementById('inputPrecoProduct')

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

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarProduto() {
    let proNome = document.getElementById('searchProduct').value
    if (proNome === "") {
        api.validarBusca() // Validação do campo obrigatório
        foco.focus()
    } else {
        api.buscarProduto(proNome)
        api.renderizarProduto((event, dadosProduto) => {
            const renderizadoProduto = JSON.parse(dadosProduto)
            arrayProduto = renderizadoProduto

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

                document.getElementById('searchBarcode').value = ""
                document.getElementById('searchBarcode').disabled = true
                document.getElementById('searchProduct').value = ""
                document.getElementById('searchProduct').disabled = true
            })
        })
    }
}

// Função para buscar o produto pelo código de barras
function buscarProdutoCod() {
    let proCod = document.getElementById('searchBarcode').value.trim()

    if (proCod === "") {
        api.validarBusca() // Validação do campo obrigatório
        return
    }

    console.log("Buscando produto com código de barras:", proCod)

    api.buscarProdutoCod(proCod)

    api.renderizarProdutoCod((event, dadosProdutoCod) => {
        const renderizadoProdutoCod = JSON.parse(dadosProdutoCod)
        arrayProduto = renderizadoProdutoCod

        arrayProduto.forEach((c) => {
            document.getElementById('inputNameProduct').value = c.nomeProduto
            document.getElementById('inputCodProduct').value = c.codProduto
            document.getElementById('inputPrecoProduct').value = c.precoProduto
            document.getElementById('inputIdProduct').value = c._id

            document.getElementById('searchBarcode').value = ""
            document.getElementById('btnUpdate').disabled = false
            document.getElementById('btnDelete').disabled = false
        })
    })
    
    api.setarCodProduto(() => {
        let campoCod = document.getElementById('searchBarcode').value
        document.getElementById('inputCodProduct').focus()
        document.getElementById('inputCodProduct').value = campoCod
        foco.value = ""
        foco.blur()
        restaurarEnter()
    })
}

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