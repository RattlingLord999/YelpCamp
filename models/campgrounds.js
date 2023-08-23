const mongoose=require('mongoose');
const Review = require('./reviews')

const User=require('../models/users')
const Schema=mongoose.Schema;

const imageSchema=new Schema({
    url:String,
    filename:String,
    //image:String,

})

imageSchema.virtual('thumbnail').get(function()

   {
    return this.url.replace('/upload','/upload/w_200')
   })


   


const campgroundSchema=new Schema({
    title:String,
    //image:String,
    images:[imageSchema],
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:User
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref: Review
    }]
        
    
})
//since we want whenever a campground is deleted all the associated reviews should also get deleted
//we will write a function that executes after every campground function call of findOneAndDelete
//it find all the associated revies using id and deletes them
//if a campground is delelted doc will contain the data of that campground

campgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc)
    {
        await Review.deleteMany({
            _id:{
                $in:doc.reviews

            }
        })
    }
})

module.exports=mongoose.model('Campground',campgroundSchema)
