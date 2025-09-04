// middle ware
const express  = require('express');
const  router =  express.Router()  ; 
const coursesController =  require('../controller/courses.controller.js') ;
const validator =  require('../middleware/courses_validation.js') ;
const verify = require('../middleware/verifyToken.js') ; 
const allowed =  require('../middleware/allowedTo.js') ;


router.route('/')
        .get(verify.verifyToken , coursesController.getAllCourses)
        .post(
            verify.verifyToken ,
            validator.postValidation()
            ,coursesController.createCourse
        )
        .put( 
            verify.verifyToken ,
            validator.putValidation()
            ,coursesController.updateCourse 
        )
        .delete( 
            verify.verifyToken ,
            allowed("admin"), 
            validator.deleteValidation() ,  
            coursesController.deleteCourse
        ) ;   
        
router.route('/:id').get( coursesController.getSigleCourse) ;


module.exports = router ;