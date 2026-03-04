const Coach = require('../Model/Coach.js');

exports.createCoach = async (req, res) => {
  try {
    const data = { ...req.body };
    
    // Parse the JSON stringified arrays from frontend
    if (req.body.designation) data.designation = JSON.parse(req.body.designation);
    if (req.body.qualifications) data.qualifications = JSON.parse(req.body.qualifications);
    
    if (req.file) data.image = req.file.filename;
    
    const newCoach = new Coach(data);
    await newCoach.save();
    res.status(201).json(newCoach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.status(200).json(coaches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    res.status(200).json(coach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCoach = async (req, res) => {
  try {
    const data = { ...req.body };

    // Parse the JSON stringified arrays from frontend
    if (req.body.designation) data.designation = JSON.parse(req.body.designation);
    if (req.body.qualifications) data.qualifications = JSON.parse(req.body.qualifications);

    if (req.file) data.image = req.file.filename;

    const updatedCoach = await Coach.findByIdAndUpdate(req.params.id, data, { new: true });
    res.status(200).json(updatedCoach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCoach = async (req, res) => {
  try {
    await Coach.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Coach deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};