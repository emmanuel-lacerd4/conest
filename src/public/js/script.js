/**
 * Busca de CEP Automatica
 * @author Emmanuel L. Nogueira
 */

function buscarEndereco() {
    let cep = document.getElementById('inputCepClient').value; // Corrigido para usar o campo correto
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`

    fetch(urlAPI)
        .then(response => response.json())
        .then(dados => {
            document.getElementById('inputStreetClient').value = dados.logradouro || ''
            document.getElementById('inputNeighborhoodClient').value = dados.bairro || ''
            document.getElementById('inputCityClient').value = dados.localidade || ''
            document.getElementById('inputStateClient').value = dados.uf || ''
        })
        .catch(error => console.error('Erro ao buscar o endereço:', error))
}

// Formatar CEP
function formatarCEP(input) {
    let value = input.value.replace(/\D/g, '') // Remove caracteres não numéricos
    if (value.length > 5) {
        value = value.replace(/(\d{5})(\d)/, '$1-$2') // Adiciona o hífen
    }
    input.value = value
}

// Formatar CPF
function formatarCPF(input) {
    let value = input.value.replace(/\D/g, '') // Remove caracteres não numéricos
    if (value.length > 11) {
        value = value.substring(0, 11) // Limita a 11 dígitos
    }
    value = value.replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
    value = value.replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
    value = value.replace(/(\d{2})$/, '-$1') // Adiciona o hífen
    input.value = value;
}

// Formatar Celular
function formatarCelular(input) {
    let value = input.value.replace(/\D/g, '') // Remove caracteres não numéricos
    if (value.length > 10) {
        value = value.replace(/(\d{2})(\d{5})(\d)/, '($1) $2-$3') // Adiciona parênteses e hífen
    } else if (value.length > 6) {
        value = value.replace(/(\d{2})(\d{4})(\d)/, '($1) $2-$3') // Adiciona parênteses e hífen
    } else if (value.length > 2) {
        value = value.replace(/(\d{2})/, '($1) ') // Adiciona parênteses
    }
    input.value = value;
}

function verificarCampos() {
    const camposObrigatorios = [
        'inputNameClient', 'inputPhoneClient', 'inputEmailClient', 'inputCepClient',
        'inputStreetClient', 'inputCityClient', 'inputStateClient', 'inputNumberClient', 'inputComplementClient', 'inputNeighborhoodClient'
    ];
    let camposVazios = []

    // Verifica se os campos obrigatórios estão preenchidos
    camposObrigatorios.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (!elemento.value.trim()) {
            camposVazios.push(campo)
            elemento.style.borderColor = 'red' // Destaca o campo vazio
        } else {
            elemento.style.borderColor = '' // Remove o destaque caso preenchido
        }
    })

    if (camposVazios.length > 0) {
        alert('Por favor, preencha todos os campos obrigatórios.')
    } else {
        alert('Todos os campos foram preenchidos corretamente!')
        // Aqui você pode adicionar a lógica para salvar os dados
    }
}