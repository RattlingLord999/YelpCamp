const express=require('express')
const app=express()
const path=require('path')
const mongoose=require('mongoose')
const camp=require('./models/campground')
const methodOverride=require('method-override')
const campground = require('./models/campground')
const ejsMate=require('ejs-mate')
const catchAsync=require('./utils/catchAsync')
const ExpressError=require('./utils/ExpressError')
const { campgroundSchema } = require('./schemas.js');
const joi=require('joi')
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
app.set('views',path.join(__dirname,'views'))
app.listen('3000',()=>{
console.log("Serving from the port 3000...")
})
app.get('/',(req,res)=>
{
res.render('home')


})

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.post('/campgrounds',validateCampground, catchAsync (async (req,res)=>
{


const camps=await new campground(req.body.campground)
await camps.save()
console.log("It is created succesfully ")
res.redirect(`/campgrounds/${camps._id}`);


} )
)


app.get('/campgrounds/new',  (req,res)=>
{



res.render('campgrounds/new')


}

)
app.get('/campgrounds/:id', catchAsync(async (req,res)=>
{


const camps=await campground.findById(req.params.id)
res.render('campgrounds/show',{camps})


}
)

)

app.get('/campgrounds', catchAsync(async (req,res)=>
{


const camps=await campground.find({})
res.render('campgrounds/index',{camps})


})

)
app.get('/campgrounds/:id/edit',catchAsync( async(req,res)=>
{
    const camps=await campground.findById(req.params.id)
    res.render('campgrounds/edit',{camps})

})
)


app.put('/campgrounds/:id',validateCampground,catchAsync(async(req,res)=>
{

const {id}=req.params;
const camp=await campground.findByIdAndUpdate(id,{...req.body.campground })
res.redirect(`/campgrounds/`+req.params.id)



}))
app.delete('/campgrounds/:id', catchAsync(async(req,res)=>
{

    const {id}=req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')




}))
app.all('*',(req,res,next)=>
{
next(new ExpressError("404 PAGE NOT FOUND",404))


})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

   




