const {body} = require('express-validator')

const registerValidation = ()=>{
    return[
        body('firstName')
        .notEmpty().withMessage('first name is required')
        .isLength({min:2}).withMessage('minimam length is 2'), 
        body('lastName')
        .notEmpty().withMessage('last name is required')
        .isLength({min:2}).withMessage('minimam length is 2'), 
        body('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('filed is not valid email'), 
        body('password')
        .notEmpty().withMessage('password is required') ,
        body('role')
        .default('user')
        .isIn(["user", "admin"]).withMessage("Role must be either user or admin"),
    ]
}
const loginValidation = ()=>{
    return[
        body('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('filed is not valid email'), 
        body('password')
        .notEmpty().withMessage('password is required')
    ]
}

module.exports = {
    registerValidation , 
    loginValidation
}