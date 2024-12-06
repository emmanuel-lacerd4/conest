/**
 * Processo de Renderização: 
 * fornecedores.html
 */
// Array usado nós métodos para manipulação da estrutura de dados
let arrayFornecedor = []

// CRUD Create >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Passo 1 - slide (capturar os dados dos inputs form)
let formFornecedor = document.getElementById('frmSupplier')
let nomeFornecedor = document.getElementById('inputNameSupplier')
let foneFornecedor = document.getElementById('inputPhoneSupplier')
let siteFornecedor = document.getElementById('inputSiteSupplier')
let cepFornecedor = document.getElementById('inputCepSupplier')
let cidadeFornecedor = document.getElementById('inputCitySupplier')
let estadoFornecedor = document.getElementById('inputStateSupplier')
let enderecoFornecedor = document.getElementById('inputStreetSupplier')
let numeroFornecedor = document.getElementById('inputNumberSupplier')
let complementoFornecedor = document.getElementById('inputComplementSupplier')
let bairroFornecedor = document.getElementById('inputNeighborhoodSupplier')

// Evento associado ao botão adicionar (quando o botão for pressionado)
formFornecedor.addEventListener('submit', async (event) => {
    // Evitar o comportamento padrão de envio em um form
    event.preventDefault()
    // Teste importante! (fluxo dos dados)
    console.log(nomeFornecedor.value, foneFornecedor.value, siteFornecedor.value, cepFornecedor.value, cidadeFornecedor.value, estadoFornecedor.value, enderecoFornecedor.value, numeroFornecedor.value, complementoFornecedor.value, bairroFornecedor.value)

    // Passo 2 - slide (envio das informações para o main)
    // Criar um objeto
    const fornecedor = {
        nomeFor: nomeFornecedor.value,
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
    api.novoFornecedor(fornecedor)
})
// Fim do CRUD Create <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// CRUD Read >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarFornecedor() {
    // Passo 1 (slides)
    let forNome = document.getElementById('searchSupplier').value
    console.log(forNome) // Teste do passo 1
    // Passo 2 (slide) - enviar o pedido de busca do fornecedor ao main
    api.buscarFornecedor(forNome)
    // Passo 5 - Recebimento dos dados do fornecedor
    api.renderizarFornecedor((event, dadosFornecedor) => {
        // (Teste de recebimento dos dados do fornecedor)
        console.log(dadosFornecedor)
        // Passo 6 (slide): renderização dos dados do fornecedor no formulário
        const fornecedorRenderizado = JSON.parse(dadosFornecedor)
        arrayFornecedor = fornecedorRenderizado
        // Teste para entendimento da lógica
        console.log(arrayFornecedor)
        // Percorrer o array de fornecedores, extrair os dados e setar (preencher) os campos do formulário
        arrayFornecedor.forEach((c) => {
            document.getElementById('inputSupplier').value = c._id
            document.getElementById('inputNameSupplier').value = c.nomeFornecedor
            document.getElementById('inputPhoneSupplier').value = c.foneFornecedor
            document.getElementById('inputSiteSupplier').value = c.siteFornecedor
            document.getElementById('inputCepSupplier').value = c.cepFornecedor
            document.getElementById('inputCitySupplier').value = c.cidadeFornecedor
            document.getElementById('inputStateSupplier').value = c.estadoFornecedor
            document.getElementById('inputStreetSupplier').value = c.enderecoFornecedor
            document.getElementById('inputNumberSupplier').value = c.numeroFornecedor
            document.getElementById('inputComplementSupplier').value = c.complementoFornecedor
            document.getElementById('inputNeighborhoodSupplier').value = c.bairroFornecedor
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
                    document.getElementById('inputStreetSupplier').value = data.logradouro || ""
                    document.getElementById('inputNeighborhoodSupplier').value = data.bairro || ""
                    document.getElementById('inputCitySupplier').value = data.localidade || ""
                    document.getElementById('inputStateSupplier').value = data.uf || ""
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
document.getElementById('inputCepSupplier').addEventListener('blur', function () {
    const cep = this.value.replace(/\D/g, '') // Remove qualquer caractere não numérico
    if (cep) {
        buscarCep(cep)
    }
})

// Caso o usuário insira o CEP e pressione Enter, também podemos buscar
document.getElementById('inputCepSupplier').addEventListener('input', function () {
    const cep = this.value.replace(/\D/g, '') // Remove qualquer caractere não numérico
    if (cep.length === 8) {  // Se o CEP já tiver 8 caracteres
        buscarCep(cep)
    }
})

// Reset form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    console.log("teste de recebimento do main.js - pedido para resetar o form")
    document.getElementById('inputNameSupplier').value = ""
    document.getElementById('inputPhoneSupplier').value = ""
    document.getElementById('inputSiteSupplier').value = ""
    document.getElementById('inputCepSupplier').value = ""
    document.getElementById('inputCitySupplier').value = ""
    document.getElementById('inputStateSupplier').value = ""
    document.getElementById('inputStreetSupplier').value = ""
    document.getElementById('inputNumberSupplier').value = ""
    document.getElementById('inputComplementSupplier').value = ""
    document.getElementById('inputNeighborhoodSupplier').value = ""
})
// Fim do reset form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<