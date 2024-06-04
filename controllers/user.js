//acción de prueba
const pruebaUser = (req,res) =>{

    return res.status(200).send({
        status: "success",
        message:"Mensaje enviado desde el archivo user.js"
    })
}

//registro
const register = (req,res) =>{
    return res.status(200).json({
        status:"success",
        message:"Usuario creado exitosamente"
    })
}

module.exports = { pruebaUser,register }
