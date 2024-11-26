/**
 * Processo de Renderização: 
 * fornecedores.html
 */

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Passo 1 - slide (capturar os dados dos inputs form)
let formFornecedor = document.getElementById('frmSupplier')
let nomeFornecedor = document.getElementById('inputNameSupplier')
let foneFornecedor = document.getElementById('inputPhoneSupplier')
let siteFornecedor = document.getElementById('inputSiteSupplier')

// Evento associado ao botão adicionar (quando o botão for pressionado)
formFornecedor.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form
    event.preventDefault()
    // Teste importante! (fluxo dos dados)
    //console.log(nomeFornecedor.value, foneFornecedor.value, siteFornecedor.value)

    // Passo 2 - slide (envio das informações para o main)
    // Criar um objeto
    const fornecedor = {
        nomeFor: nomeFornecedor.value,
        foneFor: foneFornecedor.value,
        siteFor: siteFornecedor.value
    }
    api.novoFornecedor(fornecedor)
})

// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Reset form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    console.log("teste de recebimento do main.js - pedido para resetar o form")
    document.getElementById('inputNameSupplier').value = ""
    document.getElementById('inputPhoneSupplier').value = ""
    document.getElementById('inputSiteSupplier').value = ""
})


// Fim do reset form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<