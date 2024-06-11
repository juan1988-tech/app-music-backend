//importar dependencias
const express = require('express');
const check = require('../middlewares/auth')



//Cargar router
const router = express.Router();

//importamos el controlador
const userController = require('../controllers/user');

//Configuracion de la subida
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads/avatars/')
    },
    filename: (req,file,cb)=>{
        cb(null,`avatar+${Date.now()}-${file.originalname}`)
    }
})

const uploads = multer({storage})

//Definir la primer ruta
router.get('/prueba',check.auth,userController.pruebaUser);
router.post('/register',userController.register);
router.post('/login',userController.login);
router.get('/profile/:id',check.auth,userController.profile);
router.put('/update',check.auth,userController.update);
router.post('/upload',[check.auth, uploads.single('file0')],userController.upload);
//exportar la ruta
module.exports = router;

