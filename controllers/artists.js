const Artist = require('../models/artist');

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

module.exports = { pruebaArtist, save }
