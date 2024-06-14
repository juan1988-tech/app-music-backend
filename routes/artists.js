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
router.get('/ver-artista/:id',check.auth,artistController.oneArtist)
router.get('/ver-lista-de-artistas/:page?',check.auth,artistController.list)
router.put('/actualizar-artista/:id',check.auth,artistController.update)
router.delete('/eliminar-artista/:id',check.auth,artistController.deleteArtist)
//exportar la ruta
module.exports = router;