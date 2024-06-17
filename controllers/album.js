const Album = require('../models/album');

const pruebaAlbum = (req,res) =>{
    console.log(Album)
    
    return res.status(200).send({
        status: "success",
        message:"Mensaje enviado desde el archivo album.js"
    })
}



module.exports = { pruebaAlbum }