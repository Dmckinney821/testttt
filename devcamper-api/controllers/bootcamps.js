

const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
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