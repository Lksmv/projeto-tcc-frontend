const express = require('express');
const path = require('path');
const app = express();

// Serve os arquivos estáticos da pasta 'dist' gerada pelo Vite
app.use(express.static(path.join(__dirname, 'dist')));

// Rota principal para servir o HTML
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Porta em que o servidor irá ouvir
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});