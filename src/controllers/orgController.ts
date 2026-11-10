import organos from '../db/organos';

/* Campos de un órgano que se pueden guardar desde el frontend */
function datosOrgano(body) {
    const datos: any = {};
    if (body.nombre !== undefined) datos.nombre = String(body.nombre).trim();
    if (body.orden !== undefined) datos.orden = body.orden;
    if (body.mtejido !== undefined) datos.mtejido = !!body.mtejido;
    if (body.msangre !== undefined) datos.msangre = !!body.msangre;
    if (body.tomo3d !== undefined) datos.tomo3d = !!body.tomo3d;
    return datos;
}

/* Busca otro órgano con el mismo nombre, sin distinguir mayúsculas, tildes
   ni espacios de más ("Hígado" = "higado" = " HIGADO ").
   excluirCode: el código del órgano que se está modificando */
async function nombreRepetido(nombre, excluirCode = null) {
    const filtro: any = { nombre: String(nombre).trim() };
    if (excluirCode !== null) filtro.code = { $ne: excluirCode };
    return await organos.findOne(filtro).collation({ locale: 'es', strength: 1 });
}

function mensajeRepetido(org) {
    return org.activo === false
        ? `Ya existe un órgano llamado "${org.nombre}" (código ${org.code}), pero está inactivo`
        : `Ya existe un órgano llamado "${org.nombre}" (código ${org.code})`;
}

/* GET /org/traertodos  -> { lista: [...], valores: {...} } */
const traertodos = (req, res) => {
    const ctoytpo = {
        "tejido_costo": Number(process.env.tejido_costo),
        "sangre_costo": Number(process.env.sangre_costo),
        "tomo3d_costo": Number(process.env.tomo3d_costo),
        "tejido_tiempo": Number(process.env.tejido_tiempo),
        "sangre_tiempo": Number(process.env.sangre_tiempo),
        "tomo3d_tiempo": Number(process.env.tomo3d_tiempo)
    };
    console.log("todos los órganos...");
    organos.find({}).sort({ code: 1 })
        .then((resultado) => {
            res.status(200).json({ "lista": resultado, "valores": ctoytpo });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ status: "error", message: "Error al traer órganos" });
        });
};

/* POST /org/addnew  body: { nombre, mtejido, msangre, tomo3d, orden? }
   -> { status, data: [órgano creado] } */
const addnew = async (req, res) => {
    try {
        const datos = datosOrgano(req.body);
        console.log("Nuevo organo...", datos);

        if (!datos.nombre) {
            return res.status(400).json({ status: "error", message: "El nombre es obligatorio" });
        }

        const repetido = await nombreRepetido(datos.nombre);
        if (repetido) {
            return res.status(409).json({ status: "error", message: mensajeRepetido(repetido) });
        }

        const ultimo = await organos.findOne({}).sort({ code: -1 });
        const newcod = ultimo == null ? 1 : ultimo.code + 1;

        const creado = await organos.create({ code: newcod, activo: true, ...datos });
        console.log("Creado organo...", creado);
        res.status(200).json({ status: "success", data: [creado], message: "Órgano nuevo" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al crear el órgano" });
    }
};

/* GET /org/findCode?code=3  -> órgano o { status: "not found" } */
const findCode = (req, res) => {
    const code = req.query.code ?? req.body?.code;
    console.log("Buscar organo...", code);

    organos.findOne({ "code": code })
        .then((resultado) => {
            if (resultado == null) {
                res.status(200).json({ status: "not found" });
            } else {
                res.status(200).json(resultado);
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ status: "error", message: "Error al buscar el órgano" });
        });
};

/* PUT /org/update  body: { code, nombre, mtejido, msangre, tomo3d, orden? }
   -> { status, data: [órgano actualizado] } */
const update = async (req, res) => {
    try {
        const code = Number(req.body.code);
        const datos = datosOrgano(req.body);
        console.log("Modificar organo...", code, datos);

        if (!code) {
            return res.status(400).json({ status: "error", message: "Falta el código" });
        }

        if (datos.nombre !== undefined) {
            if (!datos.nombre) {
                return res.status(400).json({ status: "error", message: "El nombre es obligatorio" });
            }
            const repetido = await nombreRepetido(datos.nombre, code);
            if (repetido) {
                return res.status(409).json({ status: "error", message: mensajeRepetido(repetido) });
            }
        }

        const actualizado = await organos.findOneAndUpdate(
            { code: code },
            { $set: datos },
            { new: true }
        );

        if (!actualizado) {
            return res.status(404).json({ status: "not found", message: "Órgano no encontrado" });
        }
        res.status(200).json({ status: "success", data: [actualizado], message: "Órgano actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al modificar el órgano" });
    }
};

/* DELETE /org/remove  body: { code }
   No borra el registro: lo marca como inactivo, para que las intervenciones
   ya guardadas con este órgano sigan mostrando su nombre. */
const remove = async (req, res) => {
    try {
        const code = Number(req.body.code);
        console.log("Desactivar organo...", code);

        if (!code) {
            return res.status(400).json({ status: "error", message: "Falta el código" });
        }

        const desactivado = await organos.findOneAndUpdate(
            { code: code },
            { $set: { activo: false } },
            { new: true }
        );

        if (!desactivado) {
            return res.status(404).json({ status: "not found", message: "Órgano no encontrado" });
        }
        res.status(200).json({ status: "success", data: [desactivado], message: "Órgano eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al eliminar el órgano" });
    }
};

export {
    addnew, findCode, update, traertodos, remove
};


// import organos from '../db/organos';



// const traertodos =  (req, res) =>
//     {
//         const ctoytpo = {"tejido_costo" : Number(process.env.tejido_costo), 
//             "sangre_costo" : Number(process.env.sangre_costo),
//             "tomo3d_costo" : Number(process.env.tomo3d_costo),
//             "tejido_tiempo" : Number(process.env.tejido_tiempo),
//             "sangre_tiempo" : Number(process.env.sangre_tiempo),
//             "tomo3d_tiempo" : Number(process.env.tomo3d_tiempo) }
//         console.log("todos los órganos..." );
//         organos.find({}).then((resultado) => 
//                 {  
//                     console.log(resultado)
//                     res.status(200).json({"lista" : resultado, "valores" : ctoytpo })
    
//                 });
        
       
//     }
// const addnew =  (req, res) =>
//     {

//         console.log("Nuevo organo..." + req.body.nombre + " - " + req.body.orden);
//         organos.findOne({} ).sort({ code : -1}).then((resultado) => 
//              { if (resultado==null) 
//                  { 
//                     organos.create({code: 1, nombre :  req.body.nombre , orden :  req.body.orden} )

//                  } 
//                  else 
//                  { 
//                     let newcod = resultado.code + 1;
//                     organos.create({code: newcod, nombre :  req.body.nombre , orden:  req.body.orden} )
//                  } 
    
//               });
        
//         res.status(200).json({ status: "success" })
//     }
// const findCode =  (req, res) =>
//         {
//             console.log("Buscar organo...");
                        
//             let  record = { ...req.body }
//             console.log('req.body', record)

// //            console.log("1",req.body.code);
//             console.log("fin buscar organo...");
//             organos.findOne({"code" : record.code} ).then((resultado) => 
//                 { if (resultado==null) 
//                     { 
//                        // not found pacientes.create({code: 1, nombre :  req.body.nombre , orden:  req.body.orden} )
//                        res.status(200).json({ status: "not found" })
//                     } 
//                     else 
//                     { 
//                         console.log(resultado.nombre);
//                         res.status(200).json(resultado)
//                     } 
//                 });
                
                
                
//         } 
//         const update =  (req, res) =>

//             {
            
//                 let mensaje = '';
//                 console.log("Modificar organo..." + req.body);
            
                
//                 const filter = { code : req.body.code, activo : true };
//                 const updatev = req.body;
//                 organos.updateOne (filter, updatev ).then((result) => 
//                     {
//                         console.log("resultado modificación ", result);
//                         if (result.modifiedCount)
//                         {
//                             res.status(200).json(result)
//                             mensaje = "organo actualizado";
//                         }
//                         else
//                         {
//                             res.status(200).json(result)
//                             mensaje = "organo no actualizado";
            
//                         }
                        
                        
//                     })
                
            
                
                
//             }  
            
            





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
    
       

export {
    addnew, findCode, update, traertodos // update // traertodos  traertodos 
   // update1, update2, 
     //remove, next, previous
    }*/