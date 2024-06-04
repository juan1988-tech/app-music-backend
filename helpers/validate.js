const validator = require('validator');

const validate = (params) =>{
    let resultado = false;

    let name = !validator.isEmpty(params.name) &&
                validator.isLength(params.name,{min: 3, max: undefined}) &&
                validator.isAlpha(params.name, "es-ES");

    let nickname = !validator.isEmpty(params.nickname) &&
                    validator.isLength(params.nickname,{min: 2, max: 60}) 

    
    let email = !validator.isEmpty(params.email) &&
                validator.isEmail(params.email);

    let password = !validator.isEmpty(params.password)

    if(params.surname){
        let surname = !validator.isEmpty(params.surname) &&
                validator.isLength(params.surname,{min: 3, max: undefined}) &&
                validator.isAlpha(params.surname, "es-ES");

       if(!surname){
        throw new Error('no se ha superado la validación: Apellido incorrecto');
       }else{
            console.log('validación superada: Apellido');
            resultado = true;
       }         
    }

    if(!name || !nickname || !email || !password){
        throw new Error('no se ha superado la validación: Datos obligatorios incorrectos')
    }else{
        console.log('validación superada');
        resultado = true;
    }

    return resultado
}

module.exports =  validate;