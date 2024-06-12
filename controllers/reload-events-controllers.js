const path = require('path');

const reloadEvent = (req, res, next) => {
    res.status(200).json({ message: "Success" });
}

module.exports = { reloadEvent };