//importing modules
const express = require('express');
var mongoose = require('mongoose');
//need to download these
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
const app = express();
var session = require('express-session');

const route = require('./routes/route');

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";
const DB_NAME = "BookReview";
const PORT = process.env.PORT || 8080;

var ObjectId = require("mongodb").ObjectId;
const { mongo } = require('mongoose');
// const { db } = require('./models/contact');

const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.connect(err => {
    dbBooks = client.db(DB_NAME).collection("Books");
});

client.connect(err => {
    dbReviews = client.db(DB_NAME).collection("Reviews");
})

client.connect(err => {
    dbLogin = client.db(DB_NAME).collection("Users");
})

// mongoose.set('useNewUrlParser',true);
// mongoose.set('useFindAndModify',false);
// mongoose.set('useCreateIndex',true);

//connect to mongoDB
mongoose.connect('mongodb://localhost:27017/BookReview',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//on connection
mongoose.connection.on('connected',()=>{
    console.log('Connected to database mongodb @ 27017');
});
mongoose.connection.on('error',(err)=>{
    if(err){
        console.log('Error in database connection: '+ err);
    }
});

//port no
// const port = 3000;

//adding middleware - cors
app.use(cors());

//body - parser
// use 
//express.urlencoded({extended: true});
app.use(express.urlencoded({
    extended: true
}));

//static files
app.use(express.static(path.join(__dirname,'public')));

app.use(session({
    secret: "Koda is my dog.",
    resave: true,
    saveUninitialized: false
}));

//routes
app.use('/api', route);

//testing  server
app.get("/",(req,res)=>{
    console.log("testing");
    if(req.session.userId){
        console.log("authenticating");
    }
});

var books;

app.get("/books",(req,res)=>{
        dbBooks.find().toArray((err, results) => {
        if(err) return console.log("error: " + err);
        this.books = results;
        res.send(this.books);
        });
});

app.get("/bookdetail/:id", (req,res)=> {
    req = req.params.id;
    console.log("getting reviews");
    console.log(req);
    dbReviews.find({book_name: req}).toArray((err,results)=> {
        if(err) return console.log("error: "+ err);
        console.log("results: "+ results);
        res.send(results);
    })
})

app.get("/reviews/:id",(req,res)=>{
    req = req.params.id;
    console.log("getting my reviews");
    dbReviews.find({review_author: req}).toArray((err,results)=>{
        if(err) return console.log("error: " + err);
        console.log("results: " +results);
        res.send(results);
    })
    
})

app.post("/login", (req,res) => {
    console.log("post login");
    console.log(req.body);
    //authenticate
    dbLogin.findOne({username: req.body.user})
    .then(user => {
        if(!user){
            console.log("user not found");
            res.send({result:"user not found"})
            logout();
        } else {
            if(user.password.localeCompare(req.body.pass)==0){
                console.log("yes");
                req.session.userId = user.username;
                res.send({result:"successful",user: req.session.userId});
            } else {
                console.log("incorrect");
                res.send({result:"invalid data"});
                logout();
            }
        }
    }).catch(err => {
        console.log("error ");
        console.log(err);
    })
});

app.get("/logout",(req,res) => {
    let response = logout(req,res);
})

function logout(req,res){
    if(req.session){
        req.session.destroy(function (err) {
            if(err){
                console.log("err logging out: "+ err);
                return false;
            }
            else
                return true;
        })
    }
}

// app.post("/show",(req,res)=> {
//     console.log(req.body);

//     db.insertOne(
//         ['test','test1'],
//         (err,result)=> {
//             if(err) {
//                 return console.log("error: "+ err);
//             }
//             console.log("success");
//             res.redirect("/show");
//         });
// });

app.post("/postBook",(req,res)=>{
    console.log("inserting book");
    let insert = {author: req.body.author, name: req.body.name, favorited: false, rating:0}
    dbBooks.insertOne(insert, (err,result)=>{
        if(err) return console.log("error inserting book: "+ err);
        console.log("inserted book");
    });
    res.send({result:'done'});
})


app.listen(PORT,()=>{
    console.log('Server started at port:'+PORT);
});