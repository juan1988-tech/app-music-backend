//importar jwt
const jwt = require('jwt-simple');
const moment = require('moment');

//importar la clave secreta
const { secret } = require('../helpers/jwt');

//crea el middleware
exports.auth = (req,res,next) => {
    if(!req.headers.authorization){
        return res.status(404).json({
            status: "failed",
            mesaage:"Falta cabecera de autenticación"
        })
    }

    //limpiar el token
    let token = req.headers.authorization.replace(/['"]+/g,"");

    try{
        //decodificar el token
        let payload = jwt.decode(token,secret)
    
        //comprobar la expiración del  token
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status:"error",
                message:"Token expirado",
                error
                })    
            }

            //agregar los datos del usuario identificado a la request
            req.user = payload;

        }catch(error){
            return res.status(404).send({
                status:"error",
                message:"Token invalido",
                error
            })
        };

    next()    
}
