const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

const FILE_PATH = path.join(__dirname, 'contador.json');
let contador = {}; // Armazena os valores recebidos

// Função para ler o arquivo JSON na inicialização
function carregarContador() {
  if (fs.existsSync(FILE_PATH)) {
    const dados = fs.readFileSync(FILE_PATH, 'utf-8');

    try {
      contador = JSON.parse(dados);
    } catch (e) {
      contador = {};
    }
  }
}

// Função para salvar no arquivo JSON
function salvarContador() {
  fs.writeFileSync(FILE_PATH, JSON.stringify(contador, null, 2));
}

carregarContador();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/contar', (req, res) => {
  const { valor } = req.body;

  if (!valor) {
    return res.status(400).json({ erro: 'Valor não fornecido' });
  }

  contador[valor] = (contador[valor] || 0) + 1;
  salvarContador();

  res.json({ valor, vezes: contador[valor] });
});

app.post('/resetar', (req, res) => {
  contador = {};
  salvarContador();
  res.json({ mensagem: 'Contagem resetada com sucesso!' });
});

app.get('/dados', (req, res) => {
  res.json(contador);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
