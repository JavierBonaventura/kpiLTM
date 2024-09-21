// controllers/mathController.js
exports.sumar = (req, res) => {
    const { numero1, numero2 } = req.query; // Obtener números desde la consulta
    const suma = Number(numero1) + Number(numero2); // Sumar los números
    res.render('index', { resultado: suma }); // Pasar el resultado a la vista
};
