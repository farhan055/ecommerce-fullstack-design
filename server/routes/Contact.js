const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');

// Handles POST to /api/contact/
router.post('/', submitContact);

module.exports = router;