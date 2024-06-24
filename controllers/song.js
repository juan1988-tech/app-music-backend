const Song = require('../models/song');
const Artist = require('../models/album');
const fs = require('node:fs');
const path = require('node:path');

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

const list = (req,res) =>{
       //recoger la id del album 
       let id = req.params.albumId; 

       //hacer la consulta en la base de datos
       Song
       .find({album: id})
       .populate({ path: "album",
            populate: {
                path: "artist"
            }
       })
       .then((listSong)=>{
        if(!listSong){
            return res.status(404).json({
                status: "failed",
                message: "La lista no existe"
                })
            }

            //array para organizar a la lista de artistas por orden alfabetico
            let listSongOrganized = listSong.sort((a,b)=>{
            let x = a.track;
            let y = b.track;
            if( x < y ){ return -1};
            if( x > y ){ return 1 };
            return 0 
            });
            
            return res.status(200).json({
                status:"success",
                message:"lista cargada",
                listSongOrganized
            })
       })
}   

const update = async (req,res) =>{
    //obtener la identidad de la cancion en la url
    let id = req.params.idsong;

    //Obtener los datos del formulario
    const updatedSong = req.body

    if(!updatedSong.track || !updatedSong.name || !updatedSong.duration){
        return res.status(404).send({
            status: "failed",
            message: "Debes ingresar todo los datos requeridos"
        })
    }

    try{
    Song.findByIdAndUpdate(id,updatedSong,{ new: true})
                .populate({ path: "album",
                    populate:{
                        path: "artist"
                    }
                })
                .then((songUpdated)=>{
                    if(!songUpdated){
                        return res.status(400).json({
                            status:"failed",
                            message:" no existe la canción asociada"
                        })
                    }
                    return res.status(200).json({
                        status:"success",
                        message:"cancion actualizada exitosamente",
                        songUpdated
                    })
                })
    }catch(err){
        console.log(err);
    }    
}

const deleteSong = async (req,res)  =>{
    //recoge la identidad de la canción
    let id = req.params.idsong;

    //aplicar el método borrar a partir de la identidad de la cancion
    await Song.findOneAndDelete({_id: id})
    .then((erasedSong)=>{
        if(!erasedSong){
            return res.status(400).send({
                status:"failed",
                message:"la cancion no existe"
            })  
        }

        return res.status(200).send({
            status:"succes",
            message:"cancion exitosamente borrada",
            erasedSong
        })
    })
}

const uploadSong = async (req,res) =>{
    //comprobar si el archivo existe preliminarmente
    let songRequest = req.file;
    if(!songRequest){
        return res.status(400).json({
            status:"error",
            message: "No hay archivo asociado"
        })
    }

    //conseguir el nombre del archivo
    let song = req.file.originalname;
    
    //comprobar si la extención de la imagen es valida
    const songSplit = song.split('\.');
    const songExtention = songSplit[1];
    
    if(songExtention!="mp3"){
        fs.unlink(req.file.path,(error)=>{
            return res.status(404).json({
                status:"error",
                message:"el archivo no tiene una extención adecuada",
            })
        })
    }else{
        //extraer la identidad
        let songId = req.params.idsong;
        console.log(songId);

        await Song
        .findOneAndUpdate({ _id: songId },{ cancion: req.file.filename }, { new: true })
        .then((upatedSong)=>{
            if(!upatedSong){
                return res.status(500).send({
                    status:"error",
                    message:"error al actualizar"
                })
            }

            return res.status(200).json({
                status:"success",
                message:"cancion actualizada",
                song: upatedSong,
                file: req.file
            })
        }) 
    }
}

const audio = (req,res) =>{
    const file = req.params.file;
    console.log(file)

    //mostrar el path de la imagen
    const filePath = "./uploads/song/"+file;
    console.log(filePath);

    //comprobar si el archivo existe
    fs.stat(filePath,(error,exists)=>{
        if(!exists){
            return res.status(400).send({
                status: "failed",
                message: "no existe el audio"
            })
        }

        return res.sendFile(path.resolve(filePath));
    })
}

module.exports = { pruebaSong, save, one, list, update, deleteSong, uploadSong, audio }