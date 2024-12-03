/**
 * Processo de Renderização: 
 * clientes.html
 */

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// Passo 1 - slide (capturar os dados dos inputs form)
let formCliente = document.getElementById('frmClient')
let nomeCliente = document.getElementById('inputNameClient')
let foneCliente = document.getElementById('inputPhoneClient')
let emailCliente = document.getElementById('inputEmailClient')
let cepCliente = document.getElementById('inputCepClient');
let cidadeCliente = document.getElementById('inputCityClient');
let ufCliente = document.getElementById('inputStateClient');
let logradouroCliente = document.getElementById('inputStreetClient');
let numeroCliente = document.getElementById('inputNumberClient');
let complementoCliente = document.getElementById('inputComplementClient');
let bairroCliente = document.getElementById('inputNeighborhoodClient');


// Evento associado ao botão adicionar (quando o botão for pressionado)
formCliente.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form
    event.preventDefault();

    // Teste importante! (fluxo dos dados)
    console.log(nomeCliente.value, foneCliente.value, emailCliente.value, cepCliente.value);

    // Criar um objeto com os dados do cliente
    const cliente = {
        nomeCli: nomeCliente.value,
        foneCli: foneCliente.value,
        emailCli: emailCliente.value,
        cepCli: document.getElementById('inputCepClient').value, // Pega o valor do campo correto
        cidadeCli: document.getElementById('inputCityClient').value,
        ufCli: document.getElementById('inputStateClient').value,
        logradouroCli: document.getElementById('inputStreetClient').value,
        numeroCli: document.getElementById('inputNumberClient').value,
        complementoCli: document.getElementById('inputComplementClient').value,
        bairroCli: document.getElementById('inputNeighborhoodClient').value
    };

    try {
        // Chama a função api.novoCliente e aguarda a resposta
        const response = await api.novoCliente(cliente);
        console.log("Resposta da API:", response);

        // Verifique se a resposta tem a propriedade "success"
        if (response && response.success) {
            console.log('Cliente adicionado com sucesso!');
        } else {
            console.log('Erro ao adicionar cliente:', response); // Mostra a resposta completa em caso de erro
        }
    } catch (error) {
        // Caso ocorra um erro na chamada da API
        console.error('Erro ao salvar cliente no banco de dados:', error);
    }
});

// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Reset form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    console.log("teste de recebimento do main.js - pedido para resetar o form")
    document.getElementById('inputNameClient').value = ""
    document.getElementById('inputPhoneClient').value = ""
    document.getElementById('inputEmailClient').value = ""
    document.getElementById('inputCepClient').value = ""
    document.getElementById('inputCityClient').value = ""
    document.getElementById('inputStateClient').value = ""
    document.getElementById('inputStreetClient').value = ""
    document.getElementById('inputNumberClient').value = ""
    document.getElementById('inputComplementClient').value = ""
    document.getElementById('inputNeighborhoodClient').value = ""
})


// Fim do reset form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<