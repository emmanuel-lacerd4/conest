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

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
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
    // Passo 1 (slides).
    let proNome = document.getElementById('searchProduct').value
    // Validação.
    if (proNome === "") {
        api.validarBusca() // Validação do campo obrigatório.
        foco.focus()
    } else {
        //console.log(proNome) // Teste do passo 1.
        // Passo 2 (slide) - enviar o pedido de busca do produto ao main.
        api.buscarProduto(proNome)
        // Passo 5 - Recebimento dos dados do produto.
        api.renderizarProduto((event, dadosProduto) => {
            // Teste de recebimento dos dados do produto.
            console.log(dadosProduto)
            // Passo 6 (slide): renderização dos dados do produto no formulário.
            const renderizadoProduto = JSON.parse(dadosProduto)
            arrayProduto = renderizadoProduto
            // Teste para entendimento da lógica.
            console.log(arrayProduto)
            // Percorrer o array de produtos, extrair os dados e setar (preencher) os campos do formulário.
            arrayProduto.forEach((c) => {
                document.getElementById('inputNameProduct').value = c.nomeProduto
                document.getElementById('inputCodProduct').value = c.codProduto
                document.getElementById('inputPrecoProduct').value = c.precoProduto
                document.getElementById('inputIdProduct').value = c._id
                // Limpar o campo de busca e remover o foco.
                foco.value = ""
                // Validação e correção de BUGs.
                foco.disabled = true
                btnRead.disabled = true
                // Desativar o botão adicionar.
                btnCreate.disabled = true
                //foco.blur()
                // Liberar os botões editar e excluir.
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                // Restaurar o padrão da tecla Enter.
                restaurarEnter()
                // Reativar os inputs das caixas de textos.
                /*
                document.querySelectorAll('.bloqueio input').forEach(input => {
                    input.disabled = false
                })
                    */

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
        // Setar o nome do cliente. 
        let campoNome = document.getElementById('searchProduct').value
        document.getElementById('inputNameProduct').focus()
        document.getElementById('inputNameProduct').value = campoNome
        // Limpar o campo de busca e remover o foco.
        foco.value = ""
        foco.blur()
        // Restaurar o padrão da tecla Enter.
        restaurarEnter()
        // Reativar os inputs das caixas de textos.
        /*
        document.querySelectorAll('.bloqueio input').forEach(input => {
            input.disabled = false
            
        })
            */
    })
}

function buscarProdutoCod() {
    // Passo 1 (slides).
    let proCod = document.getElementById('searchBarcode').value
    // Validação.
    if (proCod === "") {
        api.validarBusca() // Validação do campo obrigatório.
        foco.focus()
    } else {
        //console.log(proCod) // Teste do passo 1.
        // Passo 2 (slide) - enviar o pedido de busca do produto ao main.
        api.buscarProdutoCod(proCod)
        // Passo 5 - Recebimento dos dados do produto.
        api.renderizarProdutoCod((event, dadosProdutoCod) => {
            // Teste de recebimento dos dados do produto.
            console.log(dadosProdutoCod)
            // Passo 6 (slide): renderização dos dados do produto no formulário.
            const renderizadoProdutoCod = JSON.parse(dadosProdutoCod)
            arrayProduto = renderizadoProdutoCod
            // Teste para entendimento da lógica.
            console.log(arrayProduto)
            // Percorrer o array de produtos, extrair os dados e setar (preencher) os campos do formulário.
            arrayProduto.forEach((c) => {
                document.getElementById('inputNameProduct').value = c.nomeProduto
                document.getElementById('inputCodProduct').value = c.codProduto
                document.getElementById('inputPrecoProduct').value = c.precoProduto
                document.getElementById('inputIdProduct').value = c._id
                // Limpar o campo de busca e remover o foco.
                foco.value = ""
                // Validação e correção de BUGs.
                foco.disabled = true
                btnRead.disabled = true
                // Desativar o botão adicionar.
                btnCreate.disabled = true
                //foco.blur()
                // Liberar os botões editar e excluir.
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                // Restaurar o padrão da tecla Enter.
                restaurarEnter()
                // Reativar os inputs das caixas de textos.
                /*
                document.querySelectorAll('.bloqueio input').forEach(input => {
                    input.disabled = false
                })
                    */
            })
        })
    }
    // Setar o código do produto e liberar o botão adicionar.
    api.setarCodProduto(() => {
        // Setar o código do produto. 
        let campoCod = document.getElementById('searchBarcode').value
        document.getElementById('inputCodProduct').focus()
        document.getElementById('inputCodProduct').value = campoCod
        // Limpar o campo de busca e remover o foco.
        foco.value = ""
        foco.blur()
        // Restaurar o padrão da tecla Enter.
        // Restaurar o padrão da tecla Enter.
        restaurarEnter()
        // Reativar os inputs das caixas de textos.
        /*
        document.querySelectorAll('.bloqueio input').forEach(input => {
            input.disabled = false
            
        })
            */
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