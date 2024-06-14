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
    let page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    //numero de elementos por página
    const itemsPage = 5;

    //retorna a varios artistas
    Artist.find().exec().then((artistas)=>{

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
            page,
            artists: artistasOrdenados
        })
    })
    
}

module.exports = { pruebaArtist, save, oneArtist, list }
