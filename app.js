if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.CLOUDINARY_KEY)
console.log(process.env.CLOUDINARY_CLOUD_NAME)
console.log(process.env.CLOUDINARY_SECRET)

const mongoSanitize = require('express-mongo-sanitize');


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
const helmet = require('helmet');
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
app.use(express.static('public'))
app.use(mongoSanitize({
    replaceWith: '_'
}))

app.set('views', path.join(__dirname, 'views'))

//app.use is just a way to run a piece of code on every single req
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//tell express we r using ejs mate instead of default ejs
app.engine('ejs',ejsMate)
//static files


const sessionConfig={
    name:'session',
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
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/bootstrap/5.0.0-alpha1/js/bootstrap.min.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/bs-custom-file-input/dist/bs-custom-file-input.js",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dmfjrszjt/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
                "http://res.cloudinary.com/dmfjrszjt",
                "https://res.cloudinary.com/dmfjrszjt",
                "https://api.cloudinary.com/v1_1/dmfjrszjt",
                "https://api.cloudinary.com/v1_1/dmfjrszjt",


            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    //console.log(req.session)
    console.log(req.query)
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