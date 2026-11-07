import mongoose from 'mongoose';

const medicaSchema = new mongoose.Schema( {
    code   : Number,
    nombre :  String
})

const medica = mongoose.model ('medicamentos', medicaSchema)

export default medica