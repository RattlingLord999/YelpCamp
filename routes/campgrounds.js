const express=require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campground');

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.post('/',isLoggedIn,validateCampground, catchAsync (async (req,res)=>
{


const camps=await new campground(req.body.campground)
await camps.save()
console.log("It is created succesfully ")
req.flash('success', 'Successfully made a new campground!');
res.redirect(`/campgrounds/${camps._id}`);


} )
)

router.get('/new',isLoggedIn,  (req,res)=>
{



res.render('campgrounds/new')


}

)
router.get('/:id', catchAsync(async (req, res,) => {
    const camps= await campground.findById(req.params.id).populate('reviews');
    if (!camps) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camps });
}));

router.get('/', catchAsync(async (req,res)=>
{


const camps=await campground.find({})
res.render('campgrounds/index',{camps})


})

)
router.get('/:id/edit',isLoggedIn,catchAsync( async(req,res)=>
{
    const camps=await campground.findById(req.params.id)
    if (!camps) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{camps})

})
)


router.put('/:id',isLoggedIn,validateCampground,catchAsync(async(req,res)=>
{

const {id}=req.params;
const camp=await campground.findByIdAndUpdate(id,{...req.body.campground })
req.flash('success', 'Successfully updated campground!')
res.redirect(`/campgrounds/`+req.params.id)



}))
router.delete('/:id', catchAsync(async(req,res)=>
{

    const {id}=req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')




}))
module.exports = router;