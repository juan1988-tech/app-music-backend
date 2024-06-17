//importar dependencias
const express = require('express');
const check = require('../middlewares/auth')

//Cargar router
const router = express.Router();

//importamos el controlador
const artistController =  require('../controllers/artist')

//Configuracion de la subida
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads/artists/')
    },
    filename: (req,file,cb)=>{
        cb(null,`artist+${Date.now()}-${file.originalname}`)
    }
})

const uploads = multer({storage});

//Definir la primer ruta
router.get('/prueba',artistController.pruebaArtist)
router.post('/save',check.auth,artistController.save)
router.get('/ver-artista/:id',check.auth,artistController.oneArtist)
router.get('/ver-lista-de-artistas/:page?',check.auth,artistController.list)
router.put('/actualizar-artista/:id',check.auth,artistController.update)
router.delete('/eliminar-artista/:id',check.auth,artistController.deleteArtist)
router.post('/upload/:id',[check.auth, uploads.single('file0')],artistController.upload);
router.get('/avatar/:file',artistController.image)

//exportar la ruta
module.exports = router;