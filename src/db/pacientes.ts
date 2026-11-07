import mongoose from 'mongoose';

const pacSchema = new mongoose.Schema( {
    code : Number,
    nombre :  String,
    apellido :  String,
    edad :  Number,
    activo : Boolean
})

const pacientes = mongoose.model('pacientes', pacSchema);
export default pacientes;