import mongoose from 'mongoose';

const intervenSchema = new mongoose.Schema( {
    paciente : Number,
    doctor   : Number,
    fecint   : Date,
    costo    : Number,
    tiempo   : Number,
    ruta     : {type : Array, "default": []}
})

const intervenciones = mongoose.model ('intervenciones', intervenSchema)

export default intervenciones