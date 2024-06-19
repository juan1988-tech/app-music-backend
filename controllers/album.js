const Album = require('../models/album');
const fs = require('node:fs');
const path = require('node:path');

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

const upload = async (req,res) =>{
   //Comprobar si el archivo existe preliminarmente 
    let imageRequest = req.file;
    if(!imageRequest){
        return res.status(400).send({
            status:"failed",
            message:"No se encuentra el archivo de imagen",
            })    
    }
    
    //Conseguir el nombre del archivo
    let image = req.file.originalname;

    //comprobar si la extensión es valida
    const imageSplit = image.split('\.');
    const imageExtention = imageSplit[1];
    
    if(imageExtention!="PNG" && imageExtention!="png" && imageExtention!="jpg" && imageExtention!="jpeg"){
        return res.status(400).json({
            status:"failed",
            message:"el archivo no contiene la extención de imagen adecuada"
        })
    }

    //guardar el archivo en la base de datos
    try{
        const albumId = req.params.id;
        console.log(albumId);
        await Album.findOneAndUpdate({ _id: albumId },{ image: req.file.filename },{ new: true })    
        .exec()
        .then((albumUpdated)=>{
            console.log(albumUpdated);
            if(!albumUpdated){
                res.status(400).json({
                status: "failed",
                message: "Error en la subida de los archivos",
                error
                })
            }    
           
            return res.status(200).send({
                status:"success",
                message:"método de subir imagenes",
                album: albumUpdated,
                file: req.file
            })
        })        
    }catch(error){
        if(error){
            res.status(400).json({
            status: "failed",
            message: "Error en la subida de los archivos",
            })
        }    
    } 
}

const image = (req,res) =>{
    //sacar el parametro de la url
    const file = req.params.file;
    console.log(file);

    //mostar el path real de la imagen
    const filePath = "./uploads/albums/"+file;
    console.log(filePath);

    fs.stat(filePath,(error,exists)=>{
       if(!exists){
        return res.status(400).send({
            status: "failed",
            message: "no existe la imagen"
        })
       }
       
       return res.sendFile(path.resolve(filePath));
    })
}


module.exports = { pruebaAlbum, save, showAlbum, list, update, upload, image }
