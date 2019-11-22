

const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a review title'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please review text']
    },
    rating: {
        type: Number,
        required: [true, 'Please add rating number between 1 & 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
  }
})

ReviewSchema.index({ bootcamp: 1, user: 1}, { unique: true })

module.exports = mongoose.model('Review', ReviewSchema)