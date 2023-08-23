const express = require('express');
const router = express.Router({ mergeParams: true });
const db=require('../connection')
const Campground = require('../models/campgrounds');


const catchAsync=require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')

const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');

const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({storage });

// just wrap the async function inside the catch async




router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))
//    .post(upload.single('image'),(req,res,next)=>{
//     console.log(req.body,req.file);
//     res.send("it worked")
//    })



router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))



module.exports = router;