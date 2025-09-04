const {body} = require('express-validator')

const postValidation = ()=>{
    return[
        body('title')
        .notEmpty().withMessage('name is required')
        .isLength({min:2}).withMessage('minimam length is 2'), 
        body('price')
        .notEmpty().withMessage('price is required')
        .isNumeric().withMessage('price must be a number')
    ]
}

const putValidation = ()=>{
    return [
        body('id').notEmpty().withMessage('id is required'),
        body('title')
        .isLength({min:2}).withMessage('minimam length is 2'), 
        body('price')
        .isNumeric().withMessage('price must be a number')
    ]
}

const deleteValidation = ()=>{
    return body('id').notEmpty().withMessage('id is required')  ;  
}

module.exports = {postValidation , putValidation ,deleteValidation}