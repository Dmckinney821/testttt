

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc      Get all users
// @route     GET /api/v1/users
// @access    Private/admin

exports.getUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults)

  });
  
  // @desc      Get single users
// @route     GET /api/v1/users/:id
// @access    Private/admin

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, data: user})
  });

    // @desc     Create a user
// @route     POST /api/v1/users
// @access    Private/admin

exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user})
  });

      // @desc     Update a user
// @route     PUT /api/v1/users/:id
// @access    Private/admin

exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: user})
  });

        // @desc     delete a user
// @route     DELETE /api/v1/users/:id
// @access    Private/admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {}})
  });