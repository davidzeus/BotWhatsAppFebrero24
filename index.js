const { Client } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
//const { OpenAIApi } = require("openai");
require("dotenv").config();
const respuestas = require("./respuestas");
/** */
// Quito la opcion de base de datos porque no es compatible sequelize con nuestro sql 2008
//const Conversation = require("./models/conversation");
/** */
// Crear una instancia de OpenAIApi con la API key
//const openai = new OpenAIApi(process.env.OPENAI_API_KEY);

// Inicialización del cliente de WhatsApp
const client = new Client();

// Manejador para mostrar el código QR
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

// Manejador para cuando el cliente está listo
client.on("ready", () => {
  console.log("¡Cliente listo!");
});

// Objeto para almacenar el estado de la conversación por número de teléfono
let conversations = new Map();

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

// Manejador para los mensajes entrantes
client.on("message", async (message) => {
  try {
    // Limpiar el número de teléfono y obtener solo los dígitos
    const phoneNumber = message.from.replace(/\D/g, "");

    console.log("Mensaje recibido:", phoneNumber, " - " + message.body);

    // Obtener el estado de la conversación para este número de teléfono
    let conversationState = conversations.get(message.from);
    if (!conversationState) {
      // Si no hay estado de conversación para este número, inicializarlo
      conversationState = { step: 0 }; // Ejemplo: solo un estado de paso para esta conversación
      conversations.set(phoneNumber, conversationState);
    }

    // Verificar si se seleccionó la opción de volver al menú principal
    if (message.body === "0") {
      conversationState.step = 0; // Volver al menú principal
      await message.reply(respuestas.respInicio.join("\n"));
      conversations.set(phoneNumber, conversationState);
      return; // Salir de la función para evitar procesar otras lógicas
    }

    // Verificar el estado de la conversación y responder en consecuencia
    switch (conversationState.step) {
      case 0:
        // Mostrar menú principal
        await message.reply(respuestas.respInicio.join("\n"));
        conversationState.step++; // Avanzar al siguiente paso
        break;
      case 1:
        // Procesar la selección del departamento
        const selectedDepartment = parseInt(message.body);
        switch (selectedDepartment) {
          case 1:
            // Departamento de redes
            await message.reply(
              respuestas.subMenuRedes
                .map((option, index) => `${index + 1}: ${option.option}`)
                .join("\n") + "\n\n0: Volver al menú principal"
            );
            conversationState.step = 1; // Avanzar al siguiente paso (submenú de redes)
            break;
          case 2:
            // Departamento de tecnicos
            await message.reply(
              respuestas.subMenuTecnicos
                .map((option, index) => `${index + 1}: ${option.option}`)
                .join("\n") + "\n\n0: Volver al menú principal"
            );
            conversationState.step = 2; // Avanzar al siguiente paso (submenú de técnicos)
            break;
          case 3:
            // Departamento de sistemas
            await message.reply(
              respuestas.subMenuSistemas
                .map((option, index) => `${index + 1}: ${option.option}`)
                .join("\n") + "\n\n0: Volver al menú principal"
            );
            conversationState.step = 3; // Avanzar al siguiente paso (submenú de sistemas)
            break;
          case 4:
            // Departamento de secretaria
            await message.reply(respuestas.respSecretaria.join("\n"));
            break;
          default:
            // Si se selecciona una opción inválida, volver al menú principal
            await message.reply("Por favor, selecciona una opción válida.");
            conversationState.step = 0; // Volver al paso inicial
            break;
        }
        break;
      case 1:
        // Procesar la selección del submenú (para el departamento de redes)
        const selectedOptionRedes = parseInt(message.body); // Convertir a índice de array
        if (
          selectedOptionRedes > 0 &&
          selectedOptionRedes <= respuestas.subMenuRedes.length
        ) {
          await message.reply(
            respuestas.subMenuRedes[selectedOptionRedes - 1].response +
              "\n\n0: Volver al menú principal"
          );
        } else {
          // Si se selecciona una opción inválida, volver al menú principal
          await message.reply("Por favor, selecciona una opción válida.");
          conversationState.step = 0; // Volver al paso inicial
        }
        break;
      case 2:
        // Procesar la selección del submenú (para el departamento de técnicos)
        const selectedOptionTecnicos = parseInt(message.body); // Convertir a índice de array
        if (
          selectedOptionTecnicos > 0 &&
          selectedOptionTecnicos <= respuestas.subMenuTecnicos.length
        ) {
          await message.reply(
            respuestas.subMenuTecnicos[selectedOptionTecnicos - 1].response +
              "\n\n0: Volver al menú principal"
          );
        } else {
          // Si se selecciona una opción inválida, volver al menú principal
          await message.reply("Por favor, selecciona una opción válida.");
          conversationState.step = 0; // Volver al paso inicial
        }
        break;
      case 3:
        // Procesar la selección del submenú (para el departamento de sistemas)
        const selectedOptionSistemas = parseInt(message.body); // Convertir a índice de array
        if (
          selectedOptionSistemas > 0 &&
          selectedOptionSistemas <= respuestas.subMenuSistemas.length
        ) {
          await message.reply(
            respuestas.subMenuSistemas[selectedOptionSistemas - 1].response +
              "\n\n0: Volver al menú principal"
          );
        } else {
          // Si se selecciona una opción inválida, volver al menú principal
          await message.reply("Por favor, selecciona una opción válida.");
          conversationState.step = 0; // Volver al paso inicial
        }
        break;
      default:
        // Si no hay un estado de conversación válido, responder con un mensaje genérico
        await message.reply(
          "No entendí tu solicitud. ¿En qué más puedo ayudarte?"
        );
        break;
    }

    // Actualizar el estado de la conversación para este número de teléfono
    conversations.set(message.from, conversationState);
  } catch (error) {
    console.error("Error:", error);
  }
});

// Inicialización del cliente de WhatsApp
client
  .initialize()
  .then(() => console.log("Cliente inicializado correctamente."))
  .catch((error) => console.error("Error al inicializar el cliente:", error));
