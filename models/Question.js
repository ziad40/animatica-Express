const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["fcfs"]
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        trim: true,
    },
    solution: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    metadata: {
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "easy" },
    tags: [{ type: String }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', QuestionSchema);