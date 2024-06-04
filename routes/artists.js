//importar dependencias
const express = require('express');

//Cargar router
const router = express.Router();

//importamos el controlador
const artistController =  require('../controllers/artists')

//Definir la primer ruta
router.get('/prueba',artistController.pruebaArtist)

//exportar la ruta
module.exports = router;