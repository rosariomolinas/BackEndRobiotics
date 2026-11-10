import mongoose from 'mongoose';

const docSchema = new mongoose.Schema( {
    code   : Number,
    nombre :  String,
    apellido :  String,
    matricula : Number,
    activo : Boolean
})

const docs = mongoose.model ('doctores', docSchema)

export default docs