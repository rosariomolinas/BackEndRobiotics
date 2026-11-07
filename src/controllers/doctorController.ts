import doctor from "../db/doctor";

const addnew =  (req, res) =>
    {

        console.log("Nuevo medico..." + req.body.nombre + " - " + req.body.nromatricula);
        doctor.findOne({} ).sort({ code : -1}).then((resultado) => 
             { if (resultado==null) 
                 { 
                    doctor.create({code: 1, nombre :  req.body.nombre , apellido : req.body.apellido, matricula :  req.body.nromatricula, activo : true} )

                 } 
                 else 
                 { 
                    let newcod = resultado.code + 1;
                    doctor.create({code: newcod, nombre :  req.body.nombre , apellido :  req.body.apellido,  matricula:  req.body.nromatricula, activo : true} )
                 } 
    
              });
        
        res.status(200).json({ status: "success" })
    }
const findCode =  (req, res) =>
        {
    
            console.log("Buscar medico...");
                        
            let  record = { ...req.body }
            console.log('req.body', record)

//            console.log("1",req.body.code);
            console.log("fin buscar medico...");
            doctor.findOne({"code" : record.code} ).then((resultado) => 
                { if (resultado==null) 
                    { 
                       // not found doctor.create({code: 1, nombre :  req.body.nombre , nromatricula:  req.body.nromatricula} )
                       res.status(200).json({ "data" : [],  "message": "No hay coincidencias" })
                    } 
                    else 
                    { 
                        console.log(resultado.nombre);
                        res.status(200).json({"data" : [resultado], "message" : ""})
                    } 
                });
                
                
        } 
const findName =  (req, res) =>
    {
    
        console.log("Find by name...");
        let  record = { ...req.body }
        let cadactivo: Record<string, any>;
        if ( record.activo)
        {
            cadactivo = { "nombre": { $regex: '.*' + req.body.nombre + '.*' }, "activo" : true }
        }
        else {
            cadactivo = { "nombre": { $regex: '.*' + req.body.nombre + '.*' } }
        }
        
        doctor.find(cadactivo ).then((resultado) => 
            { 
                if (resultado.length == 0) 
                { 
                    // not found pacientes.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                    
                    console.log("Not found");
                    res.status(200).json({ "data" : {},  "message": "No hay coincidencias" })
                } 
                else 
                { 
                    console.log(resultado);
                    res.status(200).json({"data" : resultado, "message" : ""})
                } 
            });
            
            
    } 

    const findAll =  (req, res) =>
        {
        
            console.log("Find all...");
            let  record = { ...req.body };
            let cadactivo: Record<string, any>;
            if ( record.activo)
            {
              cadactivo = {"activo" : true }
            }
            else {
                cadactivo = {}
            }
            
            // console.log(jstring);
            doctor.find(cadactivo  ).then((resultado) => 
                { 
                    if (resultado.length == 0) 
                    { 
                        // not found pacientes.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                        
                        console.log("Not found");
                        res.status(200).json({ "data" : [],  "message": "No hay coincidencias" })
                    } 
                    else 
                    { 
                        console.log(resultado);
                        res.status(200).json({"data" : resultado, "message" : ""})
                    } 
                });
                
                
        } 
                
            
                const update =  (req, res) =>

                    {
                    
                        let mensaje = '';
                        console.log("Modificar medico..." + req.body);
                    
                        
                        const filter = { code : req.body.code, activo : true };
                        const updatev = req.body;
                        doctor.updateOne (filter, updatev ).then((result) => 
                            {
                                console.log("resultado modificación ", result);
                                if (result.modifiedCount)
                                {
                                    res.status(200).json(result)
                                    mensaje = "Medico actualizado";
                                }
                                else
                                {
                                    res.status(200).json(result)
                                    mensaje = "Medico no actualizado";
                    
                                }
                                
                                
                            })
                        

                        }


                        const remove =  (req, res) =>
    
                            {
                        
                                let mensaje = '';
                                console.log("Eliminar (desactivar) medico..." + req.body.nombre + " - " + req.body.matricula);
                    
                                console.log("Medico deactivado" , req.body.code);
                                const filter = { code : req.body.code };
                                const updatev = {activo :  false};
                                doctor.updateOne (filter, updatev ).then((result) => 
                                    {
                    
                                        mensaje = "Medico desactivado";
                                        res.status(200).json({ status: mensaje })
                                    })
                                
                    
                                
                                
                            } 

                            const next =  (req, res) =>
                                {
                            
                                    console.log("Siguiente medico...");
                                                
                                    console.log("actual=>",req.body.code);
                                    
                                    doctor.find({code: {$gt: req.body.code}, activo : true}).sort({code: 1 }).limit(1).then((resultado) => 
                                        { if (resultado==null) 
                                            { 
                                                 console.log("null");
                                               // not found doctor.create({code: 1, nombre :  req.body.nombre , edad:  req.body.matricula} )
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
                                
                                        console.log("Anterior medico...");
                                                    
                                       //            console.log("1",req.body.code);
                                        
                                        doctor.find({code: {$lt: req.body.code}, activo : true}).sort({code: -1 }).limit(1).then((resultado) => 
                                            { if (resultado==null) 
                                                { 
                                                   // not found doctor.create({code: 1, nombre :  req.body.nombre , matricula:  req.body.matricula} )
                                                   res.status(200).json({ status: "not found" })
                                                } 
                                                else 
                                                { 
                                                    console.log(resultado);
                                                    res.status(200).json(resultado)
                                                } 
                                            });
                                            
                                            
                                    }

               export {
                    addnew, findCode, findName, findAll, update, next, previous, remove  
                }
