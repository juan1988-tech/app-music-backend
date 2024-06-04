//importar dependencias
const express = require('express');

//Cargar router
const router = express.Router();

//importamos el controlador
const albumController =  require('../controllers/album')

//Definir la primer ruta
router.get('/prueba',albumController.pruebaAlbum)

//exportar la ruta
module.exports = router;