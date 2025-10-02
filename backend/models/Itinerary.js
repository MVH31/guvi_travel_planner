const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  tripTitle: {
    type: String,
    required: true,
    trim: true
  },
  summary: {
    type: String,
    required: true,
    trim: true
  },
  dailyPlan: {
    type: Array,
    required: true,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;