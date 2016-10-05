const mongoose = require('mongoose');

const MONGODB_URL = 'mongodb://10.0.0.44:27017/DemoDay';

module.exports.connect = mongoose.connect(MONGODB_URL);