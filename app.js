
require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");

const app=express();

app.use(express.static("public"));
app.set("view engine","ejs");
const encrypt=require("mongoose-encryption");
app.use(express.urlencoded({extended:true}));

app.use(session({
    secret:"it is my little secret",
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/secretDB");

const usersSchema=new mongoose.Schema({
    username:String,
    password:String
});

usersSchema.plugin(passportLocalMongoose);
const User=new mongoose.model("User",usersSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/",(req,res)=>{
    res.render("home");
});
app.get("/login",(req,res)=>{
    res.render("login");
});
app.get("/register",(req,res)=>{
    res.render("register");
});
app.get("/secrets",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else{
        res.redirect("/login");
    }
});
app.get("/logout",(req,res)=>{
    req.logout(()=>{
        res.redirect("/");
    });
   
});
app.post("/register",async (req,res)=>{
   User.register({username:req.body.username}, req.body.password, (err,user)=>{
    if(err){
        res.redirect("/register");
    }
    else{
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/secrets");
        })
    }
   })
});

app.post("/login",async (req,res)=>{
   const user=new User({
    username:req.body.username,
    password:req.body.password
   });
   req.login(user,(error)=>{
    if(error){
        console.error(error);
    }
    else{
        passport.authenticate("local")(req,res,()=>{
            res.redirect("/secrets");
        });
    }
   });
});






app.listen(3000,()=>{
    console.log("server started at port 3000");
});