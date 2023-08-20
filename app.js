const express=require('express')
const app=express()
const path=require('path')
const mongoose=require('mongoose')
const methodOverride=require('method-override')
const ejsMate=require('ejs-mate')
const ExpressError=require('./utils/ExpressError')
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const session = require('express-session');
const flash = require('connect-flash');



app.engine('ejs',ejsMate)
mongoose.connect('mongodb://0.0.0.0:27017/yelp-camp');
const verify=mongoose.connection;
verify.on('error',console.error.bind(console,'connection error :'));
verify.once('open',()=>
{
    console.log("Connection Succesfull there u go")
})
app.use(methodOverride('_method'));
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')))
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.set('views',path.join(__dirname,'views'))
app.listen('3000',()=>{
console.log("Serving from the port 3000...")
})
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.get('/',(req,res)=>
{
res.render('home')


})

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)







app.all('*',(req,res,next)=>
{
next(new ExpressError("404 PAGE NOT FOUND",404))


})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

   




