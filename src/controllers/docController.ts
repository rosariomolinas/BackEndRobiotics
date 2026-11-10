import doctores from '../db/doctores';
import * as usuCtrl from './usuController';

/* Campos de un médico que se pueden guardar desde el frontend */
function datosDoctor(body) {
    const datos: any = {};
    if (body.nombre !== undefined) datos.nombre = String(body.nombre).trim();
    if (body.apellido !== undefined) datos.apellido = String(body.apellido).trim();
    if (body.matricula !== undefined) datos.matricula = Number(body.matricula);
    return datos;
}

/* La matrícula es obligatoria: número entero positivo */
function matriculaValida(valor) {
    return Number.isInteger(valor) && valor > 0;
}

/* Busca otro médico con la misma matrícula (en "matricula" o en el campo viejo "nromatricula").
   excluirCode: el código del médico que se está modificando, para no compararlo consigo mismo */
async function matriculaRepetida(matricula, excluirCode = null) {
    const filtro: any = { $or: [{ matricula: matricula }, { nromatricula: matricula }] };
    if (excluirCode !== null) filtro.code = { $ne: excluirCode };
    return await doctores.findOne(filtro);
}

/* Devuelve el médico con la matrícula siempre en "matricula",
   aunque en la base esté guardada en el campo viejo "nromatricula" */
function normalizar(doc) {
    if (!doc) return doc;
    const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
    if (obj.matricula == null && obj.nromatricula != null) obj.matricula = obj.nromatricula;
    delete obj.nromatricula;
    return obj;
}

/* Filtro de activos: el frontend manda activo=true para ocultar los inactivos */
function filtroActivo(query) {
    return query.activo === 'true' || query.activo === '1' ? { activo: true } : {};
}

/* Escapa caracteres especiales para usar el texto dentro de una expresión regular */
function escaparRegex(texto) {
    return String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* GET /doctor/findcode?code=3&token=...&activo=true */
const findCode = async (req, res) => {
    try {
        const record = { ...req.query };
        const tokenOk = await usuCtrl.validarToken(record.token);
        if (!tokenOk) {
            return res.status(200).json({ data: [], message: "Token no válidado" });
        }

        const resultado = await doctores.findOne({ code: Number(record.code), ...filtroActivo(record) });
        if (resultado == null) {
            return res.status(200).json({ data: [], message: "No hay coincidencias" });
        }
        res.status(200).json({ data: [normalizar(resultado)], message: "" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: [], message: "Error al buscar el médico" });
    }
};

/* GET /doctor/findname?nombre=juan&activo=true
   Busca en nombre o apellido, sin distinguir mayúsculas */
const findName = async (req, res) => {
    try {
        const record = { ...req.query };
        const regex = { $regex: escaparRegex(record.nombre ?? ''), $options: 'i' };
        const filtro = {
            $or: [{ nombre: regex }, { apellido: regex }],
            ...filtroActivo(record)
        };

        const resultado = await doctores.find(filtro).sort({ code: 1 });
        res.status(200).json({
            data: resultado.map(normalizar),
            message: resultado.length ? "" : "No hay coincidencias"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: [], message: "Error al buscar médicos" });
    }
};

/* GET /doctor/findall?activo=true */
const findAll = async (req, res) => {
    try {
        const resultado = await doctores.find(filtroActivo(req.query)).sort({ code: 1 });
        res.status(200).json({
            data: resultado.map(normalizar),
            message: resultado.length ? "" : "No hay coincidencias"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: [], message: "Error al buscar médicos" });
    }
};

/* POST /doctor/addnew  body: { nombre, apellido, matricula } */
const addnew = async (req, res) => {
    try {
        const datos = datosDoctor(req.body);
        console.log("Nuevo médico...", datos);

        if (!datos.nombre || !datos.apellido) {
            return res.status(400).json({ data: [], message: "Nombre y apellido son obligatorios" });
        }
        if (!matriculaValida(datos.matricula)) {
            return res.status(400).json({ data: [], message: "La matrícula es obligatoria y debe ser un número entero positivo" });
        }
        const repetido = await matriculaRepetida(datos.matricula);
        if (repetido) {
            return res.status(409).json({ data: [], message: `La matrícula ${datos.matricula} ya pertenece a ${repetido.nombre} ${repetido.apellido}` });
        }

        const ultimo = await doctores.findOne({}).sort({ code: -1 });
        const newcod = ultimo == null ? 1 : ultimo.code + 1;

        const creado = await doctores.create({ code: newcod, activo: true, ...datos });
        res.status(200).json({ data: [normalizar(creado)], message: "Médico nuevo" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: [], message: "Error al crear el médico" });
    }
};

/* PUT /doctor/update  body: { code, nombre, apellido, matricula } */
const update = async (req, res) => {
    try {
        const code = Number(req.body.code);
        const datos = datosDoctor(req.body);
        console.log("Modificar médico...", code, datos);

        if (!code) {
            return res.status(400).json({ data: [], message: "Falta el código" });
        }
        if (!matriculaValida(datos.matricula)) {
            return res.status(400).json({ data: [], message: "La matrícula es obligatoria y debe ser un número entero positivo" });
        }
        const repetido = await matriculaRepetida(datos.matricula, code);
        if (repetido) {
            return res.status(409).json({ data: [], message: `La matrícula ${datos.matricula} ya pertenece a ${repetido.nombre} ${repetido.apellido}` });
        }

        // Se guarda en "matricula" y se borra el campo viejo "nromatricula"
        const actualizado = await doctores.findOneAndUpdate(
            { code: code },
            { $set: datos, $unset: { nromatricula: "" } },
            { new: true, strict: false }
        );

        if (!actualizado) {
            return res.status(404).json({ data: [], message: "Médico no encontrado" });
        }
        res.status(200).json({ data: [normalizar(actualizado)], message: "Médico actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: [], message: "Error al modificar el médico" });
    }
};

/* DELETE /doctor/remove  body: { code }
   No borra el registro: lo marca como inactivo, igual que pacientes */
const remove = async (req, res) => {
    try {
        const code = Number(req.body.code);
        console.log("Desactivar médico...", code);

        if (!code) {
            return res.status(400).json({ data: [], message: "Falta el código" });
        }

        const desactivado = await doctores.findOneAndUpdate(
            { code: code },
            { $set: { activo: false } },
            { new: true }
        );

        if (!desactivado) {
            return res.status(404).json({ data: [], message: "Médico no encontrado" });
        }
        res.status(200).json({ data: [normalizar(desactivado)], message: "Médico eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: [], message: "Error al eliminar el médico" });
    }
};

export {
    addnew, findCode, findName, findAll, update, remove
};


// import doctor from "../db/doctor";

// const addnew =  (req, res) =>
//     {

//         console.log("Nuevo medico..." + req.body.nombre + " - " + req.body.nromatricula);
//         doctor.findOne({} ).sort({ code : -1}).then((resultado) => 
//              { if (resultado==null) 
//                  { 
//                     doctor.create({code: 1, nombre :  req.body.nombre , apellido : req.body.apellido, matricula :  req.body.nromatricula, activo : true} )

//                  } 
//                  else 
//                  { 
//                     let newcod = resultado.code + 1;
//                     doctor.create({code: newcod, nombre :  req.body.nombre , apellido :  req.body.apellido,  matricula:  req.body.nromatricula, activo : true} )
//                  } 
    
//               });
        
//         res.status(200).json({ status: "success" })
//     }
// const findCode =  (req, res) =>
//         {
    
//             console.log("Buscar medico...");
                        
//             let  record = { ...req.body }
//             console.log('req.body', record)

// //            console.log("1",req.body.code);
//             console.log("fin buscar medico...");
//             doctor.findOne({"code" : record.code} ).then((resultado) => 
//                 { if (resultado==null) 
//                     { 
//                        // not found doctor.create({code: 1, nombre :  req.body.nombre , nromatricula:  req.body.nromatricula} )
//                        res.status(200).json({ "data" : [],  "message": "No hay coincidencias" })
//                     } 
//                     else 
//                     { 
//                         console.log(resultado.nombre);
//                         res.status(200).json({"data" : [resultado], "message" : ""})
//                     } 
//                 });
                
                
//         } 
// const findName =  (req, res) =>
//     {
    
//         console.log("Find by name...");
//         let  record = { ...req.body }
//         let cadactivo: Record<string, any>;
//         if ( record.activo)
//         {
//             cadactivo = { "nombre": { $regex: '.*' + req.body.nombre + '.*' }, "activo" : true }
//         }
//         else {
//             cadactivo = { "nombre": { $regex: '.*' + req.body.nombre + '.*' } }
//         }
        
//         doctor.find(cadactivo ).then((resultado) => 
//             { 
//                 if (resultado.length == 0) 
//                 { 
//                     // not found pacientes.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                    
//                     console.log("Not found");
//                     res.status(200).json({ "data" : {},  "message": "No hay coincidencias" })
//                 } 
//                 else 
//                 { 
//                     console.log(resultado);
//                     res.status(200).json({"data" : resultado, "message" : ""})
//                 } 
//             });
            
            
//     } 

//     const findAll =  (req, res) =>
//         {
        
//             console.log("Find all...");
//             let  record = { ...req.body };
//             let cadactivo: Record<string, any>;
//             if ( record.activo)
//             {
//               cadactivo = {"activo" : true }
//             }
//             else {
//                 cadactivo = {}
//             }
            
//             // console.log(jstring);
//             doctor.find(cadactivo  ).then((resultado) => 
//                 { 
//                     if (resultado.length == 0) 
//                     { 
//                         // not found pacientes.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                        
//                         console.log("Not found");
//                         res.status(200).json({ "data" : [],  "message": "No hay coincidencias" })
//                     } 
//                     else 
//                     { 
//                         console.log(resultado);
//                         res.status(200).json({"data" : resultado, "message" : ""})
//                     } 
//                 });
                
                
//         } 
                
            
//                 const update =  (req, res) =>

//                     {
                    
//                         let mensaje = '';
//                         console.log("Modificar medico..." + req.body);
                    
                        
//                         const filter = { code : req.body.code, activo : true };
//                         const updatev = req.body;
//                         doctor.updateOne (filter, updatev ).then((result) => 
//                             {
//                                 console.log("resultado modificación ", result);
//                                 if (result.modifiedCount)
//                                 {
//                                     res.status(200).json(result)
//                                     mensaje = "Medico actualizado";
//                                 }
//                                 else
//                                 {
//                                     res.status(200).json(result)
//                                     mensaje = "Medico no actualizado";
                    
//                                 }
                                
                                
//                             })
                        

//                         }


//                         const remove =  (req, res) =>
    
//                             {
                        
//                                 let mensaje = '';
//                                 console.log("Eliminar (desactivar) medico..." + req.body.nombre + " - " + req.body.matricula);
                    
//                                 console.log("Medico deactivado" , req.body.code);
//                                 const filter = { code : req.body.code };
//                                 const updatev = {activo :  false};
//                                 doctor.updateOne (filter, updatev ).then((result) => 
//                                     {
                    
//                                         mensaje = "Medico desactivado";
//                                         res.status(200).json({ status: mensaje })
//                                     })
                                
                    
                                
                                
//                             } 

//                             const next =  (req, res) =>
//                                 {
                            
//                                     console.log("Siguiente medico...");
                                                
//                                     console.log("actual=>",req.body.code);
                                    
//                                     doctor.find({code: {$gt: req.body.code}, activo : true}).sort({code: 1 }).limit(1).then((resultado) => 
//                                         { if (resultado==null) 
//                                             { 
//                                                  console.log("null");
//                                                // not found doctor.create({code: 1, nombre :  req.body.nombre , edad:  req.body.matricula} )
//                                                res.status(200).json({ status: "not found" })
//                                             } 
//                                             else 
//                                             { 
//                                                 console.log("found ", resultado);
//                                                 res.status(200).json(resultado)
//                                             } 
//                                         });
                                        
                                        
//                                 } 
                          
//                                 const previous =  (req, res) =>
//                                     {
                                
//                                         console.log("Anterior medico...");
                                                    
//                                        //            console.log("1",req.body.code);
                                        
//                                         doctor.find({code: {$lt: req.body.code}, activo : true}).sort({code: -1 }).limit(1).then((resultado) => 
//                                             { if (resultado==null) 
//                                                 { 
//                                                    // not found doctor.create({code: 1, nombre :  req.body.nombre , matricula:  req.body.matricula} )
//                                                    res.status(200).json({ status: "not found" })
//                                                 } 
//                                                 else 
//                                                 { 
//                                                     console.log(resultado);
//                                                     res.status(200).json(resultado)
//                                                 } 
//                                             });
                                            
                                            
//                                     }

//                export {
//                     addnew, findCode, findName, findAll, update, next, previous, remove  
//                 }
