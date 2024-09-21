const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path'); // Asegúrate de incluir este requerimiento
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
  res.render('index'); // Renderiza la vista index.ejs
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
