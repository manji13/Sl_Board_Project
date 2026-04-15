const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  name: String,
  phone: String,
  nic: String,  // ✅ VITAL: Tells MongoDB to save the NIC
  age: String,
  gender: String,
  employment: String,
  designation: [String], 
  district: String,
  zone: String,
  qualifications: [String], 
  playingExperience: String,
  coachingExperience: String,
  licenseNumber: String,
  image: String
}, { timestamps: true });

module.exports = mongoose.model('Coach', coachSchema);