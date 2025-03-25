/**
 * Processo de renderização da tela de Clientes
 * clientes.html
 */

/** Funções reutilizáveis para validação, formatação e busca */

/** Busca de CEP */
function buscarCep(cep, campos) {
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(dados => {
                if (!dados.erro) {
                    campos.rua.value = dados.logradouro || ''
                    campos.bairro.value = dados.bairro || ''
                    campos.cidade.value = dados.localidade || ''
                    campos.estado.value = dados.uf || ''
                }
            })
            .catch(error => console.error('Erro ao buscar CEP:', error))
    }
}

/** Formatar CEP */
function formatarCep(input) {
    let value = input.value.replace(/\D/g, '')
    if (value.length > 5) value = value.replace(/(\d{5})(\d)/, '$1-$2')
    input.value = value
}

/** Formatar CPF (apenas visual) */
function formatarCpf(input) {
    let value = input.value.replace(/\D/g, '')
    if (value.length > 11) value = value.substring(0, 11)
    if (value.length > 9) value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
    else if (value.length > 6) value = value.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3')
    else if (value.length > 3) value = value.replace(/(\d{3})(\d)/, '$1.$2')
    input.value = value
}

/** Validar CPF */
function validarCpf(input) {
    const cpf = input.value.replace(/\D/g, '')
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        input.style.borderColor = 'red'
        input.setCustomValidity('CPF inválido!')
        return false
    }
    let soma = 0
    for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i)
    let resto = (soma * 10) % 11
    if (resto > 9) resto = 0
    if (resto !== parseInt(cpf[9])) {
        input.style.borderColor = 'red'
        input.setCustomValidity('CPF inválido!')
        return false
    }
    soma = 0
    for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i)
    resto = (soma * 10) % 11
    if (resto > 9) resto = 0
    if (resto !== parseInt(cpf[10])) {
        input.style.borderColor = 'red'
        input.setCustomValidity('CPF inválido!')
        return false
    }
    input.style.borderColor = 'green'
    input.setCustomValidity('')
    return true
}

/** Formatar Telefone */
function formatarTelefone(input) {
    let value = input.value.replace(/\D/g, '')
    if (value.length > 10) value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    else if (value.length > 6) value = value.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3')
    else if (value.length > 2) value = value.replace(/(\d{2})(\d)/, '($1) $2')
    input.value = value
}

/** Verificar Campos Obrigatórios */
function verificarCampos(camposIds) {
    let camposVazios = []
    camposIds.forEach(id => {
        const campo = document.getElementById(id)
        if (!campo.value.trim()) {
            camposVazios.push(id)
            campo.style.borderColor = 'red'
        } else {
            campo.style.borderColor = ''
        }
    })
    return camposVazios.length === 0
}

/** Exibir Mensagem de Erro */
function exibirErro(campo, mensagem) {
    campo.style.borderColor = 'red'
    campo.setCustomValidity(mensagem)
    alert(mensagem)
}

// Lógica principal do clientes.js
const foco = document.getElementById('searchClient')

document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    foco.focus()
})

function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarCliente()
    }
}

function restaurarEnter() {
    document.getElementById('frmClient').removeEventListener('keydown', teclaEnter)
}

document.getElementById('frmClient').addEventListener('keydown', teclaEnter)

let arrayCliente = []

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

formCliente.addEventListener('submit', (event) => {
    event.preventDefault()
    const cpfLimpo = cpfCliente.value.replace(/\D/g, '')
    if (!validarCpf(cpfCliente)) return
    const camposIds = [
        'inputNameClient', 'inputPhoneClient', 'inputEmailClient', 'inputCepClient',
        'inputStreetClient', 'inputCityClient', 'inputStateClient', 'inputNumberClient'
    ]
    if (!verificarCampos(camposIds)) return

    const cliente = {
        idCli: idCliente.value || '',
        nomeCli: nomeCliente.value,
        cpfCli: cpfLimpo,
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

    if (idCliente.value === '') {
        window.api.novoCliente(cliente)
    } else {
        window.api.editarCliente(cliente)
    }
})

function buscarCliente() {
    let cliNome = document.getElementById('searchClient').value
    if (cliNome === "") {
        window.api.validarBusca()
        foco.focus()
    } else {
        window.api.buscarCliente(cliNome)
        window.api.renderizarCliente((event, dadosCliente) => {
            const clienteRenderizado = JSON.parse(dadosCliente)
            arrayCliente = clienteRenderizado
            arrayCliente.forEach((c) => {
                nomeCliente.value = c.nomeCliente
                cpfCliente.value = c.cpfCliente
                foneCliente.value = c.foneCliente
                emailCliente.value = c.emailCliente
                cepCliente.value = c.cepCliente
                cidadeCliente.value = c.cidadeCliente
                estadoCliente.value = c.estadoCliente
                enderecoCliente.value = c.enderecoCliente
                numeroCliente.value = c.numeroCliente
                complementoCliente.value = c.complementoCliente
                bairroCliente.value = c.bairroCliente
                idCliente.value = c._id
                foco.value = ""
                foco.disabled = true
                btnRead.disabled = true
                btnCreate.disabled = true
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                restaurarEnter()
            })
        })
    }
    window.api.setarNomeCliente(() => {
        let campoNome = document.getElementById('searchClient').value
        nomeCliente.focus()
        nomeCliente.value = campoNome
        foco.value = ""
        foco.blur()
        restaurarEnter()
    })
}

window.api.clearCpf(() => {
    cpfCliente.value = ""
    cpfCliente.focus()
    cpfCliente.style.borderColor = "red"
})

document.getElementById('inputCepClient').addEventListener('input', function () {
    formatarCep(this)
    const cep = this.value.replace(/\D/g, '')
    if (cep.length === 8) buscarCep(cep, { rua: enderecoCliente, bairro: bairroCliente, cidade: cidadeCliente, estado: estadoCliente })
})

document.getElementById('inputCpfClient').addEventListener('input', function () {
    formatarCpf(this)
})

document.getElementById('inputCpfClient').addEventListener('blur', function () {
    validarCpf(this)
})

document.getElementById('inputPhoneClient').addEventListener('input', function () {
    formatarTelefone(this)
})

function excluirCliente() {
    window.api.deletarCliente(idCliente.value)
}

window.api.resetarFormulario(() => {
    resetForm()
})

function resetForm() {
    location.reload()
}