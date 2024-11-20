
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        default: 'What is the name of your childhood friend'
    },
    correct_answer: {
        type: String,
        default:"harmony"
    }
})

module.exports = mongoose.model('Question', questionSchema);
