const { GoogleGenerativeAI } = require("@google/generative-ai");

// Coloque sua chave aqui para testar
const genAI = new GoogleGenerativeAI("AIzaSyAHR2LAsawETTrF26crexVAWrr9v0QAtkg");

async function validarChave() {
  try {
    const modelo = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const resultado = await modelo.generateContent("Diga 'Chave Ativa'!");
    const resposta = await resultado.response;
    
    console.log("✅ SUCESSO!");
    console.log("Resposta da IA:", resposta.text());
  } catch (erro) {
    console.log("❌ FALHA NA CHAVE!");
    console.error("Motivo:", erro.message);
  }
}

validarChave();
