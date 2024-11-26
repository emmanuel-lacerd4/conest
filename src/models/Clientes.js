/**
 * Modelo de dados (Clientes)
 */

// Importação de bibliotecas
const { model, Schema } = require('mongoose')

// Criação da estrutura de dados ("tabela") que será usada no banco
const clienteSchema = new Schema({
    nomeCliente: {
        type: String
    },
    foneCliente: {
        type: String
    },
    emailCliente: {
        type: String
    }
})

// Exportar para o main.js
// Para modificar o nome da coleção ("tabela"), basta modificar na linha abaixo o rótulo 'Clientes', sempre iniciando com a letra maiuscula
module.exports = model('Clientes', clienteSchema)