//importar dependencias
const express = require('express');
const check = require('../middlewares/auth')

//Cargar router
const router = express.Router();

//importamos el controlador
const albumController =  require('../controllers/album')

//Configuracion de la subida
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads/albums/')
    },
    filename: (req,file,cb)=>{
        cb(null,`album+${Date.now()}-${file.originalname}`)
    }
})

const uploads = multer({storage});

//Definir la primer ruta
router.get('/prueba',check.auth,albumController.pruebaAlbum)
router.post('/guardar-album/:id',albumController.save)
router.get('/ver-album/:id',check.auth,albumController.showAlbum)
router.get('/ver-lista-de-albumes/:idArtist',check.auth,albumController.list)
router.put("/update/:idAlbum",check.auth,albumController.update)
router.post('/upload/:id',[check.auth, uploads.single('file0')],albumController.upload);
router.get('/image/:file',albumController.image)

//exportar la ruta
module.exports = router;