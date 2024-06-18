//importar dependencias
const express = require('express');
const check = require('../middlewares/auth')

//Cargar router
const router = express.Router();

//importamos el controlador
const albumController =  require('../controllers/album')

//Definir la primer ruta
router.get('/prueba',check.auth,albumController.pruebaAlbum)
router.post('/guardar-album/:id',albumController.save)
router.get('/ver-album/:id',check.auth,albumController.showAlbum)
router.get('/ver-lista-de-albumes/:idArtist',check.auth,albumController.list)
router.put("/update/:idAlbum",check.auth,albumController.update)

//exportar la ruta
module.exports = router;