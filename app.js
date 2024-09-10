const express = require('express')
const mongoose = require('mongoose');
const authrouter = require('./routes/authRoute');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const auth = 'mongodb://localhost:27017/authSmoothie';
// mongoose.connect(auth, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
// mongoose.set("strictQuery",true);
// mongoose.set("runValidators", true)
mongoose.connect(auth)
  .then((result) => {
    console.log("dbconnected");
    app.listen(3000, ()=>console.log("http://localhost:3000"))
  })
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authrouter);

// app.get('/set-cookies', (req,res) => {
//   // res.setHeader('set-Cookies', 'newUser=true');
//   res.cookie('newUser', false);
//   res.cookie('isEmployee', true, {maxAge: 1000 * 60 * 60 * 24, secure: true});
//   res.send('you have got the cookie');
// })

// app.get('/read-cookies', (req,res) => {

//   const cookie = req.cookies;
//   console.log(cookie);

//   res.json(cookie);
// })