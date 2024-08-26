const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    messages: [{
        role: { type: String, enum: ['user', 'bot'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;