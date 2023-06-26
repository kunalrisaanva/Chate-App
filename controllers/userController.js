const {User , Chat} = require("../models/allModel")
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// hashpasswordGenrator 

async function hashPassword(password){
   try {
    const newpassword = bcrypt.hash(password,10);
    return newpassword;
   } catch (error) {
    console.log(error.message)
   }
}


 // register contoller 

 const registerLoad = async(req,res) => {
   try {
      res.render('register') 
   } catch (error) {
    console.log(error.message)
   }
}


// register controller

const register = async(req,res) => {
    try {
        const newHashPassword = await hashPassword(req.body.password)
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            password:newHashPassword,
            image:'images/'+req.file.filename
        })
        await user.save();
        res.render('register',{message:"Registration has been succsessfully!"});
    } catch (error) {
     console.log(error.message)
    }
}



const loadLoading = async(req,res) => {
    try {
        res.render("login")
    } catch (error) {
        console.log(error.message)
    }
}


const Login = async(req,res) => {
    try { 
       const email = req.body.email;
       const password = req.body.password;
        const userData = await User.findOne({email:email});
        if(userData){
          const isMatch = await bcrypt.compare(password,userData.password);
           if(isMatch){
                req.session.user = userData;
                res.redirect("/dashboard");
           }else{
            res.render('login',{message:" password is incorrect"});
           }
        }else{
            res.render('login',{message:"email is incorrect"});
        }
    } catch (error) {
        console.log(error.message) 
    }
}




const logut = async(req,res) => {
    try {
        req.session.destroy()
        res.redirect("/");
    } catch (error) {
        console.log(error.message)
    } 
}  
  
   
const loadDashBoard = async(req,res) => { 
    try {
        const users  = await User.find({_id:{$nin:[req.session.user._id]}})
        res.render("dashboard",{user:req.session.user , users:users});   //
        const data = req.session.user;
    } catch (error) {
        console.log(error.message)
    } 
} 


const saveChate = async(req,res)=>{
    try {

    const sessionData =  req.session.user
       var chat = new Chat({
            sender_id:sessionData._id,
            receiver_id:req.body.receiver_id,
            message:req.body.message
        })
        var chateData = await chat.save()
         res.status(200).send({success:true, msg:"chat inserted" , data:chateData});

    } catch (error) {
        res.status(400).send({success:false, msg:error.message})
    }
} 
  

const deleteChat = async(req,res) => {
    try {
       await Chat.deleteOne({_id:req.body.id});
       res.status(200).send({ success:true });
    } catch (error) {
        res.status(400).send({success:false, msg:error.message})
    }
}


const updateChat = async(req,res) => {
    try {
        await Chat.findByIdAndUpdate({_id:req.body.id},{
            $set:{
                message:req.body.message
            }
        })
       res.status(200).send({ success:true });
    } catch (error) {
        res.status(400).send({success:false, msg:error.message})
    }
}

 
module.exports = {
    registerLoad, 
    register, 
    Login,
    logut,
    loadDashBoard,
    loadLoading ,
    saveChate,
    deleteChat,
    updateChat
}         