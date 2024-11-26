/**
 * Modelo de dados (Fornecedores)
 */

// Importação de bibliotecas
const { model, Schema } = require('mongoose')

// Criação da estrutura de dados ("tabela") que será usada no banco
const fornecedorSchema = new Schema({
    nomeFornecedor: {
        type: String
    },
    foneFornecedor: {
        type: String
    },
    siteFornecedor: {
        type: String
    }
})

// Exportar para o main.js
// Para modificar o nome da coleção ("tabela"), basta modificar na linha abaixo o rótulo 'Fornecedores', sempre iniciando com a letra maiuscula
module.exports = model('Fornecedores', fornecedorSchema)