/**
 * Modelo de dados (Produtos)
 */

// Importação de bibliotecas
const { model, Schema } = require('mongoose')

// Criação da estrutura de dados ("tabela") que será usada no banco
const produtoSchema = new Schema({
    codProduto: {
        type: String
    },
    nomeProduto: {
        type: String
    },
    imagemProduto: {
        type: String
    },
    precoProduto: {
        type: String
    }
})

// Exportar para o main.js
// Para modificar o nome da coleção ("tabela"), basta modificar na linha abaixo o rótulo 'Fornecedores', sempre iniciando com a letra maiuscula
module.exports = model('Produtos', produtoSchema)