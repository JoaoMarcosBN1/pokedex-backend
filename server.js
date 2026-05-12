const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Sua chave de API
const genAI = new GoogleGenerativeAI("AIzaSyAHR2LAsawETTrF26crexVAWrr9v0QAtkg");

app.post('/pokemon', async (req, res) => {
    const { nome } = req.body;

    if (!nome) {
        return res.status(400).json({ erro: "Digite o nome de um Pokémon." });
    }

    try {
        // 1. Busca na PokeAPI (Corrigido: removido vírgulas e URLs duplicadas)
        const pokeRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nome.toLowerCase()}`);
        
        const dadosSimples = {
            nome: pokeRes.data.name,
            tipos: pokeRes.data.types.map(t => t.type.name).join(', '),
            foto: pokeRes.data.sprites.front_default
        };

        // 2. Tradução do Gemini (Corrigido: modelo alterado para gemini-1.5-flash)
        const modelo = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
        const prompt = `Você é o Professor Carvalho. Descreva brevemente o Pokémon ${dadosSimples.nome}, que é do tipo ${dadosSimples.tipos}. Seja entusiasmado!`;
        
        const resultado = await modelo.generateContent(prompt);
        const respostaAI = await resultado.response;

        // 3. Envia para o site o objeto JSON completo
        res.json({ 
            texto: respostaAI.text(),
            imagem: dadosSimples.foto 
        });

    } catch (erro) {
        console.error("Erro na busca:", erro.message);
        res.status(404).json({ erro: "Pokémon não encontrado na base de dados!" });
    }
});

app.listen(3000, () => console.log("✅ Servidor rodando em http://localhost:3000"));