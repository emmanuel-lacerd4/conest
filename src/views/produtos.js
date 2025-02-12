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
    // Desativar o input das caixas de texto denro da div .bloqueio.
    /*
    document.querySelectorAll('.bloqueio input').forEach(input => {
        input.disabled = true
    })
        */
    // Aviso (pop-up)
    //api.avisoCliente()
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

// CRUD Create/Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Evento associado ao botão adicionar (quando o botão for pressionado).
formProduto.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form.
    event.preventDefault()
    // Teste importante! (fluxo dos dados).
    console.log(idProduto.value, nomeProduto.value, codProduto.value, precoProduto.value)

    // Passo 2 - slide (envio das informações para o main).
    // Estratégia para determinar se é um novo cadastro de clientes ou a edição de um cliente já existente.
    if (idProduto.value === "") {
        // Criar um objeto.
        const produto = {
            nomePro: nomeProduto.value,
            codPro: codProduto.value,
            precoPro: precoProduto.value
        }
        api.novoProduto(produto)
    } else {
        // Criar um novo objeto com o ID do cliente.
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
            // Passo 6 (slide): renderização dos dados do cliente no formulário.
            const renderizadoProduto = JSON.parse(dadosProduto)
            arrayProduto = renderizadoProduto
            // Teste para entendimento da lógica.
            console.log(arrayProduto)
            // Percorrer o array de clientes, extrair os dados e setar (preencher) os campos do formulário.
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

// CRUD Read - Código de Barras >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Função para buscar o produto pelo código de barras
function buscarProdutoCod() {
    // Passo 1 (slides)
    let proCod = document.getElementById('searchBarcode').value
    // Validação
    if (proCod === "") {
        api.validarBusca() // Validação do campo obrigatório.
        foco.focus()
    } else {
        console.log("Buscando produto com código de barras:", proCod)
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
    // Setar o nome do produto e liberar o botão adicionar.
    api.setarCodProduto(() => {
        // Setar o nome do produto.
        let campoCod = document.getElementById('searchBarcode').value
        document.getElementById('inputCodProduct').focus()
        document.getElementById('inputCodProduct').value = campoCod
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
// Fim CRUD Read - Código de Barras >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

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