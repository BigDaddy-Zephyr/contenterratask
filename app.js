var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


var mongoose = require('mongoose');

//Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/my_database';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  username: String,
  email:String,
  password: String,
  role:Number
},{timestamps:true});

var User = mongoose.model('User', UserSchema );


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var bodyParser = require('body-parser')
app.use('/', indexRouter);
app.use('/users', usersRouter);


app.post('/adduser',(req,res)=>{

var data = req.body;
User.create({ 
	username:data.username,email:data.email,password:data.password,role:data.role }, function (err) {
  if (err) return handleError(err);
  res.send("saved");
  // saved!
});



})
app.get('/getuser',(req,res)=>{
let result = User.find({}, function (err, docs) {res.send(docs);});

});

app.get('/getuserby',(req,res)=>{
var data=req.body;

	User.find({username:data.username,email:data.email,createdAt: {
        $lt: new Date(data.datehigher),$gt:new Date(data.datelower)
    },role:data.role}, function (err, docs) {res.send(docs);});

})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
