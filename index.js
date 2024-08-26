const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
require("dotenv").config();
const mongoose = require('mongoose');
const Conversation = require("./models/conversation");
const ConversationModel = require('./models/conversationModel'); 
const { procesarMensaje } = require("./controllers/conversacion");

const client = new Client();
let conversations = new Map();

// Conexión a MongoDB (reemplaza con tu URI de conexión)
mongoose.connect('mongodb://10.10.21.48:27017/mark10', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conectado a MongoDB');

    client.on("qr", (qr) => {
      qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
      console.log("¡Cliente listo!");
    });

    // Función para limpiar las conversaciones a medianoche
    function cleanConversations() {
      conversations = new Map(); // Limpiar el mapa de conversaciones
      console.log("Las conversaciones han sido limpiadas.");
    }

    // Programar la limpieza a medianoche
    const now = new Date();
    const millisUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 0, 0, 0) - now;
    setTimeout(cleanConversations, millisUntilMidnight);

    client.on("message", async (message) => {
      try {
        const phoneNumber = message.from.replace(/\D/g, "");
        let conversation = conversations.get(phoneNumber);
        if (!conversation) {
          conversation = new Conversation(phoneNumber);
          conversations.set(phoneNumber, conversation);
        }

        await procesarMensaje(message, conversation, client); 
      } catch (error) {
        console.error("Error al procesar el mensaje:", error);
        await message.reply("Lo siento, ocurrió un error. Por favor, inténtalo de nuevo más tarde."); 
      }
    });

    // Inicializa el cliente de WhatsApp después de conectarte a la base de datos
    client.initialize()
        .then(() => console.log("Cliente inicializado correctamente."))
        .catch((error) => console.error("Error al inicializar el cliente:", error));

})
.catch(err => console.error('Error de conexión a MongoDB:', err));