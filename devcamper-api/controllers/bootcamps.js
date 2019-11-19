

const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
 

// Get all bootcamps
// get /api/v1/bootcamps
// Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
        
    let query;

    // copy req.query
    const reqQuery = { ...req.query }
   
// fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param])

    

    // create query sgtring
    let queryStr = JSON.stringify(reqQuery);
    
    // create operators 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // finding resouce
    query = Bootcamp.find(JSON.parse(queryStr)).populate('courses')
   
    // Select fields
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createAt');
    }

    // pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);
    

    // executing query
    const bootcamps = await query;

    // Pagination result
    const pagination = {};

    if(endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if(startIndex > 0) {
        pagination.prev = {
            page: page -1,
            limit
        }
    }

        
        res
            .status(200)
            .json({ success: true, count: bootcamps.length, pagination, data: bootcamps})
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