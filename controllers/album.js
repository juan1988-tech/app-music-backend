const Album = require('../models/album');

const pruebaAlbum = (req,res) =>{
    
    return res.status(200).send({
        status: "success",
        message:"Mensaje enviado desde el archivo album.js"
    })
}

const save = (req,res) =>{
    //recoge los datos del body
    let params = req.body

    //crear el objeto del artista
    let album = new Album(params)

    //capta los posibles errores 
    if(!params.artist || !params.title || !params.year){
        return res.status(400).json({
            status: "failed",
            message: "Te faltan datos por llenar"
        })
    }

    //Guardamos el objeto en la base de datos
    album.save()
    .then((albumStored)=>{
        return res.status(200).json({
            status: "success",
            message:"Album guardado",
            album: albumStored
        })
    })
}

const showAlbum = async (req,res) =>{
    //captar los objetos en la base de datos
    const id = req.params.id;
    
    await Album.findById(id)
    .populate({ path: "artist"})
    .then((album)=>{
        if(!album){
            res.status(400).send({
                status:"failed",
                message:"El album no existe"
            })
        }

        return res.status(200).json({
            status: "success",
            message:"Ver Album",
            album
        })
    })
}

module.exports = { pruebaAlbum, save, showAlbum }