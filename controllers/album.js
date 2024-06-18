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

const list = async (req,res) =>{
    //sacar la id del artista
    const id = req.params.idArtist;

    if(!id){
        return res.status(400).json({
            status: "failed",
            message: "no se encuentra el artista"
        })
    }
    //sacar todos los albumes de un solo artista
    await Album.find({artist: id}).populate({ path: "artist"}).then((albums)=>{
        if(albums.length ===0){
            return res.status(400).json({
                status: "failed",
                albumes: "El artista no tiene albumes asociados"
            })    
        }
        return res.status(200).json({
            status: "success",
            albumes: albums
        })
    })
}

const update = async (req,res) =>{
    //recoge el id del album
    const id = req.params.idAlbum;

    //recoge el album a actualizar
    const updatedAlbum = req.body

    //hacer la actualización del album
    await Album.findByIdAndUpdate(id,updatedAlbum,{ new: true })
    .populate({ path: "artist"})
    .exec()
    .then((albumItem)=>{
        if(!albumItem){
            return res.status(401).json({
                status: "failed",
                message: "El album no existe"
            })    
        }

        return res.status(200).json({
            status: "success",
            message: "Album correctamente actualizado",
            album: albumItem
        })
    })
}

module.exports = { pruebaAlbum, save, showAlbum, list, update }
