/////backend modules setup along with passport session management prerequisites

const express = require("express");

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded(({extended:true})));

app.use(express.static("public"));

const Mongoose = require("mongoose");


app.set("view engine","ejs");

const session = require("express-session");

const passport = require("passport");

const passportLocalMongoose = require("passport-local-mongoose");

app.use(session({
    secret: "!!codingToTheHeartsContent**!!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());

app.use(passport.session());

const encrypt = require("mongoose-encryption");

Mongoose.connect("mongodb://localhost:27017/authDB",()=>{
    console.log("cntd");
});

const userSchema = new Mongoose.Schema({
    firstName:String,
    secondName:String,
    userName:String,
    email:String,
    password:String,
});

userSchema.plugin(passportLocalMongoose);

const User = new Mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

////////////////////////////////////////////////////////////////////////////////////


app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/htmls/login.html");
});









app.listen(3000,()=>{
    console.log("started");
})