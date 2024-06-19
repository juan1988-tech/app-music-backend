const Artist = require('../models/artist');
const Album = require('../models/album');
const Song = require('../models/song');
const mongoosePagination = require('mongoose-pagination');
const fs = require('node:fs');
const path = require('node:path');


const pruebaArtist = (req,res) =>{

    return res.status(200).send({
        status: "success",
        message:"Mensaje enviado desde el archivo artist.js"
    })
}

const save = (req,res) =>{
    //recoge los datos
    let params = req.body
    
    //crea el objeto a guardar del artista
    let artistSaved = new Artist(params)    

    if(!artistSaved.name || !artistSaved.description){
        return res.status(500).json({
            status:"failed",
            message:"No se puede crear el artista en la base de datos"
        })
    }

    //guardamos el objeto del artista en la base de datos    
    artistSaved.save()
    .then((artistStored)=>{
        return res.status(200).json({
            status:"success",
            message:"Artista exitosamente creado",
            artist: artistStored
        })
    })
}

const oneArtist = async (req,res) =>{
    //sacar el parametro por la url
    const artistId = req.params.id

    await Artist.findById(artistId)
    .then((artist)=>{
        if(!artist){
            return res.status(404).json({
                status: "Failed",    
                message: "no existe el artista"
            })
        }

        return res.status(200).json({
            status:"success",
            message:"Ver un solo artista",
            artist
        })
    })
}

const list = (req,res) =>{
    //sacar la posible página
    console.log(mongoosePagination)
    let page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    //numero de elementos por página
    const itemsPage = 5;

    //retorna a varios artistas
    Artist.find().paginate(page,itemsPage).exec().then((artistas)=>{

        //array para organizar a la lista de artistas por orden alfabetico
        let artistasOrdenados =  artistas.sort((a,b)=>{
            let x = a.name;
            let y = b.name;
            if( x < y ){ return -1};
            if( x > y ){ return 1 };
            return 0
        })


        return res.status(200).json({
            status:"success",
            message:"Listado de artistas",
            artists: artistasOrdenados
        })
    })
}

const update = (req,res) =>{
    //recoger el id del artista
    const id = req.params.id;

    //llamar al artista de la base de datos
    const data = req.body;

    //Buscar y actualizar al artista
    Artist.findByIdAndUpdate(id,data,{new: true})
    .exec()
    .then((artistUpdated)=>{
        if(!artistUpdated){
            return res.status(500).json({
                status:"failed",
                message:"Error al actualizar: no se encuentra el artista",
            })
        }

        return res.status(200).json({
            status:"success",
            message:"Actualización de artista",
            artist: artistUpdated
        })
    })
}

const deleteArtist = async (req,res) =>{

    //Sacar el id del artista a eliminar
    const artistId = req.params.id;

    try{

        //Hacer una consulta para remover o eliminar un artista
        const artistRemoved = await Artist.findByIdAndDelete(artistId);
        const songRemoved = await Song.deleteMany({ _id: artistId });
        const albumRemoved = await Album.deleteMany({ _id: artistId });
        
        
        if(!artistRemoved){
            return res.status(500).json({
                status:"success",
                message:"El artista no existe",
            })
        }

        return res.status(200).json({
            status:"success",
            message:"Artista eliminado",
            artist: artistRemoved,
            songRemoved,
            albumRemoved
        })
    }catch(error){
        return res.status(500).json({
            status:"success",
            message:"Error al eliminar el artista",
        })
    }
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

    const articleId = req.params.id;
    await Artist.findOneAndUpdate({ _id: articleId },{ image: req.file.filename },{ new: true })
    .exec()
    .then(function(artistUpdated){
        console.log(artistUpdated);
        if(!artistUpdated){
            return res.status(400).json({
                status:"failed",
                message:"Error en la subida de archivos "
            })
        }
          //retornar una respuesta
        return res.status(200).send({
        status:"success",
        message:"método de subir imagenes",
        artist: artistUpdated,
        file: req.file
        })
    })
}

const image = (req,res) =>{
    //sacar el parametro de la url
    const file = req.params.file;
    console.log(file)

    //mostar el path real de la imagen
    const filePath = "./uploads/artist/"+file;
    console.log(filePath);

    //comprobar que el archivo existe
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

module.exports = { pruebaArtist, save, oneArtist, list, update, deleteArtist, upload, image }
