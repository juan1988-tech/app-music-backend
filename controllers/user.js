const User = require('../models/user')
const validate  = require('../helpers/validate')
const bcrypt = require('bcrypt')
const jwt = require('../helpers/jwt');

//acción de prueba
const pruebaUser = (req,res) =>{
    const userItem = req.user;
    console.log(userItem)
    return res.status(200).send({
        status: "success",
        message:"Mensaje enviado desde el archivo user.js",
        user: req.user
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
    .select("+password +role")
    .then((user)=>{
        console.log(user);
        if(!user){
           return res.status(404).send({
            status: "Error",
            message: "Usuario no existe"
           }) 
        }

        //Comparar la contraseña
        const pwd =  (params.password === user.password)? true: false; 
        //bcrypt.compareSync(params.password, user.password)
        
         if(!pwd){
            return res.status(404).send({
                status: "Error",
                message: "La contraseña no es correcta"
               }) 
        }
 
        //Borrar la contraseña despues de la verificacion de la contraseña
        let identityUser = user.toObject();

        delete identityUser.password;
        delete identityUser.role;

        //Conseguir el token jwt
        const token = jwt.createToken(user)

        return res.status(200).json({
            status:"success",
            message:"Usuario ingresa correctamente",
            user: identityUser,
            token
        })
    })
}

const profile = async (req,res) =>{
    //Recoger id del usuario
    const id = req.params.id;
    //consulta para sacar los datos del perfil
    await User.findById(id).then((user)=>{
        if(!user){
            return res.status(404).json({
                status: "Failed",    
                message: "no existe el usuario"
            })
        }

        return res.status(200).send({
            status: "Success",
            message: "Perfil de usuario",
            id,
            user
        })
    })
}  

//actualizar el usuario 
const update = async (req,res) =>{
    //recoger los datos del usuario identificado
    let userIdentity = req.user;

    //recoger los datos a actualizar
    let userToUpdate = req.body;
    //validar datos
    try{
        validate(userToUpdate)
    }
    catch(error){
        return res.status(400).json({
            status: "error",
            message: "Validación no superada"
        })
    }

    //Comprobar si el usuario existe
    await User.find({
        $or:[
            { email: userToUpdate.email.toLowerCase() },
            { nickname: userToUpdate.nickname.toLowerCase() }
        ]
    }).exec().then(async (users)=>{
        //Error en la consulta de usuarios
        if(!users){
            return res.status(500).send({
                status: "Error",
                message: "Error en la consulta",
            })
        }

        //comprobar si el usuario existe
        let userIsset = false;

        users.forEach((user)=>{
 
            let userString = user._id.toString();
           
            if(user && userString != userIdentity.id){
                userIsset = true;
            }
        })
        
        if(userIsset){
            return res.status(200).json({
                status:"success",
                message:"el usuario ya existe"
            })
        }

        try{
        //Buscar el usuario y actualizar la base de datos
        await User.findByIdAndUpdate({_id: userIdentity.id}, userToUpdate,{new: true})
        .exec()
        .then((updated)=>{
            if(!updated){
                return res.status(400).json({
                    status:"Failed",
                    message:"Error al actualizar: no existe el usuario"
                   })     
            }

            //Devolver la respuesta
            return res.status(200).json({
                status:"Success",
                message:"Usuario actualizado",
                user: updated    
            })
        });
            
        }catch(error){
           return res.status(500).json({
            status:"Failed",
            message:"Error al actualizar",
            error
           })
        }
     })
}

const upload = async (req,res) =>{

    //Comprobar si el archivo existe preliminarmente 
    if(!req.file){
        res.status(404).send({
            status:"failed",
            message:"La petición no incluye la imagen"
        })
    }

    //Conseguir el nombre del archivo
    let image = req.file.originalname;

    //comprobar si la extensión es valida
    const imageSplit = image.split('\.');
    const imageExtention = imageSplit[1];

    if(imageExtention!="PNG" && imageExtention!="png" && imageExtention!="jpg" && imageExtention!="jpeg"){
        return res.status(404).json({
            status:"failed",
            message:"el archivo no contiene la extención de imagen adecuada"
        })
    }

    //guardar el archivo en la base de datros
    await User.findOneAndUpdate({ _id: req.user.id},{ image: req.file.filename },{ new: true })
    .exec()
    .then(function(userUpdated){
        if(!userUpdated){
            return res.status(400).json({
                status:"failed",
                message:"Error en la subida de archivos "
            })
        }
          //retornar una respuesta
        return res.status(200).send({
        status:"success",
        message:"método de subir imagenes",
        user: userUpdated,
        file: req.file
        })
    })
    //Guardar la imagen en la base de datos 
}

module.exports = { pruebaUser,register,login,profile,update,upload }
