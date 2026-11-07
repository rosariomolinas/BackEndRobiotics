const organos = require("../db/organos.ts")

const traertodos =  (req, res) =>
    {
    
        console.log("todos los órganos..." );
        organos.find({}).then((resultado) => 
                {  
                    res.status(200).json({"lista" : resultado, "valores" : {} })
    
                });
        
       
    }
    
const addnew =  (req, res) =>
    {

        console.log("Nuevo organo..." + req.body.nombre + " - " + req.body.orden);
        organos.findOne({} ).sort({ code : -1}).then((resultado) => 
             { if (resultado==null) 
                 { 
                    organos.create({code: 1, nombre :  req.body.nombre , orden :  req.body.orden} )

                 } 
                 else 
                 { 
                    let newcod = resultado.code + 1;
                    organos.create({code: newcod, nombre :  req.body.nombre , orden:  req.body.orden} )
                 } 
    
              });
        
        res.status(200).json({ status: "success" })
    }
const findCode =  (req, res) =>
        {
            console.log("Buscar organo...");
                        
            let  record = { ...req.body }
            console.log('req.body', record)

//            console.log("1",req.body.code);
            console.log("fin buscar organo...");
            organos.findOne({"code" : record.code} ).then((resultado) => 
                { if (resultado==null) 
                    { 
                       // not found pacientes.create({code: 1, nombre :  req.body.nombre , orden:  req.body.orden} )
                       res.status(200).json({ status: "not found" })
                    } 
                    else 
                    { 
                        console.log(resultado.nombre);
                        res.status(200).json(resultado)
                    } 
                });
                
                
                
        } 
        const update =  (req, res) =>

            {
            
                let mensaje = '';
                console.log("Modificar organo..." + req.body);
            
                
                const filter = { code : req.body.code, activo : true };
                const updatev = req.body;
                organos.updateOne (filter, updatev ).then((result) => 
                    {
                        console.log("resultado modificación ", result);
                        if (result.modifiedCount)
                        {
                            res.status(200).json(result)
                            mensaje = "organo actualizado";
                        }
                        else
                        {
                            res.status(200).json(result)
                            mensaje = "organo no actualizado";
            
                        }
                        
                        
                    })
                
            
                
                
            }   
    /*
const findName =  (req, res) =>
    {

        console.log("Find by name...");
        organos.findOne({"nombre" : req.body.nombre} ).then((resultado) => 
            { if (resultado==null) 
                { 
                    // not found organos.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                    res.status(200).json({ status: "not found" })
                } 
                else 
                { 
                    console.log(resultado.nombre);
                    res.status(200).json(resultado)
                } 
            });
            
            
    } 
        
    const next =  (req, res) =>
        {
    
            console.log("Siguiente organo...");
                        
            console.log("actual=>",req.body.code);
            
            organos.find({code: {$gt: req.body.code}}).sort({code: 1 }).limit(1).then((resultado) => 
                { if (resultado==null) 
                    { 
                         console.log("null");
                       // not found organos.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                       res.status(200).json({ status: "not found" })
                    } 
                    else 
                    { 
                        console.log("found ", resultado);
                        res.status(200).json(resultado)
                    } 
                });
                
                
        } 
  
        const previous =  (req, res) =>
            {
        
                console.log("Anterior organo...");
                            
               //            console.log("1",req.body.code);
                
                organos.find({code: {$lt: req.body.code}}).sort({code: -1 }).limit(1).then((resultado) => 
                    { if (resultado==null) 
                        { 
                           // not found organos.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                           res.status(200).json({ status: "not found" })
                        } 
                        else 
                        { 
                            console.log(resultado);
                            res.status(200).json(resultado)
                        } 
                    });
                    
                    
            } 
    
       
*/
module.exports = {
    addnew, findCode, update, traertodos // update //   traertodos 
   // update1, update2, 
     //remove, next, previous
    }
    