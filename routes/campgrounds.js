const express=require('express');
const router=express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const ExpressError = require('../utils/ExpressError');
const campground = require('../models/campground');



router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.route('/')
       .get(catchAsync(campgrounds.showAllCampgrounds))
       .post(isLoggedIn,validateCampground, catchAsync (campgrounds.createCampground ))

router.route('/:id')
       .get( catchAsync(campgrounds.showCampground))
       .put(isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.updateCampground))
       .delete(isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground))
       
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

module.exports = router;