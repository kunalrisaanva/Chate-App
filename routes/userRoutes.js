const express = require("express");
const user_routes= express();
const bodyParser = require("body-parser");
const session = require("express-session");
const { session_Secret_key } = process.env



// middlweares 

user_routes.use(bodyParser.json());
user_routes.use(bodyParser.urlencoded({extended:true}));


//session 

user_routes.use(session({
    secret:session_Secret_key,
    resave:true,
    saveUninitialized:true,
    // cookie:{maxAge:20000}
    
})); 

//view engine set

user_routes.set("view engine","ejs"); 
user_routes.set("views","./views") 

user_routes.use(express.static("public"));


const path = require("path"); 
const multer = require("multer");


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,"../public/images"));
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname
        cb(null,name);
    }
})

const upload = multer({storage:storage});


//contoller 

const userController = require("../controllers/userController");
const auth =  require("../middlewares/auth");

 user_routes.get("/register",auth.isLogout,userController.registerLoad)
 user_routes.post("/register",upload.single('image'),userController.register)
 
 user_routes.get('/',auth.isLogout,userController.loadLoading);
 user_routes.post("/",userController.Login);
 
 user_routes.get("/logout",auth.isLogin,userController.logut);
 user_routes.get("/dashboard",auth.isLogin,userController.loadDashBoard);

 user_routes.post('/save-chat',userController.saveChate);

 user_routes.post('/delete-chat',userController.deleteChat);

 user_routes.post('/update-chat',userController.updateChat);



 user_routes.get('*',function(req,res){
    res.redirect('/')
 })  
 
module.exports = user_routes    
 
        