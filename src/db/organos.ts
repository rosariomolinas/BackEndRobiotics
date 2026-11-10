import mongoose from 'mongoose';

const orgSchema = new mongoose.Schema( {
    code   : Number,
    nombre :  String,
    mtejido : Boolean,
    msangre : Boolean,
    tomo3d : Boolean,
    medica : Boolean,
    orden : Number,
    activo : Boolean
})

const orgs = mongoose.model ('organos', orgSchema)

export default orgs