const campground = require('../models/campground');



module.exports.renderNewForm = (req, res) => {
    {
        res.render('campgrounds/new')
    }
        
}

module.exports.createCampground = async (req,res)=>
{


const camps=await new campground(req.body.campground)
camps.author=req.user._id;
await camps.save()
console.log("It is created succesfully ")
req.flash('success', 'Successfully made a new campground!');
res.redirect(`/campgrounds/${camps._id}`);


}

module.exports.showCampground = async (req, res,) => {
    const camps = await campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camps) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camps });
}
module.exports.renderEditForm = async(req,res)=>
{
    const camps=await campground.findById(req.params.id)
    if (!camps) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{camps})

}

module.exports.updateCampground = async(req,res)=>
{
const {id}=req.params;
const camp=await campground.findByIdAndUpdate(id,{...req.body.campground })
req.flash('success', 'Successfully updated campground!')
res.redirect(`/campgrounds/`+req.params.id)
}

module.exports.deleteCampground = async(req,res)=>
{
    const {id}=req.params;
    await campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds')
}
module.exports.showAllCampgrounds=async (req,res)=>
{
const camps=await campground.find({})
res.render('campgrounds/index',{camps})

}