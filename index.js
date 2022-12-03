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


Mongoose.connect("mongodb+srv://skarfistark:arifulla616@cluster0.6yfrdov.mongodb.net/userDB",()=>{
    console.log("cntd");
});

const userSchema = new Mongoose.Schema({
    firstName:String,
    secondName:String,
    username:String,
    email:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

const User = new Mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

////////////////////////////////////////////////////////////////////////////////////




app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/htmls/home.html");
});

app.get('/signin/passwordwrong',(req,res)=>{
    // res.sendFile(__dirname+"/htmls/signin.html");
    res.render("signin",{msg:"Password or username wrong!"});
});


app.route("/signin")
.get((req,res)=>{
    if(req.isAuthenticated()){
        res.sendFile(__dirname+"/htmls/dash.html");
    }
    else{
        res.render("signin",{msg:""});
    }
})
.post((req,res)=>{
    const user = new User({
        username:req.body.username,
        password:req.body.password
    });

    req.login(user,(err)=>{
        if(err){
            console.log(err);
            res.redirect("/signin");
        }
        else{
            passport.authenticate("local",
             {failureRedirect: '/signin/passwordwrong' })(req,res,()=>{
                res.redirect("/dashboard");
            });
        }
    })
});

app.get("/db/username/:name",(req,res)=>{
    User.findOne({username:req.params.name},(e,r)=>{
        if(e){
            console.log(e);
        }
        else{
            if(r==null){
                res.send({status:false})
            }
            else{
                res.send({status:true});
            }
        }
    });
});

app.route("/signup")
.get((req,res)=>{
    if(req.isAuthenticated()){
        res.redirect("/dashboard");
    }
    else{
        res.sendFile(__dirname+"/htmls/signup.html");
    }
})
.post((req,res)=>{

    const user = new User({
        firstName:req.body.fname,
        secondName:req.body.sname,
        email:req.body.email,
        username:req.body.username
    });

    User.register(user,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            res.redirect("/signup");
        }
        else{
            passport.authenticate("local")(req,res,()=>{
                res.redirect("/dashboard");
            });
        };
    });
});

app.get("/dashboard",(req,res)=>{
    if(req.isAuthenticated()){
        res.sendFile(__dirname+"/htmls/dash.html");
    }
    else{
        res.redirect("/signin");
    }
});

app.get("/logout",(req,res)=>{
    req.logout(()=>{
        res.redirect("/signin");
    });
});



app.listen(3000,()=>{
    console.log("started");
})