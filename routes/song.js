//importar dependencias
const express = require('express');
const check = require('../middlewares/auth')

//Cargar router
const router = express.Router();

//importamos el controlador
const songController = require('../controllers/song');

//Configuracion de la subida
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads/songs/')
    },
    filename: (req,file,cb)=>{
        cb(null,`song+${Date.now()}-${file.originalname}`)
    }
})

const uploads = multer({storage});

//Definir la primer ruta
router.get('/prueba',songController.pruebaSong);
router.post('/subir-cancion',songController.save);
router.get('/ver-cancion/:idsong',check.auth,songController.one);
router.get('/list/:albumId',check.auth,songController.list);
router.put('/actualizar-cancion/:idsong',check.auth,songController.update)
router.delete('/borrar-cancion/:idsong',check.auth,songController.deleteSong)
router.post('/subir-archivo-cancion/:idsong',uploads.single('file0'),songController.uploadSong)
router.get('/mostrar-cancion/:file',songController.audio)


//exportar la ruta
module.exports = router;
