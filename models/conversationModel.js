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

const claveAccesoSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    sistema: { type: String, required: true },
    email: { type: String, required: true },
    legajo: { type: String, required: true }
    // Puedes agregar más campos si es necesario
});

const ClaveAcceso = mongoose.model('ClaveAcceso', claveAccesoSchema);


module.exports = { Conversation, ClaveAcceso }; 
