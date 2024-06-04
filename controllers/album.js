const pruebaAlbum = (req,res) =>{

    return res.status(200).send({
        status: "success",
        message:"Mensaje enviado desde el archivo album.js"
    })
}

module.exports = { pruebaAlbum }