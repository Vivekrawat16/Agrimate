const express = require('express');
const router = express.Router();
const { recommendCrop, predictYield, predictDisease, chatAgent } = require('../controllers/aiController');

router.post('/recommend-crop', recommendCrop);
router.post('/predict-yield', predictYield);
router.post('/predict-disease', predictDisease);
router.post('/chat', chatAgent);

module.exports = router;
