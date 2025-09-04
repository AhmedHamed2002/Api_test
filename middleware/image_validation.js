const multer  = require('multer') ; 
const  httpStatusText =  require('../utils/httpStatusText') ; 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1]
        const uniqueSuffix = `user${Date.now()}.${ext}` ; 
        cb(null, uniqueSuffix)
    }
})

const  filter = (req , file, cb) => {
    const imageType = file.mimetype.split('/')[0]  ; 
    if(imageType  == "image") cb(null , true)  ;  
    else cb( new Error("Only image files are allowed!") , false) ; 
}

const upload = multer({ storage: storage , fileFilter: filter })

const uploadImage = (req , res ,next)=> {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                status: httpStatusText.FAIL,
                message: err.message, 
            });
        }
        next() ; 
    }
)}

module.exports = {uploadImage} ;