/**
 * Processo de renderização
 * clientes.html
 */

const foco = document.getElementById('searchClient')

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

// Função para manipular o evento da tecla Enter.
function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarCliente()
    }
}

// Função para remover o manipulador do evento da tecla Enter.
function restaurarEnter() {
    document.getElementById('frmClient').removeEventListener('keydown', teclaEnter)
}

// Manipulando o evento (tecla Enter).
document.getElementById('frmClient').addEventListener('keydown', teclaEnter)

// Array usado nós métodos para manipulação da estrutura de dados.
let arrayCliente = []

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//Passo 1 - slide (capturar os dados dos inputs do form)
let formCliente = document.getElementById('frmClient')
let idCliente = document.getElementById('inputIdClient')
let nomeCliente = document.getElementById('inputNameClient')
let cpfCliente = document.getElementById('inputCpfClient')
let foneCliente = document.getElementById('inputPhoneClient')
let emailCliente = document.getElementById('inputEmailClient')
let cepCliente = document.getElementById('inputCepClient')
let cidadeCliente = document.getElementById('inputCityClient')
let estadoCliente = document.getElementById('inputStateClient')
let enderecoCliente = document.getElementById('inputStreetClient')
let numeroCliente = document.getElementById('inputNumberClient')
let complementoCliente = document.getElementById('inputComplementClient')
let bairroCliente = document.getElementById('inputNeighborhoodClient')

// CRUD Create/Update >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Evento associado ao botão adicionar (quando o botão for pressionado).
formCliente.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form.
    event.preventDefault()
    // Teste importante! (fluxo dos dados).
    console.log(idCliente.value, nomeCliente.value, cpfCliente.value, foneCliente.value, emailCliente.value, cepCliente.value, cidadeCliente.value, estadoCliente.value, enderecoCliente.value, numeroCliente.value, complementoCliente.value, bairroCliente.value)

    // Passo 2 - slide (envio das informações para o main).
    // Estratégia para determinar se é um novo cadastro de clientes ou a edição de um cliente já existente.
    if (idCliente.value === "") {
        // Criar um objeto.
        const cliente = {
            nomeCli: nomeCliente.value,
            cpfCli: cpfCliente.value,
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
    } else {
        // Criar um novo objeto com o ID do cliente.
        const cliente = {
            idCli: idCliente.value,
            nomeCli: nomeCliente.value,
            cpfCli: cpfCliente.value,
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
        api.editarCliente(cliente)
    }
})
// Fim CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarCliente() {
    // Passo 1 (slides).
    let cliNome = document.getElementById('searchClient').value
    // Validação.
    if (cliNome === "") {
        api.validarBusca() // Validação do campo obrigatório.
        foco.focus()
    } else {
        //console.log(cliNome) // Teste do passo 1.
        // Passo 2 (slide) - enviar o pedido de busca do cliente ao main.
        api.buscarCliente(cliNome)
        // Passo 5 - Recebimento dos dados do cliente.
        api.renderizarCliente((event, dadosCliente) => {
            // Teste de recebimento dos dados do cliente.
            console.log(dadosCliente)
            // Passo 6 (slide): renderização dos dados do cliente no formulário.
            const clienteRenderizado = JSON.parse(dadosCliente)
            arrayCliente = clienteRenderizado
            // Teste para entendimento da lógica.
            console.log(arrayCliente)
            // Percorrer o array de clientes, extrair os dados e setar (preencher) os campos do formulário.
            arrayCliente.forEach((c) => {
                document.getElementById('inputNameClient').value = c.nomeCliente
                document.getElementById('inputCpfClient').value = c.cpfCliente
                document.getElementById('inputPhoneClient').value = c.foneCliente
                document.getElementById('inputEmailClient').value = c.emailCliente
                document.getElementById('inputCepClient').value = c.cepCliente
                document.getElementById('inputCityClient').value = c.cidadeCliente
                document.getElementById('inputStateClient').value = c.estadoCliente
                document.getElementById('inputStreetClient').value = c.enderecoCliente
                document.getElementById('inputNumberClient').value = c.numeroCliente
                document.getElementById('inputComplementClient').value = c.complementoCliente
                document.getElementById('inputNeighborhoodClient').value = c.bairroCliente
                document.getElementById('inputIdClient').value = c._id
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
    // Setar o nome do cliente e liberar o botão adicionar.
    api.setarNomeCliente(() => {
        // Setar o nome do cliente.     
        let campoNome = document.getElementById('searchClient').value
        document.getElementById('inputNameClient').focus()
        document.getElementById('inputNameClient').value = campoNome
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
// Fim CRUD Read <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Função para buscar o CEP
function buscarCep(cep) {
    // Verifica se o CEP possui 8 caracteres (ex: 12345678)
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    console.error("CEP não encontrado.")
                } else {
                    // Preenche os campos do formulário com os dados do CEP
                    document.getElementById('inputStreetClient').value = data.logradouro || ""
                    document.getElementById('inputNeighborhoodClient').value = data.bairro || ""
                    document.getElementById('inputCityClient').value = data.localidade || ""
                    document.getElementById('inputStateClient').value = data.uf || ""
                }
            })
            .catch(erro => {
                console.error("Erro ao buscar CEP:", erro)
            })
    }
}

// Função para formatar CEP (XXXXX-XXX)
function formatarCEP(input) {
    let value = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (value.length > 5) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2'); // Adiciona o hífen após os 5 primeiros números
    }
    input.value = value
}

// Evento: Formatar e buscar CEP ao digitar
document.getElementById('inputCepClient').addEventListener('input', function () {
    formatarCEP(this); // Aplica a formatação
    const cep = this.value.replace(/\D/g, '') // Remove qualquer caractere não numérico
    if (cep.length === 8) {  // Se o CEP já tiver 8 caracteres
        buscarCep(cep)
    }
})

// Evento: Buscar CEP ao perder o foco
document.getElementById('inputCepClient').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '') // Remove caracteres não numéricos
    if (cep.length === 8) {
        buscarCep(cep)
    }
});

// Formatar CPF
function formatarCPF(input) {
    let value = input.value.replace(/\D/g, '') // Remove caracteres não numéricos
    if (value.length > 3) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
    }
    if (value.length > 6) {
        value = value.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    }
    if (value.length > 9) {
        value = value.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
    }
    input.value = value
}

// Formatar Telefone (DDD + Número)
function formatarTelefone(input) {
    let value = input.value.replace(/\D/g, '') // Remove caracteres não numéricos
    if (value.length > 2) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2')
    }
    if (value.length > 7) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2')
    }
    input.value = value
}

// Aplicar eventos para CPF e Telefone
document.getElementById('inputCpfClient').addEventListener('input', function() {
    formatarCPF(this)
})

document.getElementById('inputPhoneClient').addEventListener('input', function() {
    formatarTelefone(this)
})

// CRUD Delete >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function excluirCliente() {
    api.deletarCliente(idCliente.value) // Passo 1 do slide
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
// Fim - reset form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<