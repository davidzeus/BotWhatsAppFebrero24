const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
require("dotenv").config();
const Conversation = require("./models/conversation");
const { procesarMensaje } = require("./controllers/conversacion");

const client = new Client();
let conversations = new Map();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("¡Cliente listo!");
});

// ... (Función cleanConversations y programación de la limpieza a medianoche)

client.on("message", async (message) => {
  try {
    const phoneNumber = message.from.replace(/\D/g, "");
    let conversation = conversations.get(phoneNumber);
    if (!conversation) {
      conversation = new Conversation(phoneNumber);
      conversations.set(phoneNumber, conversation);
    }

    await procesarMensaje(message, conversation); 
  } catch (error) {
    console.error("Error al procesar el mensaje:", error);
    await message.reply("Lo siento, ocurrió un error. Por favor, inténtalo de nuevo más tarde."); 
  }
});

client
  .initialize()
  .then(() => console.log("Cliente inicializado correctamente."))
  .catch((error) => console.error("Error al inicializar el cliente:", error));