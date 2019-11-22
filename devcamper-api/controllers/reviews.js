
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp')

 // Get reviews
// get /api/v1/revieqs
// get /api/v1/bootcamps/:bootcampId/reviews
// Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if(req.params.bootcampId) {
        const reviews =  await Review.find({ bootcamp: req.params.bootcampId })
    
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        })
    } else {
        res.status(200).json(res.advancedResults)
    }
});

// Get single review
// get /api/v1/reviews/:id
// Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name descrition'
    });
    if(!review) {
        return next(new ErrorResponse(`No review found wiht id ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        data: review
    })
});

// add single review
// POST /api/v1/bootcamps/:bootcampId/reviews
// Private
exports.addReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp found the id ${req.params.bootcampId}`, 404))
    }

    const review = await Review.create(req.body)

    res.status(201).json({
        success: true,
        data: review
    })
});