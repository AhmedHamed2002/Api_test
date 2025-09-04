const mongoose = require('mongoose');
const  validator  =  require('validator');
const  ROLES  =  require('../utils/roles');

const  UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true , 
        validate :[validator.isEmail  ,  "filed is not valid email"]
    },
    password:{
        type: String,
        required: true ,  
    } , 
    role:{
        type:String ,  
        enum:[ROLES.ADMIN , ROLES.USER] ,  
        default: ROLES.USER
    } ,  
    image:{
        type:String , 
        default:"profile.jpg"
    }
})

module.exports = mongoose.model('User', UserSchema);