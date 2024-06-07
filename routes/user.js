//importar dependencias
const express = require('express');

//Cargar router
const router = express.Router();

//importamos el controlador
const userController = require('../controllers/user');

//Definir la primer ruta
router.get('/prueba',userController.pruebaUser);
router.post('/register',userController.register);
router.post('/login',userController.login);
router.get('/profile/:id',userController.profile)
//exportar la ruta
module.exports = router;

