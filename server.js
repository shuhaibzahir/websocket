const express = require("express")
var app = express();
var server = app.listen(8900,()=>{
    console.log("web socket is running")
}); 

const io = require("socket.io")(server,{
    origin:["https://master.d3tb2mzjm1zl46.amplifyapp.com","http://54.205.19.94","*","http://localhost:3000"]
})
 
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

