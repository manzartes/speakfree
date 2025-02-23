const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Configurar CORS e JSON
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos corretamente
app.use(express.static(path.join(__dirname, '../public')));

// Inicializar a API da OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Rota de chat
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "system", content: "Você é um terapeuta online empático e compreensivo." }, { role: "user", content: message }],
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Algo deu errado." });
  }
});

// Rota para servir o index.html na raiz "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar o servidor
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
