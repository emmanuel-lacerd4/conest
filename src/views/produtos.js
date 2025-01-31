/**
 * Processo de Renderização: 
 * produtos.html
 */

const foco = document.getElementById('searchProduct')

// Mudar as propriedades do documento html ao iniciar a janela.
document.addEventListener('DOMContentLoaded', () => {
    btnCreate.disabled = true
    btnUpdate.disabled = true
    btnDelete.disabled = true
    foco.focus()
    // Desativar o input das caixas de texto denro da div .bloqueio.
    document.querySelectorAll('.bloqueio input').forEach(input => {
        input.disabled = true
    })
})

// Função para manipular o evento da tecla Enter.
function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarProduto()
    }
}

// Função para manipular o evento da tecla Enter.
function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarProdutoCod()
    }
}

// Função para remover o manipulador do evento da tecla Enter.
function restaurarEnter() {
    document.getElementById('frmProduct').removeEventListener('keydown', teclaEnter)
}

// Manipulando o evento (tecla Enter).
document.getElementById('frmProduct').addEventListener('keydown', teclaEnter)

// Array usado nós métodos para manipulação da estrutura de dados.
let arrayProduto = []

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Passo 1 - slide (capturar os dados dos inputs form)
let formProduto = document.getElementById('frmProduct')
let idProduto = document.getElementById('inputIdProduct')
let nomeProduto = document.getElementById('inputNameProduct')
let codProduto = document.getElementById('inputCodProduct')
let precoProduto = document.getElementById('inputPrecoProduct')

// CRUD Create/Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Evento associado ao botão adicionar (quando o botão for pressionado).
formProduto.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form.
    event.preventDefault()
    // Teste importante! (fluxo dos dados).
    console.log(idProduto.value, nomeProduto.value, codProduto.value, precoProduto.value)

    // Passo 2 - slide (envio das informações para o main).
    // Estratégia para determinar se é um novo cadastro de produtos ou a edição de um produto já existente.
    if (idProduto.value === "") {
        // Criar um objeto.
        const produto = {
            nomePro: nomeProduto.value,
            codPro: codProduto.value,
            precoPro: precoProduto.value
        }
        api.novoProduto(produto)
    } else {
        // Criar um novo objeto com o ID do produto.
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
    console.log(proNome)
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
            const produtoRenderizado = JSON.parse(dadosProduto)
            arrayProduto = produtoRenderizado
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
                foco.blur()
                // Liberar os botões editar e excluir.
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                // Restaurar o padrão da tecla Enter.
                restaurarEnter()
                // Reativar os inputs das caixas de textos.
                document.querySelectorAll('.bloqueio input').forEach(input => {
                    input.disabled = false
                })
            })
        })
    }
    // Setar o nome do produto e liberar o botão adicionar.
    api.setarNomeProduto(() => {
        // Setar o nome do produto.     
        let campoNome = document.getElementById('searchProduct').value
        document.getElementById('inputNameProduct').focus()
        document.getElementById('inputNameProduct').value = campoNome
        // Limpar o campo de busca e remover o foco.
        foco.value = ""
        foco.blur()
        // Liberar o botão adicionar.
        btnCreate.disabled = false
        // Restaurar o padrão da tecla Enter.
        restaurarEnter()
        // Reativar os inputs das caixas de textos.
        document.querySelectorAll('.bloqueio input').forEach(input => {
            input.disabled = false
        })
    })
}
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarProdutoCod() {
    // Passo 1 (slides).
    let proCod = document.getElementById('searchProduct').value
    console.log(proCod)
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
            const produtoRenderizadoCod = JSON.parse(dadosProdutoCod)
            arrayProduto = produtoRenderizadoCod
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
                btnCreate = true
                //foco.blur()
                // Liberar os botões editar e excluir.
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                // Restaurar o padrão da tecla Enter.
                restaurarEnter()
                // Reativar os inputs das caixas de textos.
                document.querySelectorAll('.bloqueio input').forEach(input => {
                    input.disabled = false
                })
            })
        })
    }
    // Setar o nome do produto e liberar o botão adicionar.
    api.setarNomeProduto(() => {
        // Setar o nome do produto.     
        let campoNome = document.getElementById('searchProduct').value
        document.getElementById('inputNameProduct').focus()
        document.getElementById('inputNameProduct').value = campoNome
        // Limpar o campo de busca e remover o foco.
        foco.value = ""
        foco.blur()
        // Liberar o botão adicionar.
        btnCreate.disabled = false
        // Restaurar o padrão da tecla Enter.
        restaurarEnter()
        // Reativar os inputs das caixas de textos.
        document.querySelectorAll('.bloqueio input').forEach(input => {
            input.disabled = false
        })
    })
}
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function excluirProduto() {
    api.deletarProduto(idProduto.value) // Passo 1 do slide
}
// Fim CRUD Delete <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Reset Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    resetForm()
})

function resetForm() {
    // Recarregar a página.
    location.reload()
}
// Fim do reset form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<