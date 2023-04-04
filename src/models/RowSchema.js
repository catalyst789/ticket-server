const mongoose = require('mongoose');

const RowSchema = new mongoose.Schema({
    rowNumber: Number,
    bookedSeats: []
}, {timestamps: true});

module.exports = mongoose.model('row', RowSchema);