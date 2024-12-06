/**
 * Processo de renderização
 * clientes.html
 */
// Array usado nós métodos para manipulação da estrutura de dados
let arrayCliente = []

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Passo 1 - slide (capturar os dados dos inputs do form)
let formCliente = document.getElementById('frmClient')
let nomeCliente = document.getElementById('inputNameClient')
let foneCliente = document.getElementById('inputPhoneClient')
let emailCliente = document.getElementById('inputEmailClient')
let cepCliente = document.getElementById('inputCepClient')
let cidadeCliente = document.getElementById('inputCityClient')
let estadoCliente = document.getElementById('inputStateClient')
let enderecoCliente = document.getElementById('inputStreetClient')
let numeroCliente = document.getElementById('inputNumberClient')
let complementoCliente = document.getElementById('inputComplementClient')
let bairroCliente = document.getElementById('inputNeighborhoodClient')

// Evento associado ao botão adicionar (quando o botão for pressionado)
formCliente.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form
    event.preventDefault()
    // Teste importante! (fluxo dos dados)
    console.log(nomeCliente.value, foneCliente.value, emailCliente.value, cepCliente.value, cidadeCliente.value, estadoCliente, enderecoCliente, numeroCliente, complementoCliente, bairroCliente)

    // Passo 2 - slide (envio das informações para o main)
    // criar um objeto
    const cliente = {
        nomeCli: nomeCliente.value,
        foneCli: foneCliente.value,
        emailCli: emailCliente.value,
        cepCli: cepCliente.value,
        cidadeCli: cidadeCliente.value,
        estadoCli: estadoCliente.value,
        enderecoCli: enderecoCliente.value,
        numeroCli: numeroCliente.value,
        complementoCli: complementoCliente.value,
        bairroCli: bairroCliente.value
    }
    api.novoCliente(cliente)
})
// Fim CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarCliente() {
    // Passo 1 (slides)
    let cliNome = document.getElementById('searchClient').value
    console.log(cliNome) // Teste do passo 1
    // Passo 2 (slide) - enviar o pedido de busca do cliente ao main
    api.buscarCliente(cliNome)
    // Passo 5 - Recebimento dos dados do cliente
    api.renderizarCliente((event, dadosCliente) => {
        // (Teste de recebimento dos dados do cliente)
        console.log(dadosCliente)
        // Passo 6 (slide): renderização dos dados do cliente no formulário
        const clienteRenderizado = JSON.parse(dadosCliente)
        arrayCliente = clienteRenderizado
        // Teste para entendimento da lógica
        console.log(arrayCliente)
        // Percorrer o array de clientes, extrair os dados e setar (preencher) os campos do formulário
        arrayCliente.forEach((c) => {
            document.getElementById('inputClient').value = c._id
            document.getElementById('inputNameClient').value = c.nomeCliente
            document.getElementById('inputPhoneClient').value = c.foneCliente
            document.getElementById('inputEmailClient').value = c.emailCliente
            document.getElementById('inputCepClient').value = c.cepCliente
            document.getElementById('inputCityClient').value = c.cidadeCliente
            document.getElementById('inputStateClient').value = c.estadoCliente
            document.getElementById('inputStreetClient').value = c.enderecoCliente
            document.getElementById('inputNumberClient').value = c.numeroCliente
            document.getElementById('inputComplementClient').value = c.complementoCliente
            document.getElementById('inputNeighborhoodClient').value = c.bairroCliente
        })
    })
}
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Função para buscar o CEP
function buscarCep(cep) {
    // Verifica se o CEP possui 8 caracteres (ex: 12345678)
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    //alert("CEP não encontrado.")
                } else {
                    // Preenche os campos do formulário com os dados do CEP
                    document.getElementById('inputStreetClient').value = data.logradouro || ""
                    document.getElementById('inputNeighborhoodClient').value = data.bairro || ""
                    document.getElementById('inputCityClient').value = data.localidade || ""
                    document.getElementById('inputStateClient').value = data.uf || ""
                }
            })
            .catch(erro => {
                //alert("Erro ao buscar CEP.")
                console.error(erro);
            });
    } else {
        //alert("Por favor, insira um CEP válido.")
    }
}

// Formatar CEP
function formatarCEP(input) {
    let value = input.value.replace(/\D/g, '') // Remove caracteres não numéricos
    if (value.length > 5) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o hífen
    }
    input.value = value
}

// Função chamada ao perder o foco ou ao digitar no campo CEP
document.getElementById('inputCepClient').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '') // Remove qualquer caractere não numérico
    if (cep) {
        buscarCep(cep)
    }
})

// Caso o usuário insira o CEP e pressione Enter, também podemos buscar
document.getElementById('inputCepClient').addEventListener('input', function () {
    const cep = this.value.replace(/\D/g, '') // Remove qualquer caractere não numérico
    if (cep.length === 8) {  // Se o CEP já tiver 8 caracteres
        buscarCep(cep)
    }
})

// Reset Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    console.log("teste de recebimento do main - pedido para resetar o form")
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
// Fim - reset form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<