const express = require('express');
const router = express.Router();

const { reloadEvent } = require('../controllers/reload-events-controllers');

router.route('/reload').get(reloadEvent);

module.exports = router;