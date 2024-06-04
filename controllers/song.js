const pruebaSong = (req,res) =>{

    return res.status(200).send({
        status: "success",
        message:"Mensaje enviado desde el archivo song.js"
    })
}

module.exports = { pruebaSong }