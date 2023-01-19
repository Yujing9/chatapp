const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const messageRoute = require("./routes/messageRoute");
const socket = require("socket.io");

const app = express();
require("dotenv").config();

app.use(cors());
// axios出现了无法404的状况，无法获取data，所以使用这个来获取数据
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/api/auth",userRoute)
app.use("/api/messages",messageRoute)

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology:true,

}).then(()=>{
    console.log("DB Connection Successfully");
}).catch((err)=>{
    console.log(err.message);
})

const server = app.listen(process.env.PORT,() => {
    console.log('Server Started on Port',process.env.PORT);
});

const io = socket(server,{
    cors:{
        origin:"http://localhost:3000",
        credentials:true,
    },
});
global.onlineUsers = new Map();

io.on("connnection",(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userId)=>{
        onlineUsers.set(userId,socket.id);
    });
    socket.on("send-msg",(data)=>{
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            socket.to(sendUserSocket).emit("msg-receive",data.message);
        }
    });
});