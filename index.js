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

const commentSchema = new Mongoose.Schema({
    username:String,
    text:String,
    date:{
        type:Date,
        default:Date.now
    }
});

const questionSchema = new Mongoose.Schema({
    name:String,
    discription:String,
    link:String,
    topic:String,
    difficulty:Number,
    solution:String,
    week:Number,
    comments:[commentSchema]

});

const Question = Mongoose.model('Question',questionSchema);
const Comment = Mongoose.model('Comment',commentSchema);

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
        res.redirect(`/user/${req.user.username}/dashboard`);
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
                res.redirect(`/user/${req.user.username}/dashboard`);
            });
        }
    })
});

app.get("/db/:feild/:name",(req,res)=>{
    var hint;
    if(req.params.feild==="email"){
        hint = {
            email:req.params.name
        }
    }
    else if(req.params.feild==="username"){
        hint = {
            username:req.params.name
        }
    }
    User.findOne(hint,(e,r)=>{
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
        res.redirect(`/user/${req.user.username}/dashboard`);
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
                res.redirect(`/user/${req.user.username}/dashboard`);
            });
        };
    });
});

app.get("/user/:username/dashboard",(req,res)=>{
    if(req.isAuthenticated()){
        if(req.user.username===req.params.username){
            res.render("dashboard",{user:req.user.username});
        }
        else{
            res.redirect("/signin");
        }
    }
    else{
        res.redirect("/signin");
    }
});

app.get("/user/:username/thisweek",(req,res)=>{
    if(req.isAuthenticated()){
        if(req.user.username===req.params.username){
            Question.find((err,ans)=>{
                if(err){
                    console.log(err);
                }
                else{
                    res.render("thisweek",{user:req.user.username,ques:ans,q:null});
                }
            });
        }
        else{
            res.redirect("/signin");
        }
    }
    else{
        res.redirect("/signin");
    }
});

app.get("/user/:username/thisweek/:que",(req,res)=>{
    if(req.isAuthenticated()){
        if(req.user.username===req.params.username){
            req.params.que.replaceAll("%20"," ");
            Question.findOne({name:req.params.que},(err,ans)=>{
                if(err){
                    console.log(err);
                }
                else{
                    Question.find((err,ansi)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            ans.comments.forEach((e)=>{
                                console.log(e);
                            });
                            res.render("thisweek",{user:req.user.username,ques:ansi,q:ans});
                        }
                    });
                }
            });

        }
        else{
            res.redirect("/signin");
        }
    }
    else{
        res.redirect("/signin");
    }
});

app.post("/user/:username/thisweek/:que",(req,res)=>{
    if(req.isAuthenticated()){
        var qque = req.params.que;
        if(req.user.username===req.params.username){
            req.params.que.replaceAll("%20"," ");

            Question.findOne({name:req.params.que},(err,ans)=>{
                if(err){
                    console.log(err);
                }
                else{
                    var cmt ={
                        username:req.user.username,
                        text:req.body.comment
                    };

                    Question.updateOne({_id:ans._id},{comments:[cmt,...ans.comments]},(err,docs)=>{
                        if(err){
                            console.log(err);
                        }
                        else{
                            console.log(docs);
                            res.redirect(`/user/${req.user.username}/thisweek/${qque}`); 
                        }
                    });
                }
            });   
        }
        else{
            res.redirect("/signin");
        }
    }
    else{
        res.redirect("/signin");
    }
});

app.get("/user/:username/prevweek",(req,res)=>{
    if(req.isAuthenticated()){
        if(req.user.username===req.params.username){
            var topics=[];
            Question.find((err,ans)=>{
                if(err){
                    console.log(err);
                }
                else{
                    ans.forEach(e=>{
                        if(!topics.includes(e.topic)){
                            topics.push(e.topic);
                        }
                    });
                }
                res.render("prevweek",{user:req.user.username,ques:ans,topics:topics});
            });
        }
        else{
            res.redirect("/signin");
        }
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
