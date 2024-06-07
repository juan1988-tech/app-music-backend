const User = require('../models/user')
const validate  = require('../helpers/validate')
const bcrypt = require('bcrypt')

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
            message: "Faltan datos por enviar",
        })
    }

    //Validación de datos
    try{
        validate(params)    
    }catch(error){
        return res.status(400).json({
            status:"failed",
            message: "Validación no superada",
            error
        })
    }

    //Control de usuarios duplicados
    User.find({
        $or:[
            { email: params.email.toLowerCase() },
            { nickname: params.nickname.toLowerCase() }
        ]
   }).exec().then( async (user)=>{

    if(!user){
        return res.status(500).send({
            status:"failed",
            message: "Error en la consulta de usuarios duplicados"
        })
    }
    

    if(user && user.length >=1){
        return res.status(200).send({
            status: "error",
            message: "El usuario ya existe",
            user
        })
    }

    //cifrar la contraseña
    let pwd = await bcrypt.hash(params.password,10);
    params.password = pwd;

    //crea el objeto de usuario
    let userSaved = new User(params);

    if(!userSaved){
        return res.status(500).json({
            status:"success",
            message: "Error al registrar en la base de datos",
        })
    }

    //Guarda el usuario en la base de datos
    userSaved.save()
    .then((userStored)=>{
        //limpiar el password y el rol del objeto de retorno
        let userCreated = userStored.toObject();
        delete userCreated.password;
        delete userCreated.role;

        return res.status(200).json({
            status:"success",
            message:"Usuario creado exitosamente",
            user: userCreated
        })
    })
   })
}

const login = async (req,res) =>{
    //recoger los parametros de la petición
    let params = req.body;
  
    if(!params.email || !params.password){
        return res.status(404).send({
            status: "failed",
            message: "Falta ingresar el correo o la contraseña"
        })
    }

    //Buscar en la base de datos si existe el usuario


    await User.findOne({ email: params.email })
    .select("+password")
    .then((user)=>{
        if(!user){
           return res.status(404).send({
            status: "Error",
            message: "Usuario no existe"
           }) 
        }



        //Comparar la contraseña
        const pwd = bcrypt.compareSync(params.password, user.password)

        if(!pwd){
            return res.status(404).send({
                status: "Error",
                message: "La contraseña no es correcta"
               }) 
        }

        //Borrar la contraseña despues de la verificacion de la contraseña
        let identityUser = user.toObject();
        delete identityUser.password;

        return res.status(200).json({
            status:"success",
            message:"Usuario ingresa correctamente",
            user: identityUser
        })
    })
}


module.exports = { pruebaUser,register,login }
