const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  name: String,
  phone: String,
  age: String,
  gender: String,
  employment: String,
  designation: [String], // Changed to Array
  district: String,
  zone: String,
  qualifications: [String], // Changed to Array
  playingExperience: String,
  coachingExperience: String,
  licenseNumber: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Coach', coachSchema);