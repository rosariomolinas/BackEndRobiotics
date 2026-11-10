

import usuarios from  '../db/usuarios';
import crypto from 'node:crypto';
const userLogged = (req, res) =>
{
    console.log('userLooged??')
    if (req.session.sessuser )
    {
        res.status(200).json({ "logged" : true, "profile" : req.session.sessprofile })
        console.log('resp=> true')
        }
    else {

        res.status(200).json({ "logged" : "n" })
        console.log('resp=> false')
    }


}

async function validarToken (token)
    {
        var responde = false;
        console.log("Validar__token in ...", token);
        
                     
        const resultado = await usuarios.findOne({"token" : token } )
              
        if (resultado==null) 
        { 
            responde = false;
            
        } 
        else 
        { 
            
            responde = true;
        } 

        console.log("RESULTADO token:",  resultado );

        return(responde)
    }
const validToken =  (req, res) =>
    {
        console.log("Validar token...");
        
        let  record = { ...req.body }
                    
        usuarios.findOneAndUpdate({"token" : record.token } ).then((resultado) => 
            { 
                
              if (resultado==null) 
                { 
                   res.status(200).json({ "data" : false, "message": "Token no es válido" })
                   
                } 
                else 
                { 
                    console.log("RESULTADO token:",  resultado );

                    res.status(200).json({ "data" : true, "user" : resultado.user , "profile": resultado.profile })
                                            

                } 

            }
        )  ;
    }

const validar =  (req, res) =>
        {
           
            console.log("Validar usuario...");
            console.log("usuario sesión antes:",  req.session.sessuser );
            
            let  record = { ...req.query }
            //console.log('req.body', record)
            var id = crypto.randomBytes(20).toString('hex');
            const updatev = { "token" : id } ;
            
            usuarios.findOneAndUpdate({"user" : record.user, "password" : record.password}, updatev ).then((resultado) => 
                { 
                    
                  if (resultado==null) 
                    { 
                       res.status(200).json({ "data" : false, "message": "Usuario o Clave incorrectos" })
                       
                    } 
                    else 
                    { 
                        console.log("RESULTADO:",  resultado );
                        console.log("usuario sesión:",  req.session.sessuser );
                        console.log("usuario resultado:",  resultado.user);

                        res.status(200).json({ "data" : true, "token" : id , "profile" : resultado.profile, "message": "Usuario válido" })
                                                
 
                    } 
 
                }
            )  ;
             
            
                
                
        } 

const validar2 =  (req, res) =>
    {

        console.log("Validar usuario...");
        console.log("usuario sesión antes:",  req.session.sessuser );
        
        let  record = { ...req.body }
        console.log('req.body', record)
        var id = crypto.randomBytes(20).toString('hex');
        usuarios.findOne({"user" : record.user, "password" : record.password} ).then((resultado) => 
            { 
                
                if (resultado==null) 
                { 
                    res.status(200).json({ "data" : false, "message": "Usuario o Clave incorrectos" })
                } 
                else 
                { 
                    console.log("RESULTADO:",  resultado );
                    console.log("usuario sesión:",  req.session.sessuser );
                    console.log("usuario resultado:",  resultado.user);

                    
                        console.log("usuario token:",  id);
                        req.session.sessuser = resultado.user;
                        req.session.sessprofile = resultado.profile;
                        console.log("perfil",  resultado.profile);
                        console.log("usuario sesión después:",  req.session.sessuser );
                        res.status(200).json({ "data" : true, "token" : id , "message": "Usuario válido" })

                                            

                } 
            });
            
            
    } 
    

const pwdUpdate =  (req, res) =>
    {

        console.log("Cambio contraseña");
                    
        let  record = { ...req.body }
        console.log('req.body', record)

        usuarios.findOne({"user" : record.user, "password" : record.passwordold} ).then((resultado) => 
            { if (resultado==null) 
                { 
                    res.status(200).json({ "data" : false, "message": "Usuario o Clave incorrectos" })
                } 
                else 
                { 
                    const filter = { "user" : record.user };
                    const updatev = { "password" : record.passwordnew } ;
                    usuarios.updateOne (filter, updatev ).then((result) => 
                   {
                       console.log("usuario sesión:",  req.session.sessuser, "result=>", result );                 
                       res.status(200).json({ "data" : true, "message": "Contraseña actualizada" })
                   });
                } 
            });
            
            
    } 
const logout =  (req, res) =>
    {

        console.log("Log out usuario...");
                    
                    console.log("usuario sesión:",  req.session.sessuser );
                    
                   // res.status(200).json({ "data" : true, "message": "Usuario válido" })
                
                    req.session.destroy((err) => {
                        if (err) {
                          console.log(err);
                          res.status(200).json({ "data" : false, "message": "Ocurrió un error: " + err })
                        } else 
                        {
                            res.status(200).json({ "data" : true, "message": "Logout exitoso" })
                            //res.redirect('./');
                        }
                      });
    } 


const datos =  (req, res) =>
{

    console.log("datos de sesión:",  req.session.sessuser );
    res.status(200).json({ "data" : {"user" : req.session.sessuser, "profile" : req.session.sessprofile}})

} 


export {
    validar, pwdUpdate, logout, datos, userLogged, validToken, validarToken
    }
    