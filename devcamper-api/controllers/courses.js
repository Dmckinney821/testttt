
const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp')

 // Get courses
// get /api/v1/courses
// get /api/v1/bootcamps/:bootcampId/coures
// Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    if(req.params.bootcampId) {
        const courses =  await Course.find({ bootcamp: req.params.bootcampId })
    
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResults)
    }
});

 // Get single course
// get /api/v1/courses/:id
// Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description',
    });

    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    res.status(200).json({
        success: true,
        data: course
    })
});

// Add course
// get /api/v1/bootcamps/:bpptcampId/courses
// Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    

    if(!bootcamp){
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404);
    }

    const course = await Course.create(req.body);


    res.status(200).json({
        success: true,
        data: course
    })
});

// Update course
// PUT /api/v1/course/:id
// Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id)

    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: course
    })
});

// Delete course
// PUT /api/v1/courses/:id
// Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id)

    if(!course){
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    await course.remove();

    res.status(200).json({
        success: true,
        data: { }
    })
});