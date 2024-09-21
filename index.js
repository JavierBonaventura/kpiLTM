const express = require('express');
const path = require('path');
require('dotenv').config();
const mathController = require('./controllers/mathController'); // Importa el controlador

const app = express();
const port = process.env.PORT || 5000;

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index'); // Renderiza la vista index.ejs
});

// Ruta para sumar dos números
app.get('/sumar', mathController.sumar);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
