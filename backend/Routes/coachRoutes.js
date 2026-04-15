const express = require('express');
const router = express.Router();
const coachController = require('../Controller/coachController.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage config: Use disk for local dev, memory for Vercel
let storage;
if (process.env.NODE_ENV === 'production') {
  // Memory storage for Vercel (serverless can't write to disk)
  storage = multer.memoryStorage();
} else {
  // Disk storage for local development
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

router.post('/', upload.single('image'), coachController.createCoach);
router.get('/', coachController.getCoaches);
router.get('/:id', coachController.getCoachById);
router.put('/:id', upload.single('image'), coachController.updateCoach);
router.delete('/:id', coachController.deleteCoach);

module.exports = router;