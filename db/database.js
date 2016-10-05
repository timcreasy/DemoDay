const mongoose = require('mongoose');

mongoose.Promise = Promise;

const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://10.0.0.44:27017/DemoDay';

module.exports.connect = mongoose.connect(MONGODB_URL);