const Song = require('../models/song')
const Artist = require('../models/album')

const pruebaSong = (req,res) =>{

    return res.status(200).send({
        status: "success",
        message:"Mensaje enviado desde el archivo song.js"
    })
}

const save = async (req,res) =>{
    //recoge los datos del body
    let savedSong = req.body;

    //crea el objeto para asignarle los valores
    let song = new Song(savedSong)

    if(!savedSong.album || !savedSong.track || !savedSong.name || !savedSong.duration){
        return res.status(400).json({
            status: "failed",
            message: "Faltan datos de la canción por llenar"
        })
    }else{
        song.save()
        .then((newSong)=>{
          
        return res.status(200).send({
            status: "success",
            message:"Canción exitosamente guardada",
            song: newSong,
            })        
        })
    }   
}

const one = async(req,res) =>{
    //saca la identidad de la canción
    let songId = req.params.idsong;
    console.log(songId);
    //busca a la canción por su identidad, populando el album
    await Song.findById(songId)
    .populate({path: "album"})
    .then((oneSong)=>{
        if(!oneSong){
            res.status(400).json({
                status: "failed",
                message: "No se ha podido cargar el album"
            })
        }
        else{
            res.status(200).json({
                status: "success",
                oneSong
            })
        }
    })
}

module.exports = { pruebaSong, save, one }