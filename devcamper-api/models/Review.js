

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

// static method to get average rating and save
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
    const obj = await this.aggregate([
      {
        $match: { bootcamp: bootcampId }
      },
      {
        $group: {
          _id: '$bootcamp',
          averageRating: { $avg: '$rating' }
        }
      }
    ]);
  
    try {
      await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
        averageRating: obj[0].averageRating
      });
    } catch (err) {
      console.error(err);
    }
  };
  
  // Call getAverageCost after save
  ReviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.bootcamp);
  });
  
  // Call getAverageCost before remove
  ReviewSchema.pre('remove', function() {
    this.constructor.getAverageRating(this.bootcamp);
  });


module.exports = mongoose.model('Review', ReviewSchema)