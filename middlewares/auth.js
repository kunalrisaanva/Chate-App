const isLogin = async(req,res,next) => {
    try {
        if(req.session.user){
            // console.log("user authenticate")
        }
        else{
            res.redirect("/") 
        }
        next()
    } catch (error) {
        console.log(error.message)
    }
      
}   



const isLogout = async(req,res,next) => {
    try {
        if(!req.session.user){
            // res.redirect('/dashboard')
            // console.log("not authenticated") 
        }
        next()
    } catch (error) {
        console.log(error.message)
    }
}   
 
module.exports = {
    isLogin,
    isLogout,
    
}
 