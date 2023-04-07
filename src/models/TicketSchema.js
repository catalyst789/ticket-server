const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    seatNumber: Number,
    rowNumber: Number,
}, {timestamps: true})

module.exports = mongoose.model('ticket', TicketSchema);