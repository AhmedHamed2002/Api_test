//  middleware
// let  {courses} = require('../data/courses.js') ;
let Course = require('../models/courses.model') ;
const {validationResult  , matchedData } = require('express-validator');
const httpStatusText = require('../utils/httpStatusText');

const  getAllCourses = async (req , res)=>{
    try{
        const query =  req.query ; 
        let  limit  = query.limit  ||  undefined; 
        let  page =  query.page || 1;     
        let  skip  =  (page-1) * limit ;

        // res.json(courses) ;
        const courses = await Course.find({} , {__v:0}).limit(limit).skip(skip) ; 
        res.status(200).json({status:httpStatusText.SUCCESS ,  data:courses}) ; 
    }
    catch(err){
        res.status(500).json({status : httpStatusText.ERROR , message:err.message}) ; 
    }
}

const getSigleCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id, { __v: 0 });
        if (!course) {
            return res.status(404).json({ status: httpStatusText.FAIL, data: "course not found" });
        }
        res.status(200).json({ status: httpStatusText.SUCCESS, data: course });
    } 
    catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ status: httpStatusText.ERROR, message: "invalid object ID" });
        }
        res.status(500).json({ status: httpStatusText.ERROR, message: "server error" });
    }
};

const createCourse =  (req , res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({status:httpStatusText.ERROR , message:errors.array()});
        }
        else{
            const  data =  matchedData(req) ;
            // courses.push({id: courses.length+1 , ...data }) ;
            const course =  new Course(data) ; 
            course.save() ; 
            res.status(201).json({status:httpStatusText.SUCCESS ,  data:"course created"}); 
        }
    }
    catch(err){
        res.status(500).json({status:httpStatusText.ERROR , message:"server error"}) ; 
    }
}

const updateCourse = async (req , res)=>{
    try{
        const error  =  validationResult(req) ; 
        if(!error.isEmpty()){
            return res.status(400).json({status:httpStatusText.ERROR , message:error.array()});
        }
        else{
            // for(let i=0 ; i<courses.length ; i++){
            //     if(courses[i].id == parseInt(req.body.id))
            //         courses[i] = {...courses[i] , ...req.body}
            // }
            // let course =  courses.find(c  =>  c.id == parseInt(req.body.id));
            try{
                let isFind = await Course.findById(req.body.id) ; 
                if(!isFind)  res.status(404).json({status:httpStatusText.FAIL , data:"course not found"});
                else{
                    await Course.updateOne({_id:req.body.id} , {...req.body}) ; 
                    const  newUpdataCourse  =  await Course.findById(req.body.id , {__v:0}) ; 
                    // course = {...course , ...req.body}
                    res.json({
                        status:httpStatusText.SUCCESS,
                        data:{
                            massage: "course updated",
                            course: newUpdataCourse
                        } 
                    });
                }
            }
            catch(err){
                res.status(404).json({status:httpStatusText.ERROR , data:"invalid object ID"});
            }
        }
    }
    catch(err){
        res.status(500).json({status:httpStatusText.ERROR , message:"server error"}) ;
    }
}

const deleteCourse = async (req , res)=>{
    try{
        const error  =  validationResult(req) ; 
        if(!error.isEmpty()){
            return res.status(400).json({status:httpStatusText.ERROR , message:error.array()}) ; 
        }
        else{
            try{
                // courses.filter(c  =>  c.id != parseInt(req.body.id)); 
                await Course.deleteOne({_id:req.body.id}) ; 
                res.json({
                    status:httpStatusText.SUCCESS,
                    data: "course deleted",
                });
            }
            catch(err){
                res.status(400).json({status:httpStatusText.ERROR , massage:"invalid object ID"});
            }
        }
    }
    catch(err){
        res.status(500).json({status:httpStatusText.ERROR , message:"server error"}) ;
    }
}

module.exports ={
    getAllCourses,
    getSigleCourse,
    createCourse,
    updateCourse,
    deleteCourse
}
