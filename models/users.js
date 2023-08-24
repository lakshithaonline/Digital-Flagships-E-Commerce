const mongoose = require('mongoose');
const userScema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    Category: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    Image: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('User', userScema);