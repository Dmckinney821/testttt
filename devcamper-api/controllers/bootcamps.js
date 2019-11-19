
const path = require('path')
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');


// Get all bootcamps
// get /api/v1/bootcamps
// Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
        res.status(200).json(res.advancedResults)
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
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp) {
            return next(
                next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404))
            ) 
        }

        bootcamp.remove();

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

// upload photo for bootcamp
// PUT /api/v1/bootcamp/:id/photo
// private
exports.bootcampPhotoUpload = asyncHandler( async ( req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if(!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        )
    }
    
    if(!req.files) {
        return next(
            new ErrorResponse(`Please upload a file`, 400))
    }
    const file = (req.files.file)

    // make sure image is a photo
    if(!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400))
    }
    // check file size
    if(file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    }

    // create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
    
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            console.error(err)
            return next(new ErrorResponse(`Problem with file upload`, 500))
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name})
        res.status(200).json({
            success: true,
            data: file.name
        })
    })
})