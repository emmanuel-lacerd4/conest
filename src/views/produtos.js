/**
 * Processo de Renderização: 
 * produtos.html
 */

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

// Reset form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    console.log("teste de recebimento do main.js - pedido para resetar o form")
    document.getElementById('inputNameProduct').value = ""
    document.getElementById('inputCodProduct').value = ""
    document.getElementById('inputPrecoProduct').value = ""
})


// Fim do reset form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<