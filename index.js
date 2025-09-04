require("dotenv").config() ;
const httpStatusText =  require('./utils/httpStatusText'); 

const express  =  require("express") ;  
const cors = require('cors')
const app = express() ;
app.use(express.json()) ;

const mongoose = require('mongoose');
const url = process.env.MONGO_URI ;
mongoose.connect(url).then(
    console.log('connected to database ...')
)
.catch(err => console.error("Database connection error:", err));

app.use(cors())

// middle ware for endpoint  
const  coursesRouter = require("./routes/courses.route") ;
const  usersRouter = require("./routes/users.route") ;
const imagesRouter =  require("./routes/images.route") ; 
app.use("/api/courses" , coursesRouter) ;
app.use("/api/users" , usersRouter) ;
app.use("/api/uploads" , imagesRouter); 

app.use((req , res)=>{
    res.status(404).json({status:httpStatusText.ERROR , message:"this  resourse is not available"}) ;
})

app.listen(4000 , ()=>{
    console.log("listening on port 4000 ... ");
})
