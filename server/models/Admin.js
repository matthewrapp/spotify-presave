var mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    token: { type: String, required: true }
});

module.exports = mongoose.model('Admin', adminSchema);