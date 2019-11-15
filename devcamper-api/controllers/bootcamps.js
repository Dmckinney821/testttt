
const Bootcamp = require('../models/Bootcamp');


// Get all bootcamps
// get /api/v1/bootcamps
// Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps})
    } catch (err) {
        res.status(400).json({ success: false})
    }

} 

// Get single bootcamps
// get /api/v1/bootcamps/:id
// Public
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp) {
            return res.status(400).json({ success: false})
        }
            res.status(200).json({ success: true, data: bootcamp})
    } catch 
        {
            res.status(400).json({ success: false})
    }
} 

// Create new bootcamps
// POST /api/v1/bootcamps
// Private
exports.createBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp
        })
    } catch (err) {
        res.status(400).json({ success: false})
    }
} 

// Update bootcamp
// PUT /api/v1/bootcamps/:id
// Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!bootcamp) {
            return res.status(400).json({ success: false})
        }
        res.status(200).json({ success: true, data: bootcamp})
    } catch (err) {
        res.status(400).json({ success: false})
    }
 
} 

// Get all bootcamps
// Delete /api/v1/bootcamps/:id
// Public
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if(!bootcamp) {
            return res.status(400).json({ success: false})
        }
        res.status(200).json({ success: true, data: {}})
    } catch (err) {
        res.status(400).json({ success: false})
    }
 
} 