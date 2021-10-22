const express = require("express")

const app = express()
const http = require("http")
const server = http.createServer(app);

const cors = require('cors');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });

    app.use(cors({
        origin: '*'
      }));
      
const io = require("socket.io")(server)
// creating a user array 

let users =[]

const addUser =(userId,SocketId)=>{

  !users.some(i=>i.userId==userId)&&users.push({userId,SocketId})
}
  
const deleteUser =  (socketId)=>{
    users = users.filter(i=>i.SocketId!==socketId)
}


const getUser = (userId)=>{
  return users.find(user=>user.userId===userId)
} 

io.on("connection", (socket) => {
    // when connect 
    console.log('a user connected')


//    take user id and socket id
    socket.on("addUser",userId=>{
       
        addUser(userId,socket.id)
        io.emit("getUser",users)
    })

// send and get messages

    socket.on("sendMessage",({senderId,reciverId,text})=>{
       
           const user= getUser(reciverId)
            if(user){
                io.to(user.SocketId).emit("getMessage",{
            senderId,
               text
             })
            }
           
    })




    // when connect
    socket.on("disconnect",()=>{
        
       deleteUser(socket.id)
    })

})




server.listen(8900);