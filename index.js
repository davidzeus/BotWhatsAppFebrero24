const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
require("dotenv").config();
const mongoose = require("mongoose");
const Conversation = require("./models/conversation");
const ConversationModel = require("./models/conversationModel");
const { procesarMensaje } = require("./controllers/conversacion");
const express = require("express");
const app = express();

const client = new Client();
let conversations = new Map();

// Conexión a MongoDB (reemplaza con tu URI de conexión)
mongoose
  .connect("mongodb://10.10.21.48:27017/mark10", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado a MongoDB");

    client.on("qr", (qr) => {
      qrcode.generate(qr, { small: true });
    });

    client.on("ready", () => {
      console.log("¡Cliente listo!");
    });

    // Función para limpiar las conversaciones a medianoche
    function cleanConversations() {
      conversations = new Map();
      console.log("Las conversaciones han sido limpiadas.");
    }

    // Programar la limpieza a medianoche
    const now = new Date();
    const millisUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate(), 24, 0, 0, 0) -
      now;
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
        await message.reply(
          "Lo siento, ocurrió un error. Por favor, inténtalo de nuevo más tarde."
        );
      }
    });

    // Nueva ruta POST para enviar mensajes
    app.use(express.json());
    app.post("/enviarTexto", async (req, res) => {
      try {
        const { numero, mensaje } = req.body;

        if (!numero || !mensaje) {
          return res
            .status(400)
            .json({ error: "Faltan parámetros: numero y mensaje" });
        }

        const numeroFormateado = numero.replace(/\D/g, "");
        await client.sendMessage(numeroFormateado + "@c.us", mensaje);

        res.json({ mensaje: "Mensaje enviado correctamente" });
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        res.status(500).json({ error: "Error al enviar el mensaje" });
      }
    });

    // Nueva ruta POST para enviar archivos
    app.post("/enviarArchivo", async (req, res) => {
      try {
        const numero = req.numero;
        const archivo = req.files?.archivo;

        if (!numero || !archivo) {
          return res
            .status(400)
            .json({ error: "Faltan parámetros: numero y archivo" });
        }

        const numeroFormateado = numero.replace(/\D/g, "");
        const media = await new MessageMedia(
          archivo.mimetype,
          archivo.data.toString("base64"),
          archivo.name
        );
        await client.sendMessage(numeroFormateado + "@c.us", media);

        res.json({ mensaje: "Archivo enviado correctamente" });
      } catch (error) {
        console.error("Error al enviar el archivo:", error);
        res.status(500).json({ error: "Error al enviar el archivo" });
      }
    });

    // Iniciar el servidor Express.js
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });

    // Inicializa el cliente de WhatsApp
    client
      .initialize()
      .then(() => console.log("Cliente inicializado correctamente."))
      .catch((error) =>
        console.error("Error al inicializar el cliente:", error)
      );
  })
  .catch((err) => console.error("Error de conexión a MongoDB:", err));
