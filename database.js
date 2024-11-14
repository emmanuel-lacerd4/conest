/**
 * Modulo de Conexão com o Banco de Dados
 * Uso do Mongoose
 */

const mongoose = require('mongoose')

// Definir a URL e autenticação do Banco de Dados

const url = 'mongodb+srv://admin:123%40senac@dbmongo.0lqvd.mongodb.net/'

// Status de Conexão (Icone de Conexão)

let isConnected = false

// Só estabelecer uma conexão se não estiver conectado
const dbConnect = async () => {
    if(isConnected === false) {
        await conectar()
    }
}

// Conectar
const conectar = async () => {
    if(isConnected === false) {
        try {
            await mongoose.connect(url)
            isConnected = true // Sinalizar que o banco está conectado
            console.log("MongoDB conectado")
        }catch (error) {
            console.log(`Problema detectado: ${error}`)
        }
    }
}

// Desconectar
const desconectar = async () => {
    if(isConnected === true) {
        try {
            await mongoose.disconnect(url)
            isConnected = false //Sinalizar que o banco está conectado
            console.log("MongoDB desconectado")
        }catch (error) {
            console.log(`Problema detectado: ${error}`)
        }
    }
}

// Exportar para o main.js as funções desejadas
module.exports = {dbConnect, desconectar}