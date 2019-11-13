

// Get all bootcamps
// get /api/v1/bootcamps
// Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Show all bootcamps'})

} 

// Get single bootcamps
// get /api/v1/bootcamps/:id
// Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Show a bootcamp'})

} 

// Create new bootcamps
// POST /api/v1/bootcamps
// Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Create a  bootcamps'})

} 

// Update bootcamp
// PUT /api/v1/bootcamps/:id
// Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Update a bootcamp'})

} 

// Get all bootcamps
// Delete /api/v1/bootcamps/:id
// Public
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, msg: 'Delete a bootcamp'})

} 