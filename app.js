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


app.get("/books/:id",(req,res)=>{
    let b = [];
    console.log("checking favorites");
    req = req.params.id;
    dbLogin.findOne({username:req})
    .then(user => {
        if(user){
            dbBooks.find().toArray((err, results) => {
                if(err) return console.log("error: " + err);
                b = results;
                console.log(b);
                for(book of b){
                    if(user.favorites[book.name]){
                        console.log("is true: "+ book.name);
                        book.favorited = true;
                    } else {
                        book.favorited = false;
                    }
                    if(user.toBeRead[book.name]){
                        book.toBeRead = true;
                    } else {
                        book.toBeRead = false;
                    }
                }
                res.send(b);
            });
            
        }
    })
    .catch(err =>{
        console.log("error: "+ err);
    })
});

app.get("/toberead/:id",(req,res)=>{
    req = req.params.id;
    let b = [];
    dbLogin.findOne({username:req})
    .then(user => {
        if(user){
            console.log(user.toBeRead);
            var keys = Object.keys(user.toBeRead);
            console.log(keys);
            let query = {};
            query['$or'] = [];
            for(var key of keys){
                var val = user.toBeRead[key];
                console.log("val: ");
                console.log(val);
                if(val){
                    query['$or'].push({name:key});
                }
            }
            console.log(query);

            dbBooks.find(query).toArray((err,results)=>{
                console.log("results:");
                console.log(results);
                b = results;
                console.log("sending" + results);
                res.send(results);
            });

        }
    })
    .catch(err => {
        console.log("error: "+err);
    })
});


app.get("/bookdetail/:user/:id", (req,res)=> {
    req_id = req.params.id;
    req_user = req.params.user;
    f = false;
    r = false;
    console.log("getting reviews");
    dbReviews.find({book_name: req_id}).toArray((err,results)=> {
        if(err) return console.log("error: "+ err);
        dbLogin.findOne({username:req_user}).then(user => {
            if(user){
                console.log(user);
                console.log(req_id);
                if(user.favorites[req_id]){
                    console.log("true");
                    f = true;
                }
                if(user.toBeRead[req_id]){
                    r = true;
                }
            }
            console.log("results: "+ results);
            res.send({results:results,favorited:f,toBeRead:r});
        }).catch(err => {console.log("error: " + err);})
    });

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

app.post("/postBook",(req,res)=>{
    console.log("inserting book");
    let insert = {
        author: req.body.author, 
        name: req.body.name, 
        favorited: false, 
        rating:0
    }
    dbBooks.insertOne(insert, (err,result)=>{
        if(err) return console.log("error inserting book: "+ err);
        console.log("inserted book");
    });
    res.send({result:'done'});
})

app.post("/postReview",(req,res)=>{
    console.log("inserting review");
    dbReviews.insertOne(req.body,(err,result)=>{
        if(err) return console.log("error inserting review: "+ err);
        console.log("inserted review");
    })
})

app.put("/updateFavorites",(req,res)=>{
    console.log("update fav");
    let f = false;
    if(req.body.fav.localeCompare("true")==0){
        f = true;
    }
    console.log(req.body);
    let query = {};
    query["favorites."+req.body.name] = f
    dbLogin.updateOne({username:req.body.user},
        {
            $set: query
        })
    res.send({result:""});
})

app.put("/updateToBeRead", (req,res)=> {
    console.log("update to be read");
    let r = false;
    if(req.body.toBeRead.localeCompare("true")==0){
        r = true;
    }
    let query = {};
    query["toBeRead."+req.body.name] = r;
    dbLogin.updateOne({username:req.body.user}, {
        $set: query
    })
    res.send({results:""});
});

app.listen(PORT,()=>{
    console.log('Server started at port:'+PORT);
});