//importar dependencias
const express = require('express');

//Cargar router
const router = express.Router();

//importamos el controlador
const songController = require('../controllers/song');

//Definir la primer ruta
router.get('/prueba',songController.pruebaSong);

//exportar la ruta
module.exports = router;