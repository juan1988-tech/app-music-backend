//importar dependencias
const express = require('express');

//Cargar router
const router = express.Router();

//importamos el controlador
const userController = require('../controllers/user');

//Definir la primer ruta
router.get('/prueba',userController.pruebaUser);
router.post('/register',userController.register);
//exportar la ruta
module.exports = router;

