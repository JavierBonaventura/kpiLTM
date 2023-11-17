const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: 'https://ribera.vercel.app',
}));


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'riberacuarzo@gmail.com', // Reemplaza con tu dirección de correo electrónico
    pass: 'akcr qljs njfw txkk' // Reemplaza con tu contraseña
  }
});

app.get('/', (req, res) => {
    res.send('home');
});


app.post('/enviar-correo', (req, res) => {
  const { nombre, email, consulta } = req.body;
console.log(req.body)
  const mailOptions = {
    from: email,
    to: 'riberacuarzo@gmail.com', // Reemplaza con la dirección del destinatario
    subject: 'Asunto del correo',
      text: `Nombre: ${nombre}\nEmail: ${email}\nConsulta: ${consulta}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Error al enviar el correo electrónico' });
    } else {
      console.log('Correo electrónico enviado: ' + info.response);
      res.json({ success: true, message: 'Correo electrónico enviado correctamente' });
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
