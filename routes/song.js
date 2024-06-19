//importar dependencias
const express = require('express');
const check = require('../middlewares/auth')

//Cargar router
const router = express.Router();

//importamos el controlador
const songController = require('../controllers/song');

//Definir la primer ruta
router.get('/prueba',songController.pruebaSong);
router.post('/subir-cancion',songController.save);

//exportar la ruta
module.exports = router;
