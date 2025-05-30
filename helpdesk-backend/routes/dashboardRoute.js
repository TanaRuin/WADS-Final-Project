const express = require('express');
const router = express.Router();
const {
  getDashboardStats
} = require('../controllers/admindashboardController');
//Get dashboard stats
router.get('/get', getDashboardStats);

module.exports = router;