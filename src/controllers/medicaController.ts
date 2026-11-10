import medica from "../db/medicacion";

    

        
const traertodos =  (req, res) =>
{

    console.log("todos los medicamentos..." );
    medica.find({}).then((resultado) => 
            {  
                console.log(resultado)
                res.status(200).json(resultado)

            });
    
   
}

export {
     traertodos
    }
    