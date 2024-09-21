const express = require('express');
const path = require('path');
const multer = require('multer');
const XLSX = require('xlsx');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Configuración del motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // nombre original del archivo
    }
});
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
  res.render('index'); // Renderiza la vista index.ejs
});

// Ruta para manejar la carga del archivo
app.post('/upload', upload.single('file'), (req, res) => {
  try {
      const filePath = path.join(__dirname, 'uploads', req.file.filename);
      const workbook = XLSX.readFile(filePath);

      const jsonData = {};
      workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          jsonData[sheetName] = XLSX.utils.sheet_to_json(worksheet); // Convertir cada hoja a JSON
      });

      res.render('resultado', { data: jsonData }); // Renderiza la vista resultado.ejs con los datos
  } catch (error) {
      console.error('Error al procesar el archivo:', error);
      res.status(500).send('Error al procesar el archivo.');
  }
});


app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
