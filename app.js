
const bcrypt=require("bcrypt");
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
const mySaltRounds=10;
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
app.post("/register",async (req,res)=>{
    const hash=await bcrypt.hash(req.body.password,mySaltRounds);
    const newUser=new User({
        username:req.body.username,
        password:hash
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

app.post("/login",async (req,res)=>{
    try{
        const foundUser=await User.findOne({username:req.body.username});
        if(foundUser){
            const result=await bcrypt.compare(req.body.password,foundUser.password);
            if(result){
                res.render("secrets");
            }
            else{
                res.status(401).send("Wrong usernameor password");
            }
        }
        else{
            res.status(401).send("Wrong usernameor password");
    
        }
    }
    catch(error){
        console.error(error);
    }
    
        
    // .then(foundUser=>{
       
    //     if(foundUser.password===md5(req.body.password)){
    //         res.render("secrets");
    //     }
    //     else{
    //         res.status(401).send("Wrong username or password!");
           
    //     }
       
    // })
    // .catch(error=>{
    //     console.error(error);
    // })
});






app.listen(3000,()=>{
    console.log("server started at port 3000");
});