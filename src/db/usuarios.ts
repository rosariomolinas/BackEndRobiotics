import mongoose from 'mongoose';

const usuSchema = new mongoose.Schema( {
    user     :  String,
    password :  String,
    profile  :  String,
    token    : String
})

const usuarios = mongoose.model ('usuarios', usuSchema)

export default usuarios