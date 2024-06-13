//importar dependencias
const express = require('express');
const check = require('../middlewares/auth')

//Cargar router
const router = express.Router();

//importamos el controlador
const artistController =  require('../controllers/artists')

//Definir la primer ruta
router.get('/prueba',artistController.pruebaArtist)
router.post('/save',check.auth,artistController.save)
//exportar la ruta
module.exports = router;