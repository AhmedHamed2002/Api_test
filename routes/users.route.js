const express  =  require('express');
const router =  express.Router() ; 
const userController  =  require('../controller/users.controller')
const validator  =  require('../middleware/users_validation') ; 
const verify  =  require('../middleware/verifyToken') ; 
const imageValidation  =  require('../middleware/image_validation') ; 



// get  all  user 
router.route('/').get(verify.verifyToken , userController.getAllUsers) ;

// register user  
router.route('/register').post(imageValidation.uploadImage , validator.registerValidation(), userController.registerUser) ;

// login user 
router.route('/login').post(validator.loginValidation() , userController.loginUser) ;


module.exports = router ; 