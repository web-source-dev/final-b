
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        default: 'Which city is known as the "Big Apple"?'
    },
    correct_answer: {
        type: String,
        default:"harmony"
    }
})

module.exports = mongoose.model('Question', questionSchema);
