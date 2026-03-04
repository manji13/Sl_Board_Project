const express = require('express');
const router = express.Router();
const coachController = require('../Controller/coachController.js');
const multer = require('multer');

// Configure image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post('/', upload.single('image'), coachController.createCoach);
router.get('/', coachController.getCoaches);
router.get('/:id', coachController.getCoachById);
router.put('/:id', upload.single('image'), coachController.updateCoach);
router.delete('/:id', coachController.deleteCoach);

module.exports = router;