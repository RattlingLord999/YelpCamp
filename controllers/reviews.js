const campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview =async (req, res) => {
    const Campground = await campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    Campground.reviews.push(review);
    await review.save();
    await Campground.save();
    req.flash('success', 'Successfully submitted your review!')
    res.redirect(`/campgrounds/${Campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!')
    res.redirect(`/campgrounds/${id}`);
}