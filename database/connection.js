//Importar mongoose
const mongoose = require('mongoose');

//hacer un método de conexión

const connection = async () =>{
    try{
        mongoose.connect('mongodb://localhost:27017/app-music-backend');
        console.log('conectado correctamente a la base de datos')
    }
    catch(error){
        console.log(error)
        throw new Error('no hemos podido conectar con la base de datos')
    }   
}

module.exports = connection