/**
 * Funções reutilizáveis para validação, formatação e busca
 * @author Emmanuel L. Nogueira
 */

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

/** Formatar CNPJ (apenas visual) */
function formatarCnpj(input) {
    let value = input.value.replace(/\D/g, '')
    if (value.length > 14) value = value.substring(0, 14)
    if (value.length > 12) value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
    else if (value.length > 8) value = value.replace(/(\d{2})(\d{3})(\d{3})(\d)/, '$1.$2.$3/$4')
    else if (value.length > 5) value = value.replace(/(\d{2})(\d{3})(\d)/, '$1.$2.$3')
    else if (value.length > 2) value = value.replace(/(\d{2})(\d)/, '$1.$2')
    input.value = value
}

/** Validar CNPJ */
function validarCnpj(input) {
    const cnpj = input.value.replace(/\D/g, '')
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
        input.style.borderColor = 'red'
        input.setCustomValidity('CNPJ inválido!')
        return false
    }
    let soma = 0
    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    for (let i = 0; i < 12; i++) soma += parseInt(cnpj[i]) * pesos1[i]
    let resto = soma % 11
    let digito1 = resto < 2 ? 0 : 11 - resto
    if (digito1 !== parseInt(cnpj[12])) {
        input.style.borderColor = 'red'
        input.setCustomValidity('CNPJ inválido!')
        return false
    }
    soma = 0
    const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    for (let i = 0; i < 13; i++) soma += parseInt(cnpj[i]) * pesos2[i]
    resto = soma % 11
    let digito2 = resto < 2 ? 0 : 11 - resto
    if (digito2 !== parseInt(cnpj[13])) {
        input.style.borderColor = 'red'
        input.setCustomValidity('CNPJ inválido!')
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

/** Formatar Barcode (EAN-13, apenas visual) */
function formatarBarcode(input) {
    let value = input.value.replace(/\D/g, '')
    if (value.length > 13) value = value.substring(0, 13)
    if (value.length === 13) value = value.replace(/(\d{1})(\d{5})(\d{5})(\d{2})/, '$1-$2-$3-$4')
    input.value = value
}

/** Exibir Mensagem de Erro */
function exibirErro(campo, mensagem) {
    campo.style.borderColor = 'red'
    campo.setCustomValidity(mensagem)
    alert(mensagem)
}