const Artist = require('../models/artist');

const pruebaArtist = (req,res) =>{

    return res.status(200).send({
        status: "success",
        message:"Mensaje enviado desde el archivo artist.js"
    })
}

module.exports = { pruebaArtist }
