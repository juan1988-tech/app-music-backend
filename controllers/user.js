const User = require('../models/user')
const validate  = require('../helpers/validate')

//acción de prueba
const pruebaUser = (req,res) =>{

    return res.status(200).send({
        status: "success",
        message:"Mensaje enviado desde el archivo user.js"
    })
}

//registro
const register = (req,res) =>{
    //recoger los datos de la petición
    let params = req.body;


    //comprobar que los datos llegan bien
    if(!params.name || !params.nickname || !params.email || !params.password){
        return res.status(400).json({
            status:"failed",
            message: "Faltan datos por enviar"
        })
    }

    //Validación de datos
    try{
        validate(params)
    }catch(error){
        return res.status(400).send({
            status:"failed",
            message: "Validación no superada"
        })
    } 

    return res.status(200).json({
        status:"success",
        message:"Usuario creado exitosamente",
    })

   
}

module.exports = { pruebaUser,register }
