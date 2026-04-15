const Coach = require('../Model/Coach.js');

// Helper function to convert buffer to base64 (for Vercel)
const bufferToBase64 = (buffer) => {
  return `data:image/jpeg;base64,${buffer.toString('base64')}`;
};

// Get image value based on environment
const getImageValue = (file) => {
  if (!file) return undefined;
  if (process.env.NODE_ENV === 'production') {
    // Vercel: use base64
    return bufferToBase64(file.buffer);
  } else {
    // Local: use filename
    return file.filename;
  }
};

exports.createCoach = async (req, res) => {
  try {
    console.log('=== CREATE COACH ===');
    console.log('Received body:', req.body);
    console.log('Received file:', req.file ? 'File present' : 'No file');
    console.log('NIC value:', req.body.nic);
    
    const data = { ...req.body };
    
    // Parse JSON strings back to arrays
    if (req.body.designation) {
      try {
        data.designation = JSON.parse(req.body.designation);
      } catch (e) {
        data.designation = req.body.designation;
      }
    }
    
    if (req.body.qualifications) {
      try {
        data.qualifications = JSON.parse(req.body.qualifications);
      } catch (e) {
        data.qualifications = req.body.qualifications;
      }
    }
    
    // Handle image based on environment
    if (req.file) {
      data.image = getImageValue(req.file);
    }
    
    console.log('Final data to save (NIC):', data.nic);
    
    const newCoach = new Coach(data);
    await newCoach.save();
    console.log('✅ Coach saved with NIC:', newCoach.nic);
    res.status(201).json(newCoach);
  } catch (error) {
    console.error('Error creating coach:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCoaches = async (req, res) => {
  try {
    const coaches = await Coach.find();
    res.status(200).json(coaches);
  } catch (error) {
    console.error('Error fetching coaches:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCoachById = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    res.status(200).json(coach);
  } catch (error) {
    console.error('Error fetching coach:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCoach = async (req, res) => {
  try {
    console.log('=== UPDATE COACH ===');
    console.log('Coach ID:', req.params.id);
    console.log('Received body:', req.body);
    console.log('NIC value:', req.body.nic);
    
    const data = { ...req.body };

    // Parse JSON strings back to arrays if they exist
    if (req.body.designation) {
      try {
        data.designation = JSON.parse(req.body.designation);
      } catch (e) {
        data.designation = req.body.designation;
      }
    }
    
    if (req.body.qualifications) {
      try {
        data.qualifications = JSON.parse(req.body.qualifications);
      } catch (e) {
        data.qualifications = req.body.qualifications;
      }
    }

    // Update image if new file uploaded
    if (req.file) {
      data.image = getImageValue(req.file);
    }

    console.log('Final data to update (NIC):', data.nic);
    const updatedCoach = await Coach.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!updatedCoach) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    console.log('✅ Coach updated with NIC:', updatedCoach.nic);
    res.status(200).json(updatedCoach);
  } catch (error) {
    console.error('Error updating coach:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCoach = async (req, res) => {
  try {
    const deletedCoach = await Coach.findByIdAndDelete(req.params.id);
    if (!deletedCoach) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    res.status(200).json({ message: 'Coach deleted successfully' });
  } catch (error) {
    console.error('Error deleting coach:', error);
    res.status(500).json({ error: error.message });
  }
};