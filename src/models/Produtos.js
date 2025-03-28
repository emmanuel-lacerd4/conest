/**
 * Modelo de dados (Produtos)
 */

const { model, Schema } = require('mongoose')

const produtoSchema = new Schema({
    barcodeProduto: {
        type: String,
        unique: true,
        index: true
    },
    nomeProduto: {
        type: String
    },
    caminhoImagemProduto: {
        type: String
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    },
    precoProduto: {
        type: String
    },
    nomeFornecedor: {
        type: String
    },
    produtoFornecedor: {
        type: String
    },
    quantidadeProduto: {
        type: String,
        default: "0"
    },
    unidadeProduto: {
        type: String
    }
}, { versionKey: false })

module.exports = model('Produtos', produtoSchema)