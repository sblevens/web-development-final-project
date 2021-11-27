//importing modules
const express = require('express');
var mongoose = require('mongoose');
//need to download these
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
const app = express();

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


//routes
app.use('/api', route);

//testing  server
app.get("/",(req,res)=>{
    console.log("testing");
    res.send('foobar');
});

var books;

app.get("/books",(req,res)=>{
    console.log("in show");
    dbBooks.find().toArray((err, results) => {
        if(err) return console.log("error: " + err);
        this.books = results;
        console.log("books: "+ this.books);
        console.debug(this.books);
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

app.post("/show",(req,res)=> {
    console.log(req.body);

    db.insertOne(
        ['test','test1'],
        (err,result)=> {
            if(err) {
                return console.log("error: "+ err);
            }
            console.log("success");
            res.redirect("/show");
        });
});


app.listen(PORT,()=>{
    console.log('Server started at port:'+PORT);
});