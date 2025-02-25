/**
 * Processo de renderização da tela de Produtos
 * produtos.html
 */

const foco = document.getElementById('searchProduct')

// Configuração inicial do formulário.
document.addEventListener('DOMContentLoaded', () => {
    btnUpdate.disabled = true
    btnDelete.disabled = true
    foco.focus()
})

// Função para manipular o evento da tecla Enter.
function teclaEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault()
        buscarProduto()
    }
}

// Função para remover o manipulador do evento da tecla Enter.
function restaurarEnter() {
    document.getElementById('frmProduct').removeEventListener('keydown', teclaEnter)
}

// Manipulando o evento (tecla Enter).
document.getElementById('frmProduct').addEventListener('keydown', teclaEnter)

// Array usado nos métodos para manipulação da estrutura de dados
let arrayProduto = []

// Captura dos inputs do formulário
let formProduto = document.getElementById('frmProduct')
let idProduto = document.getElementById('inputIdProduct')
let barcodeProduto = document.getElementById('inputBarcodeProduct')
let nomeProduto = document.getElementById('inputNameProduct')
let imagem = document.getElementById('imageProductPreview')
let precoProduto = document.getElementById('inputPrecoProduct')

// Variável usada para armazenar o caminho da imagem.
let caminhoImagem

// Inicio do CRUD CREATE/UPDATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// Solicitar ao main o uso do explorador de arquivos e armazenar o caminho da imagem selecionada na variável caminhoImagem.
async function uploadImage() {
    caminhoImagem = await api.selecionarArquivo()
    console.log(caminhoImagem)
    // Correção de BUG seleção de imagem.
    if (caminhoImagem) {
        imagem.src = `file://${caminhoImagem}`
    }
    btnCreate.focus() // Correção de BUG (tecla Enter).
}

// Função para formatar o campo de preço com duas casas decimais
function formatarPreco(event) {
    const input = event.target
    let valor = parseFloat(input.value)

    // Garantir que o valor tenha duas casas decimais
    if (!isNaN(valor)) {
        input.value = valor.toFixed(2)
    }
}

// Adiciona o evento de formatação ao campo de preço
document.getElementById('inputPrecoProduct').addEventListener('blur', formatarPreco)

formProduto.addEventListener('submit', async (event) => {
    event.preventDefault()
    //teste de recebimento dos inputs do formulário (passo 1)
    console.log(idProduto.value, barcodeProduto.value, nomeProduto.value, caminhoImagem.value, precoProduto.value)
    // criar um objeto
    // caminhoImagemPro: caminhoImagem ? caminhoImagem : "" 
    // ? : (operador ternário (if else)) correção de BUG se não existir caminho da imagem (se nenhuma imagem selecionada) enviar uma string vazia ""

    if (idProduto.value === "") {
        const produto = {
            barcodePro: barcodeProduto.value,
            nomePro: nomeProduto.value,
            caminhoImagemPro: caminhoImagem ? caminhoImagem : "",
            precoPro: precoProduto.value
        }
        api.novoProduto(produto)
    } else {
        const produto = {
            idPro: idProduto.value,
            barcodePro: barcodeProduto.value,
            nomePro: nomeProduto.value,
            caminhoImagemPro: caminhoImagem ? caminhoImagem : "",
            precoPro: precoProduto.value
        }
        api.editarProduto(produto)
    }

})
// Fim do CRUD CREATE/UPDATE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Função genérica para buscar produtos
function buscarProdutoGenerico(campo, valor, apiBusca, apiRenderiza) {
    if (valor !== "") {
        apiBusca(valor)
        apiRenderiza((event, dados) => {
            const renderizado = JSON.parse(dados)
            arrayProduto = renderizado
            if (arrayProduto.length === 0) {
                if (campo === 'nomeProduto') {
                    nomeProduto.value = valor
                    document.getElementById('searchProduct').value = ""
                    nomeProduto.focus()
                } else if (campo === 'barcodeProduto') {
                    barcodeProduto.value = valor
                    document.getElementById('searchBarcode').value = ""
                    barcodeProduto.focus()
                }
            } else {
                arrayProduto.forEach((c) => {
                    document.getElementById('inputIdProduct').value = c._id || "" // Preenchendo ID
                    document.getElementById('inputIdProduct').removeAttribute('readonly') // Tornando editável
                    document.getElementById('inputIdProduct').style.display = "block" // Tornando visível
                    document.getElementById('inputBarcodeProduct').value = c.barcodeProduto || ""
                    document.getElementById('inputNameProduct').value = c.nomeProduto || ""
                    document.getElementById('inputPrecoProduct').value = c.precoProduto || ""

                    // Atualiza a imagem do produto
                    if (c.caminhoImagemProduto) {
                        imagem.src = `file://${c.caminhoImagemProduto}`
                        caminhoImagem = c.caminhoImagemProduto // Atualiza o caminho da imagem para edição
                    } else {
                        imagem.src = "../public/img/camera.png" // Imagem padrão caso não haja imagem cadastrada
                        caminhoImagem = "" // Reseta o caminho da imagem
                    }

                    console.log("ID do produto encontrado:", c._id)

                    foco.value = ""
                    foco.disabled = true
                    btnRead.disabled = true
                    btnCreate.disabled = true
                    btnUpdate.disabled = false
                    btnDelete.disabled = false

                    document.getElementById('searchBarcode').value = ""
                    document.getElementById('searchBarcode').disabled = true
                    document.getElementById('searchProduct').value = ""
                    document.getElementById('searchProduct').disabled = true
                })
            }
            isSearching = false
        })
    } else {
        isSearching = false
    }
}

// Função para buscar produto por nome
function buscarProduto() {
    let proNome = document.getElementById('searchProduct').value.trim()

    if (proNome === "") {
        window.api.validarBusca()
        return
    }

    buscarProdutoGenerico('nomeProduto', proNome, api.buscarProduto, api.renderizarProduto)
}

// Inicio do CRUD READ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function buscarProduto() {
    let barcode = document.getElementById('searchProduct').value
    console.log(barcode) // teste passo 1 fluxo (slides)
    //validação
    if (barcode === "") {
        api.validarBusca()
        foco.focus()
    } else {
        api.buscarProduto(barcode) //Passo 2 fluxo (slides)
        // recebimento dos dados do produto
        api.renderizarProduto((event, dadosProduto) => {
            //teste do passo 5
            console.log(dadosProduto)
            //Passo 6 renderização dos dados do produto
            const produtoRenderizado = JSON.parse(dadosProduto)
            arrayProduto = produtoRenderizado
            // percorrer o vetor de produtos extrair os dados e setar(preencher) os campos do formulário e a imagem
            arrayProduto.forEach((p) => {
                document.getElementById('inputIdProduct').value = p._id
                document.getElementById('inputBarcodeProduct').value = p.barcodeProduto
                document.getElementById('inputNameProduct').value = p.nomeProduto
                document.getElementById('').value = p.
                document.getElementById('').value = p.
                //######################### Renderizar imagem
                //validação(imagem não é campo obrigatório)
                //se existir imagem cadastrada
                if (p.caminhoImagemProduto) {
                    imagem.src = p.caminhoImagemProduto
                }
                //limpar o campo de busca, remover o foco e desativar a busca
                foco.value = ""
                foco.disabled = true
                //liberar os botões editar e excluir e bloquer o botão adicionar
                document.getElementById('btnUpdate').disabled = false
                document.getElementById('btnDelete').disabled = false
                document.getElementById('btnCreate').disabled = true
                //restaurar a tecla Enter
                restaurarEnter()
            })

        })
    }
}

// Setar o campo do código de barras (produto não cadastrado).
api.setarBarcode(() => {
    // Setar o barcode do produto.
    let campoBarcode = document.getElementById('searchBarcode').value
    document.getElementById('inputBarcodeProduct').value = campoBarcode
    // Limpar o campo de busca e remover o foco.
    foco.value = ""
    document.getElementById('inputNameProduct').focus()
    // Restaurar a tecla enter (associar ao botão adicionar).
    restaurarEnter()
})

// Fim do CRUD READ <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// Função para excluir produto
function excluirProduto() {
    api.deletarProduto(idProduto.value)
}

// Reset Form >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
api.resetarFormulario((args) => {
    resetForm()
})

function resetForm() {
    //recarregar a página
    location.reload()
}
// Fim - reset form <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<