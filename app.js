require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const app=express();
const mongoose=require("mongoose");
app.use(express.static("public"));
app.set("view engine","ejs");
const encrypt=require("mongoose-encryption");
app.use(express.urlencoded({extended:true}));
mongoose.connect("mongodb://127.0.0.1:27017/secretDB");
const usersSchema=new mongoose.Schema({
    username:String,
    password:String
});

usersSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields:["password"]});
const User=new mongoose.model("User",usersSchema);
app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/register",(req,res)=>{
    res.render("register");
});
app.post("/register",(req,res)=>{
    const newUser=new User({
        username:req.body.username,
        password:req.body.password
    });
    newUser.save()
    .then(value=>{
        console.log("new user has been added "+value);
        res.render("secrets");
    })
    .catch(error=>{
        console.error(error);
    });
});

app.post("/login",(req,res)=>{
    User.findOne({username:req.body.username})
    .then(foundUser=>{
        if(foundUser.password===req.body.password){
            res.render("secrets");
        }
        else{
            console.log("wrong username or password");
           
        }
       
    })
    .catch(error=>{
        console.error(error);
    })
});






app.listen(3000,()=>{
    console.log("server started at port 3000");
});