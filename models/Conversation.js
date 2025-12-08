const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
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
    messages: {
        type: [
            {
                role: {
                    type: String,
                    enum: ['user', 'bot'],
                    required: true,
                },
                content: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            }
        ],
        default: [],
    },
});

module.exports = mongoose.model('Conversation', ConversationSchema);