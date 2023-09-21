const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Userschema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
    }
});

module.exports = mongoose.model('User', Userschema);