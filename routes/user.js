//importar dependencias
const express = require('express');
const check = require('../middlewares/auth')


//Cargar router
const router = express.Router();

//importamos el controlador
const userController = require('../controllers/user');

//Definir la primer ruta
router.get('/prueba',check.auth,userController.pruebaUser);
router.post('/register',userController.register);
router.post('/login',userController.login);
router.get('/profile/:id',check.auth,userController.profile);
router.put('/update',check.auth,userController.update)
//exportar la ruta
module.exports = router;

