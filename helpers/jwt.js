//importar nuestra dependencia
const jwt = require('jwt-simple');
const moment = require('moment')

//clave secreta
const secret = "CLAVE_SECRETA_API_MUSIC_BACKEND-1231230980";

const createToken = (user) =>{
    const payload = {
        id: user._id,
        name: user.name,
        surname: user.surname,
        nixkname: user.nickname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30,"days").unix()
    }

    //devolver el token
    return jwt.encode(payload,secret)
}

module.exports = {
    secret,
    createToken
}



