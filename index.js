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

//conectar ruta de prueba

app.get('/ruta-de-prueba',(req,res)=>{
    res.status(200).json({
        message: "Conexión exitosa"
    })
})

//cargar controlador de ruta
const userRoutes = require('./routes/user');
const songRoutes = require('./routes/song');
const artistsRoutes = require('./routes/artists');
const albumRoutes = require('./routes/album');

//cargar  las rutas correspondientes
app.use("/api/usuario",userRoutes);
app.use('/api/cancion',songRoutes);
app.use('/api/artista',artistsRoutes);
app.use('/api/album',albumRoutes)
