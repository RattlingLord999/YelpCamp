if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.CLOUDINARY_KEY)
console.log(process.env.CLOUDINARY_CLOUD_NAME)
console.log(process.env.CLOUDINARY_SECRET)



const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const db=require('./connection')
const Campground = require('./models/campgrounds');
const Review=require('./models/reviews')
//for layout polishing
const ejsMate=require('ejs-mate')
//for request printing we using morgan middleware
const morgan=require('morgan')
const catchAsync=require('./utils/catchAsync')
const ExpressError=require('./utils/ExpressError')
//it used for efficient validation of data according to pre defined schema
const joi=require('joi')
const { campgroundSchema } = require('./schemas');
const {reviewSchema}=require('./schemas')
//const router = express.Router();
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes=require('./routes/users');

const session =require('express-session')
const flash=require('connect-flash')

//using passport for authentication
const passport = require('passport');
//const passport=require('passport')
const localStrategy=require('passport-local')
const User=require('./models/users')








const app = express();
// to print every incomin request
app.use(morgan('tiny'))

// Mount the routes
     //prefix route    file of route
    // app.use('/campgrounds/:id/reviews', reviews)
//app.use('/campgrounds',campgrounds)



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//app.use is just a way to run a piece of code on every single req
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//tell express we r using ejs mate instead of default ejs
app.engine('ejs',ejsMate)
//static files
app.use(express.static('public'))

const sessionConfig={
    secret:'thisisnotgoodsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
httpOnly:true,
expires:Date.now()+1000*60*60*24*7,
maxAge:Date.now()+1000*60*60*24*7
    }
}


app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    //console.log(req.session)
    req.session.returnTo = req.originalUrl
    //console.log("in app use-------------------------------------   "+ req.session.returnTo)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.on('session', (session) => {
    console.log('New session created#######################################', session.id);
  });

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})