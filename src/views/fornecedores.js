/**
 * Processo de renderização da tela de Fornecedores
 * fornecedores.html
 */

const foco = document.getElementById('searchSupplier')

function acessarSite() {
    let urlFornecedor = document.getElementById('inputSiteSupplier').value.trim()
    let siteErro = document.getElementById('siteErro')

    if (!siteErro) {
        siteErro = document.createElement('div')
        siteErro.id = 'siteErro'
        siteErro.style.color = 'red'
        siteErro.style.fontSize = '0.9em'
        siteErro.style.marginTop = '5px'
        document.getElementById('inputSiteSupplier').after(siteErro)
    }

    if (!urlFornecedor || urlFornecedor === 'https://') {
        siteErro.textContent = 'Por favor, insira um site válido antes de acessar.'
        return
    }

    if (!/^https:\/\/.+/.test(urlFornecedor)) {
        siteErro.textContent = 'URL inválida! O site deve começar com "https://".'
        return
    }

    siteErro.textContent = ''

    try {
        window.api.abrirSite({ url: urlFornecedor })
    } catch (error) {
        siteErro.textContent = 'Erro ao tentar acessar o site. Verifique a URL.'
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btnUpdate').disabled = true
    document.getElementById('btnDelete').disabled = true
    foco.focus()
})

function teclaEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault()
        buscarFornecedor()
    }
}

function restaurarEnter() {
    document.getElementById('frmSupplier').removeEventListener('keydown', teclaEnter)
}

document.getElementById('frmSupplier').addEventListener('keydown', teclaEnter)

let arrayFornecedor = []

let formFornecedor = document.getElementById('frmSupplier')
let idFornecedor = document.getElementById('inputIdSupplier')
let nomeFornecedor = document.getElementById('inputNameSupplier')
let cnpjFornecedor = document.getElementById('inputCnpjSupplier')
let foneFornecedor = document.getElementById('inputPhoneSupplier')
let siteFornecedor = document.getElementById('inputSiteSupplier')
let cepFornecedor = document.getElementById('inputCepSupplier')
let cidadeFornecedor = document.getElementById('inputCitySupplier')
let estadoFornecedor = document.getElementById('inputStateSupplier')
let enderecoFornecedor = document.getElementById('inputStreetSupplier')
let numeroFornecedor = document.getElementById('inputNumberSupplier')
let complementoFornecedor = document.getElementById('inputComplementSupplier')
let bairroFornecedor = document.getElementById('inputNeighborhoodSupplier')

formFornecedor.addEventListener('submit', async (event) => {
    event.preventDefault()
    const cnpjLimpo = cnpjFornecedor.value.replace(/\D/g, '')
    if (!validarCnpj(cnpjFornecedor)) return
    const camposIds = [
        'inputNameSupplier', 'inputPhoneSupplier', 'inputCepSupplier',
        'inputStreetSupplier', 'inputCitySupplier', 'inputStateSupplier', 'inputNumberSupplier'
    ]
    if (!verificarCampos(camposIds)) return

    const fornecedor = {
        idFor: idFornecedor.value || '',
        nomeFor: nomeFornecedor.value,
        cnpjFor: cnpjLimpo,
        foneFor: foneFornecedor.value,
        siteFor: siteFornecedor.value,
        cepFor: cepFornecedor.value,
        cidadeFor: cidadeFornecedor.value,
        estadoFor: estadoFornecedor.value,
        enderecoFor: enderecoFornecedor.value,
        numeroFor: numeroFornecedor.value,
        complementoFor: complementoFornecedor.value,
        bairroFor: bairroFornecedor.value
    }

    if (idFornecedor.value === '') {
        window.api.novoFornecedor(fornecedor)
    } else {
        window.api.editarFornecedor(fornecedor)
    }
})

function buscarFornecedor() {
    let forNome = foco.value.trim()
    if (forNome === '') {
        window.api.validarBusca()
        foco.focus()
    } else {
        window.api.buscarFornecedor(forNome)
        window.api.renderizarFornecedor((event, dadosFornecedor) => {
            const fornecedorRenderizado = JSON.parse(dadosFornecedor)
            arrayFornecedor = fornecedorRenderizado
            arrayFornecedor.forEach((c) => {
                nomeFornecedor.value = c.nomeFornecedor
                cnpjFornecedor.value = c.cnpjFornecedor
                foneFornecedor.value = c.foneFornecedor
                siteFornecedor.value = c.siteFornecedor
                cepFornecedor.value = c.cepFornecedor
                cidadeFornecedor.value = c.cidadeFornecedor
                estadoFornecedor.value = c.estadoFornecedor
                enderecoFornecedor.value = c.enderecoFornecedor
                numeroFornecedor.value = c.numeroFornecedor
                complementoFornecedor.value = c.complementoFornecedor
                bairroFornecedor.value = c.bairroFornecedor
                idFornecedor.value = c._id
                foco.value = ''
                foco.disabled = true
                document.getElementById('btnRead').disabled = true
                document.getElementById('btnCreate').disabled = true
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                restaurarEnter()
            })
        })
    }
    window.api.setarNomeFornecedor(() => {
        let campoNome = foco.value
        nomeFornecedor.focus()
        nomeFornecedor.value = campoNome
        foco.value = ''
        foco.blur()
        restaurarEnter()
    })
}

window.api.clearCnpj(() => {
    cnpjFornecedor.value = ''
    cnpjFornecedor.focus()
    cnpjFornecedor.style.borderColor = 'red'
})

document.getElementById('inputCepSupplier').addEventListener('input', function () {
    formatarCep(this)
    const cep = this.value.replace(/\D/g, '')
    if (cep.length === 8) buscarCep(cep, { rua: enderecoFornecedor, bairro: bairroFornecedor, cidade: cidadeFornecedor, estado: estadoFornecedor })
})

document.getElementById('inputCnpjSupplier').addEventListener('input', function () {
    formatarCnpj(this)
})

document.getElementById('inputCnpjSupplier').addEventListener('blur', function () {
    validarCnpj(this)
})

document.getElementById('inputPhoneSupplier').addEventListener('input', function () {
    formatarTelefone(this)
})

function excluirFornecedor() {
    window.api.deletarFornecedor(idFornecedor.value)
}

window.api.resetarFormulario(() => {
    resetForm()
})

function resetForm() {
    location.reload()
}