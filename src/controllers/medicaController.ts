const medicacion = require("../db/medicacion.ts")

    

        
const traertodos =  (req, res) =>
{

    console.log("todos los medicamentos..." );
    medicacion.find({}).then((resultado) => 
            {  
                res.status(200).json(resultado)

            });
    
   
}

export {
     traertodos
    }
    