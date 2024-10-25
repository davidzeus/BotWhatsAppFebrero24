const { Conversation } = require("../models/conversationModel");
const respuestas = require("../respuestas");

async function procesarMensaje(message, conversation, client) {
  const selectedOption = parseInt(message.body);
  let conversationDB;
  let respuesta;

  try {
    // Buscar o crear la conversación en la base de datos
    conversationDB = await Conversation.findOne({
      phoneNumber: conversation.phoneNumber,
    });
    if (!conversationDB) {
      conversationDB = new Conversation({
        phoneNumber: conversation.phoneNumber,
        messages: [],
      });
    }

    // Guardar el mensaje del usuario
    conversationDB.messages.push({ role: "user", content: message.body });

    // Lógica de navegación
    if (message.body === "0") {
      conversation.step = 0;
      conversation.departamento = null;
      respuesta = generarMenuPrincipal();
    } else {
      respuesta = manejarPasos(
        conversation,
        selectedOption,
        message,
        conversationDB
      );
    }

    if (respuesta) {
      await message.reply(respuesta);
      // Guardar el mensaje del bot, estableciendo manualInteraction y finalizado
      conversationDB.messages.push({
        role: "bot",
        content: respuesta,
        manualInteraction: conversation.manualInteractionMessageSaved || false,
        finalizado: false,
      });
    }

    await conversationDB.save();
  } catch (err) {
    console.error("Error al procesar el mensaje:", err);
    await message.reply(
      "Lo siento, ocurrió un error. Por favor, inténtalo de nuevo más tarde."
    );
  }
}

function manejarPasos(conversation, selectedOption, message, conversationDB, client) {
  let respuesta;
  switch (conversation.step) {
    case 0:
      respuesta = generarMenuPrincipal();
      conversation.step++;
      break;
    case 1:
      if (selectedOption >= 1 && selectedOption <= 4) {
        conversation.departamento = selectedOption;
        respuesta = generarSubMenu(selectedOption);
        conversation.step++;
      } else {
        respuesta = "Por favor, selecciona una opción válida.";
      }
      break;
    case 2:
      respuesta = manejarSubMenu(
        conversation,
        selectedOption,
        message,
        conversationDB,
        client 
      );
      break;
    default:
      respuesta = "No entendí tu solicitud. ¿En qué más puedo ayudarte?";
      conversation.step = 0;
      conversation.departamento = null;
  }
  return respuesta;
}

function manejarSubMenu(conversation, selectedOption, message, conversationDB, client) {
  let respuesta = generarRespuestaSubMenu(
    conversation.departamento,
    selectedOption
  );

  if (
    (conversation.departamento === 1 && selectedOption === 5) || // "No tengo Sistema"
    (conversation.departamento === 2 && selectedOption === 4) // "hablar con un tecnico"
  ) {
    // Obtener la hora actual
    const now = new Date();
    const currentHour = now.getHours();

    // Verificar horarios de atención
    if (
      (conversation.departamento === 1 &&
        currentHour >= 7 &&
        currentHour < 14) || // Sistemas: 7hs a 14hs
      (conversation.departamento === 2 && currentHour >= 8 && currentHour < 15) // Técnicos: 8hs a 15hs
    ) {
      respuesta =
        "*Por favor, espera. Un técnico se comunicará contigo a la brevedad.* \n" +
        "En la barra de tareas (abajo a la derecha) al lado del reloj, tenés un icono celeste con un ojito (VNC). Ponete encima con el cursor, te va a aparecer unos numero (ej. 10.10.....) decime esos numeros.";

      // Indicamos que ya se guardó el mensaje de interacción manual
      conversation.manualInteractionMessageSaved = true;

      // Manejamos la inactividad incluso en interacción manual
      //manejarInactividad(conversation, message, conversationDB, client);
    } else {
      // Mensaje fuera de horario de atención
      if (conversation.departamento === 1) {
        // Sistemas
        respuesta =
          "⌚ El horario de atención para Sistemas es de 7hs a 14hs. Por favor, intenta nuevamente dentro de ese horario.";
      } else {
        // Técnicos
        respuesta =
          "⌚ El horario de atención para hablar con un técnico es de 8hs a 15hs. Por favor, intenta nuevamente dentro de ese horario.";
      }
    }
  } else {
    respuesta += "\n\n0: Volver al menú principal";

    // NO restablecer conversation.manualInteractionMessageSaved aquí

    // Manejamos la inactividad en el flujo normal
    //manejarInactividad(conversation, message, conversationDB, client);

    if (conversation.departamento === 4) {
      conversation.step = 0;
      conversation.departamento = null;
    }
  }

  return respuesta;
}

function manejarInactividad(conversation, message, conversationDB, client) {
  clearTimeout(conversation.inactivityTimeout);

  conversation.inactivityTimeout = setTimeout(async () => {
    conversation.step = 0;
    conversation.departamento = null;

    const lastMessage =
      conversationDB.messages[conversationDB.messages.length - 1];
    if (
      lastMessage &&
      lastMessage.manualInteraction && // Verificamos si es interacción manual
      !lastMessage.finalizado // Verificamos si no está finalizado
    ) {
      // Solo enviar mensaje de seguimiento si es interacción manual y no está finalizado
      await message.reply(
        "Han pasado 15 minutos. ¿El problema fue resuelto? (si/no) 🤔"
      );

      conversation.inactivityTimeout = setTimeout(async () => {
        const resolved = await verificarSolucion(message, client);
        if (resolved) {
          lastMessage.finalizado = true;
          await message.reply(
            "Me alegra que haya sido resuelto \n." +
              "Que tengas un lindo día! 😊"
          );
        } else {
          // Si no está finalizado, NO responder automáticamente
          await message.reply("Lo siento, vuelvo a reiterar el pedido. 🙄");
          // Puedes agregar aquí lógica para notificar a un agente o sistema externo
        }
        await conversationDB.save();
      }, 15 * 60 * 1000);
    }
  }, 15 * 60 * 1000);
}

async function verificarSolucion(message, client) {
  const response = await obtenerRespuestaDelUsuario(message, client); // lógica para obtener la respuesta del usuario
  return response.toLowerCase() == "si" || response.toLowerCase() == "sí";
}
/* async function obtenerRespuestaDelUsuario(message, client) {
  return new Promise((resolve) => {
    const onMessageReceived = (incomingMessage) => {
      // Verificar que el mensaje sea del mismo usuario Y que sea posterior a la pregunta de seguimiento
      if (
        incomingMessage.from === message.from &&
        incomingMessage.timestamp > message.timestamp
      ) {
        client.removeListener("message", onMessageReceived);
        resolve(incomingMessage.body);
      }
    };

    client.on("message", onMessageReceived);
  });
} */

function generarMenuPrincipal() {
  return respuestas.respInicio.join("\n");
}

function generarSubMenu(departamento) {
  switch (departamento) {
    case 1:
      return (
        respuestas.subMenuSistemas
          .map((opt, idx) => `${idx + 1}: ${opt.option}`)
          .join("\n") + "\n\n0: Volver al menú principal"
      );
    case 2:
      return (
        respuestas.subMenuTecnicos
          .map((opt, idx) => `${idx + 1}: ${opt.option}`)
          .join("\n") + "\n\n0: Volver al menú principal"
      );
    case 3:
      return "⚠️ *ATENCION: *⚠️ \nServicio aun no disponible. \nTe podes comunicar al interno 8015\n\n0: Volver al menú principal";
    default:
      return "Departamento no válido. Por favor, selecciona una opción válida.";
  }
}

function generarRespuestaSubMenu(departamento, opcion) {
  switch (departamento) {
    case 1:
      return (
        respuestas.subMenuSistemas[opcion - 1]?.response || "Opción no válida."
      );
    case 2:
      return (
        respuestas.subMenuTecnicos[opcion - 1]?.response || "Opción no válida."
      );
    default:
      return "Departamento o opción no válidos.";
  }
}

module.exports = { procesarMensaje };
