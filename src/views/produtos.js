/**
 * Processo de Renderização: 
 * produtos.html
 */
// Array usado nós métodos para manipulação da estrutura de dados
let arrayProduto = []

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Passo 1 - slide (capturar os dados dos inputs form)
let formProduto = document.getElementById('frmProduct')
let nomeProduto = document.getElementById('inputNameProduct')
let codProduto = document.getElementById('inputCodProduct')
let precoProduto = document.getElementById('inputPrecoProduct')

// Evento associado ao botão adicionar (quando o botão for pressionado)
formProduto.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form
    event.preventDefault()
    // Teste importante! (fluxo dos dados)
    //console.log(nomeProduto.value, codProduto.value, precoProduto.value)

    // Passo 2 - slide (envio das informações para o main)
    // Criar um objeto
    const produto = {
        nomePro: nomeProduto.value,
        codPro: codProduto.value,
        precoPro: precoProduto.value
    }
    api.novoProduto(produto)
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarProduto() {
    // Passo 1 (slides)
    let proNome = document.getElementById('searchProduct').value
    console.log(proNome) // Teste do passo 1
    // Passo 2 (slide) - enviar o pedido de busca do produto ao main
    api.buscarProduto(proNome)
    // Passo 5 - Recebimento dos dados do produto
    api.renderizarProduto((event, dadosProduto) => {
        // (Teste de recebimento dos dados do produto)
        console.log(dadosProduto)
        // Passo 6 (slide): renderização dos dados do produto no formulário
        const produtoRenderizado = JSON.parse(dadosProduto)
        arrayProduto = produtoRenderizado
        // Teste para entendimento da lógica
        console.log(arrayProduto)
        // Percorrer o array de produtos, extrair os dados e setar (preencher) os campos do formulário
        arrayProduto.forEach((c) => {
            document.getElementById('inputProduct').value = c._id
            document.getElementById('inputNameProduct').value = c.nomeProduto
            document.getElementById('inputCodProduct').value = c.codProduto
            document.getElementById('inputPrecoProduct').value = c.precoProduto
        })
    })
}
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarProdutoCod() {
    // Passo 1 (slides)
    let proCod = document.getElementById('searchProduct').value
    console.log(proCod) // Teste do passo 1
    // Passo 2 (slide) - enviar o pedido de busca do produto ao main
    api.buscarProdutoCod(proCod)
    // Passo 5 - Recebimento dos dados do produto
    api.renderizarProduto((event, dadosProdutoCod) => {
        // (Teste de recebimento dos dados do produto)
        console.log(dadosProdutoCod)
        // Passo 6 (slide): renderização dos dados do produto no formulário
        const produtoRenderizado = JSON.parse(dadosProdutoCod)
        arrayProduto = produtoRenderizado
        // Teste para entendimento da lógica
        console.log(arrayProduto)
        // Percorrer o array de produtos, extrair os dados e setar (preencher) os campos do formulário
        arrayProduto.forEach((p) => {
            document.getElementById('inputProduct').value = p._id
            document.getElementById('inputNameProduct').value = p.nomeProduto
            document.getElementById('inputCodProduct').value = p.codProduto
            document.getElementById('inputPrecoProduct').value = p.precoProduto
        })
    })
}
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Reset form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    console.log("teste de recebimento do main.js - pedido para resetar o form")
    document.getElementById('inputNameProduct').value = ""
    document.getElementById('inputCodProduct').value = ""
    document.getElementById('inputPrecoProduct').value = ""
})
// Fim do reset form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<