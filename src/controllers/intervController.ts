import intervenciones from "../db/intervenciones";



const traertodos =  (req, res) =>
    {
        const ctoytpo = {"tejido_costo" : Number(process.env.tejido_costo), 
            "sangre_costo" : Number(process.env.sangre_costo),
            "tomo3d_costo" : Number(process.env.tomo3d_costo),
            "tejido_tiempo" : Number(process.env.tejido_tiempo),
            "sangre_tiempo" : Number(process.env.sangre_tiempo),
            "tomo3d_tiempo" : Number(process.env.tomo3d_tiempo) }
        console.log("todos los órganos..." );
        intervenciones.find({}).then((resultado) => 
                {  
                    res.status(200).json({"lista" : resultado, "valores" : ctoytpo })
    
                });
        
       
    }


const traeralgunos =  (req, res) =>
    {
        
        console.log("todos algunos órganos (filtros)..." );
        let  record = { ...req.query };
        const jquery: Record<string, any> = {};
        console.log('req.body', record);
        if (!(record.doctor == null ))
        {    
           jquery.doctor = record.doctor;
        }
        if (!(record.paciente == null ))
        {    
            jquery.paciente = record.paciente;
        }


        if (!(record.fecdes == null ))
            {    
                if (!(record.fechas == null ))
                    { 
                        jquery.fecint = {$gte: record.fecdes, $lt: record.fechas};
                    }
                    else 
                    {
                        jquery.fecint = {$gte: record.fecdes};
                    }


                
            }
        else 
        {
            if (!(record.fechas == null ))
                { 
                    jquery.fecint = {$lt: record.fechas};
                }    
        }

            console.log('query', jquery);
        intervenciones.find(jquery).then((resultado) => 
                {  
                   if (resultado.length)
                   {
                    console.log(resultado);
                    res.status(200).json({"data" : resultado })
                   }
                   else {
                    console.log(resultado);
                    res.status(200).json({"data" : resultado, "message": "Datos de la intervención guardados" })
                   }
                });
        
        
    }
const addnew =  (req, res) =>
    {

        console.log("Nueva intervención...", req.body  );
        intervenciones.create(req.body )

        res.status(200).json({ "data" : {},  "message": "Datos de la intervención guardados" })
    }
const findCode =  (req, res) =>
        {
            console.log("Buscar organo...");
                        
            let  record = { ...req.query };
            const resultado: Record<string, any> = {};
            console.log('req.body', record)

//            console.log("1",req.body.code);
            console.log("fin buscar organo...");
            intervenciones.findOne({"code" : record.code} ).then((resultado) => 
                { if (resultado==null) 
                    { 
                       // not found pacientes.create({code: 1, nombre :  req.body.nombre , orden:  req.body.orden} )
                       res.status(200).json({ status: "not found" })
                    } 
                    else 
                    { 
                        res.status(200).json(resultado)
                    } 
                });
                
                
                
        } 
export {
    addnew, findCode, traertodos, traeralgunos
    }