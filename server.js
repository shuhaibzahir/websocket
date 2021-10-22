const io = require("socket.io")(8900)
io.set('origins', '*:*');
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

