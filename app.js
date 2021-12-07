//importing modules
const express = require('express');
var mongoose = require('mongoose');
//need to download these
// var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
const app = express();
var session = require('express-session');

const sanitize = require("mongo-sanitize");
const Validator = require("validatorjs");

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
    cookie: {
        maxAge: 8 * 60 * 60 * 1000
     }, // 8 hours
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
    
});

app.get("/avg_reviews/:id", (req,res)=> {
    req = req.params.id;
    dbReviews.find({book_name: req},{rating:1}).toArray((err,results)=>{
        if(err) return console.log("error "+err);
        console.log(results);
        res.send(results);
    })
});

var login_rules = {
    user: "required",
    pass: "required"
};

app.post("/login", (req,res) => {
    console.log("post login");
    console.log(req.body);
    //sanitize
    req.body = sanitize(req.body);
    let validation = new Validator(req.body, login_rules);
    if(validation.passes()){
        //authenticate
        dbLogin.findOne({username: req.body.user})
        .then(user => {
            if(!user){
                console.log("user not found");
                res.send({errors:"user not found"})
                logout();
            } else {
                if(user.password.localeCompare(req.body.pass)==0){
                    console.log("yes");
                    req.session.userId = user.username;
                    res.send({result:"successful",user: req.session.userId});
                } else {
                    console.log("incorrect");
                    res.send({errors:"invalid data"});
                    logout();
                }
            }
        }).catch(err => {
            console.log("error ");
            console.log(err);
        })
    } else {
        let errorsList = {
            user: validation.errors.first("user"),
            pass: validation.errors.first("pass")
        };
        res.send({errors:errorsList});
    }
    
});

app.post("/register",(req,res)=>{
    let insert = {
        username: req.body.user,
        password: req.body.pass,
        favorites: {},
        toBeRead: {}
    }
    //sanitize
    insert = sanitize(insert);
    let validation = new Validator(req.body, login_rules);
    if(validation.passes()){
        dbLogin.insertOne(insert, (err,results)=>{
            if(err) return console.log("error: "+ err);
            console.log("registered");
            res.send(true);
        })
    } else {
        let errorsList = {
            user: validation.errors.first("user"),
            pass: validation.errors.first("pass")
        };
        res.send({errors:errorsList});
    }
    
});

app.get("/logout",(req,res) => {
    console.log("logging out");
    let response = logout(req,res);
    res.send(response);
});

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

var book_rules = {
    author: "required",
    name: "required",
    rating: "integer|between:0,5"
};

app.post("/postBook",(req,res)=>{
    console.log("inserting book");
    let insert = {
        author: req.body.author.trim(), 
        name: req.body.name.trim(), 
        rating:0
    }
    console.log("after trim");
    console.log(insert.author);
    console.log(insert.name);
    console.log(insert.rating);
    //sanitize
    insert = sanitize(insert);
    let validation = new Validator(insert, book_rules);
    if(validation.passes()){
        dbBooks.findOne({$and: [{name: insert.name}, {author:insert.author}]})
        .then(book => {
            if(!book){
                dbBooks.insertOne(insert, (err,result)=>{
                    if(err) return console.log("error inserting book: "+ err);
                    console.log("inserted book");
                });
                res.send({result:'done'});
            } else {
                res.send({exists:true});
            }
        })
        .catch(err => {
            console.log("err "+ err);
        })
        
    } else {
        //error
        let errorsList = {
            author: validation.errors.first("author"),
            name: validation.errors.first("name"),
            rating: validation.errors.first("rating"),
        };
        res.send({errors:errorsList});
    }
})

var review_rules = {
    book_name: "required",
    rating: "integer|between:0,5",
    review: "required",
    review_author: "required"
};

app.post("/postReview",(req,res)=>{
    console.log("inserting review");
    //sanitize
    req.body = sanitize(req.body);
    let validation = new Validator(req.body, review_rules);
    if(validation.passes()){
        dbReviews.insertOne(req.body,(err,result)=>{
            if(err) return console.log("error inserting review: "+ err);
            console.log("inserted review");
        })
    } else {
        //error
        let errorsList = {
            book_name: validation.errors.first("book_name"),
            review: validation.errors.first("review"),
            rating: validation.errors.first("rating"),
            review_author: validation.errors.first("review_author")
        };
        res.send({errors:errorsList});
    }
})

var fav_rules = {
    fav: "required",
    name: "required",
    user: "required"
};

app.put("/updateFavorites",(req,res)=>{
    console.log("update fav");
    //sanitize
    req.body = sanitize(req.body);
    let validation = new Validator(req.body, fav_rules);
    if(validation.passes()){
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
    } else {
        //error
        let errorsList = {
            fav: validation.errors.first("fav"),
            user: validation.errors.first("user"),
            name: validation.errors.first("name")
        };
        res.send({errors:errorsList});
    }
    
})

var toberead_rules = {
    toBeRead: "required",
    name: "required",
    user: "required"
};

app.put("/updateToBeRead", (req,res)=> {
    console.log("update to be read");
    //sanitize
    req.body = sanitize(req.body);
    let validation = new Validator(req.body, toberead_rules);
    if(validation.passes()){
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
    } else {
        //error
        let errorsList = {
            toBeRead: validation.errors.first("toBeRead"),
            user: validation.errors.first("user"),
            name: validation.errors.first("name")
        };
        res.send({errors:errorsList});
    }
    
});

app.listen(PORT,()=>{
    console.log('Server started at port:'+PORT);
});