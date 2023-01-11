const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");


const app = express();
require("dotenv").config();

app.use(cors());
// axios出现了无法404的状况，无法获取data，所以使用这个来获取数据
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/api/auth",userRoute)

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

