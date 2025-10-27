const mongoose = require('mongoose');
// ...existing code...

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
    score: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Attempt', AttemptSchema);