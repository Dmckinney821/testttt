

const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
 

// Get all bootcamps
// get /api/v1/bootcamps
// Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
        const bootcamps = await Bootcamp.find();
        
        res
            .status(200)
            .json({ success: true, count: bootcamps.length, data: bootcamps})
}) 

// Get single bootcamps
// get /api/v1/bootcamps/:id
// Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp) {
        return next(
            next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
        ) 
        }
            res.status(200).json({ success: true, data: bootcamp})
   
}) 

// Create new bootcamps
// POST /api/v1/bootcamps
// Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        })
})

// Update bootcamp
// PUT /api/v1/bootcamps/:id
// Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!bootcamp) {
            return next(
                next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
            ) 
        }
        res.status(200).json({ success: true, data: bootcamp})
    
 })

// Get all bootcamps
// Delete /api/v1/bootcamps/:id
// Public
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp) {
            return next(
                next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
            ) 
        }
        res.status(200).json({ success: true, data: {}})
    })

// Get bootcamps within a radius
// Get /api/v1/bootcamps/radius/:zipcode/:distance/:unit
// Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;
    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = await loc[0].latitude;
    const lng = await loc[0].longitude;

    // calc radis using radains
    // divide distance by radius of earth
    // earth radius = 3,963 miles / 6,378 km
    const radius = distance / 3963

    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})