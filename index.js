//importar conexión a la base de datos
const connection = require('./database/connection');

connection()
//importar dependencias
const express = require('express');
const cors = require('cors');

console.log('Bienvenido al backend de la aplicación de música')

//crear un servidor en node

const app = express();
const port = 3009

//arrancar el cors
app.use(cors());

//arrancar el método para convertir archivos a objeto json
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//poner el servidor a escuchar
app.listen(port, ()=>{
    console.log('servidor de node esta escuchando en el puerto ' + port)
}) 