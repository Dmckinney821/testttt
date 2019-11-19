
const express = require('express')
const { 
    getBootcamp, 
    getBootcamps, 
    deleteBootcamp, 
    updateBootcamp, 
    createBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');


const Bootcamp = require('../models/Bootcamp')
const advancedResults = require('../middleware/advancedResults')

// include other resouce routers
const courseRouter = require('./courses')


const router = express.Router()

// re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

router.route('/:id/photo').put(bootcampPhotoUpload)

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(createBootcamp);


router.route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);


module.exports = router