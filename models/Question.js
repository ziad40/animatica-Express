const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["fcfs"]
    },
    question: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        trim: true,
    },
    solution: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Question', QuestionSchema);