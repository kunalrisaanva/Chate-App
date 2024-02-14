const dotenv = require("dotenv");
dotenv.config()
const express = require("express")
const app = express()   
const http = require("http").Server(app);
const url = "http://localhost:1123/"

const {Chat , User } = require("./models/allModel");

//  mongoose connnection

const dbConnection = require("./config/connection");
dbConnection(process.env.url)


// routes

const userRoute = require("./routes/userRoutes");
app.use("/",userRoute);


const io = require("socket.io")(http);

// namespace 

var usp = io.of('/user_namespace');

// socket io intigiration 


usp.on('connection',async function(socket){
    console.log('user conneted ')
    var user_id = socket.handshake.auth.token
    await User.findByIdAndUpdate({_id:user_id} , {$set:{isOnline:'1'}});

    // user broadcast online status

    socket.broadcast.emit("getOnlineUser",{user_id:user_id})

    socket.on('disconnect',async function(){
        console.log('user disconnected');


        var user_id = socket.handshake.auth.token
        await User.findByIdAndUpdate({_id:user_id} , {$set:{isOnline:'0'}});

          // user broadcast offlinex status

    socket.broadcast.emit("getOfflineUser",{user_id:user_id})

    })

    // chating impementation

    socket.on('newChat',function(data){
        socket.broadcast.emit('loadNewChat',data)
    })


    // load old chat 

  
   socket.on('existsChat',async function(data){
        var chats = await Chat.find({$or:[
              {sender_id:data.sender_id , receiver_id:data.receiver_id},
              {sender_id:data.receiver_id , receiver_id:data.sender_id},
            ]});

            socket.emit('laodChats',{ chats:chats }); 
      })
  
      
    //  delete chat

    socket.on('chatDeleted',function(id){
      socket.broadcast.emit('chateMessageDeleted',id);
    })
 
     //  update chat

     socket.on('chatUpdated',function(data){
      socket.broadcast.emit('chateMessageUpdated',data);
    })

});

 
// port listening  
console.log(process.env.port)
http.listen(process.env.port,() => {
console.log(`server is running on PORT ${process.env.port} 
${url}`)})
  
 
