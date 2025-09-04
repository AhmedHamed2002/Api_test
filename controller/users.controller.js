let  User = require('../models/users.model');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const  httpStatusText =  require('../utils/httpStatusText') ; 
const {validationResult  , matchedData } = require('express-validator');

const  getAllUsers  = async (req , res)=>{
    try{
            const query =  req.query ; 
            let  limit  = query.limit  ||  undefined; 
            let  page =  query.page || 1;     
            let  skip  =  (page-1) * limit ;
    
            // res.json(courses) ;
            const courses = await User.find({} , {__v:0 , password:0}).limit(limit).skip(skip) ; 
            res.status(200).json({status:httpStatusText.SUCCESS ,  data:courses}) ; 
        }
        catch(err){
            res.status(500).json({status : httpStatusText.ERROR , message:err.message}) ; 
        }
}

const  registerUser = async (req , res)=>{
    try{
        const errors =  validationResult(req) ; 
        if(!errors.isEmpty()){
            return res.status(400).json({status:httpStatusText.ERROR , message:errors.array()});
        }
        const data = matchedData(req) ;
        const oldUser = await User.findOne({email:data.email}) ; 
        if(oldUser) return  res.status(400).json({status:httpStatusText.FAIL , data:"user already exists"})
        // hashing  password 
        const passwordHash = await bcrypt.hash(data.password , 10) ; 
        data.password = passwordHash ;
        let user;    
        if(req.file && req.file.filename){
            user = new User({...data , image: req.file.filename}); 
        }
        else{
            user = new User(data); 
        }
        user.save() ; 
        res.status(201).json({status:httpStatusText.SUCCESS , data:"user registered successfully"}) ;
    }
    catch(err){
        res.status(500).json({status : httpStatusText.ERROR , message:err.message})  ; 
    }
}

const  loginUser = async (req , res)=>{
    try{
        const errors =  validationResult(req) ; 
        if(!errors.isEmpty()) return res.status(400).json({status:httpStatusText.ERROR , message:errors.array()})
        const data = matchedData(req) ; 
        const user = await User.findOne({email:data.email} ,{__v:0 , _id:0 , role:0}) ;
        if(user){
            const match = await bcrypt.compare(data.password , user.password) ; 
            if(match) {
                //  gen token 
                const  token  =  jwt.sign({ firstName: user.firstName  , lastName: user.lastName , email: user.email , role: user.role }, process.env.JWT_SECRET_KEY ,{ expiresIn: '24h' }); 
                // const view =  user ; 
                // view.password = undefined ; 
                // view.image = `http://localhost:4000/api/uploads/${user.image}`; 
                
                return res.status(200).json({status:httpStatusText.SUCCESS , data:"user logged in successfully" , token:token })
            }
        } 
        res.status(400).json({status:httpStatusText.FAIL , data:"email or password is incorrect"}) ;
    }
    catch(err){
        res.status(500).json({status : httpStatusText.ERROR , message:err.message}) ; 
    }
}

module.exports = {getAllUsers , registerUser , loginUser} ;