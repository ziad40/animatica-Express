const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true,
    },
    question : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required : true,
    },
    trialAnswer: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    scoreCal: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    time: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Attempt', AttemptSchema);