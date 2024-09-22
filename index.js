const express = require('express');
const fs = require('fs');

const router = express.Router();
const path = require('path');
const multer = require('multer');
const { processFile } = require('./controllers/fileController'); // Importamos el controlador
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Almacenamiento en memoria usando multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/matriz', (req, res) => {
  res.render('index'); // Renderiza la vista index.ejs
});

app.get('/matriz', function(req, res, next) {
  res.render('matriz', { title: 'Página con Tarjetas y Efectos' });
});

// Ruta para manejar la carga del archivo
// app.post('/upload', upload.single('file'), (req, res) => {
//   try {
//     // Llamamos al controlador para procesar el archivo
//     const jsonData = processFile(req.file.buffer);

//     // Renderizamos la vista 'resultado.ejs' con el JSON procesado
//     res.render('resultado', { data: jsonData });
//   } catch (error) {
//     console.error('Error al procesar el archivo:', error);
//     res.status(500).send('Error al procesar el archivo.');
//   }
// });

app.post('/upload', (req, res) => {
  console.log(req.body); // Verifica los datos recibidos
  const fileName = req.body.file;
  const selectedTramo = req.body.tramo; // Obtén el tramo seleccionado
  const filePath = path.join(__dirname, 'uploads', fileName);

  try {
    // Verifica que el archivo exista
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Archivo no encontrado.');
    }

    const fileBuffer = fs.readFileSync(filePath);
    const jsonData = processFile(fileBuffer, selectedTramo); // Pasa el tramo seleccionado

    res.render('resultado', { data: jsonData });
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    res.status(500).send('Error al procesar el archivo.');
  }
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
