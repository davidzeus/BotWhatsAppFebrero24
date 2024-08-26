const { 
  generarMenuPrincipal,
  generarSubMenu,
  generarRespuestaSubMenu
} = require("../views/mensajes");
const respuestas = require("../respuestas"); 
const ConversationModel = require('../models/conversationModel'); 

async function procesarMensaje(message, conversation) {
  const selectedOption = parseInt(message.body);

  // Declarar conversationDB aquí, al inicio de la función
  let conversationDB; 

  // Guardar el mensaje del usuario en la base de datos
  try {
    conversationDB = await ConversationModel.findOne({ phoneNumber: conversation.phoneNumber });
    if (!conversationDB) {
      conversationDB = new ConversationModel({ phoneNumber: conversation.phoneNumber, messages: [] });
    }
    conversationDB.messages.push({ role: 'user', content: message.body });
    await conversationDB.save();
  } catch (err) {
    console.error('Error al guardar el mensaje del usuario:', err);
  }

  if (message.body === "0") { // Volver al menú principal
    conversation.step = 0;
    conversation.departamento = null; 
    const respuesta = generarMenuPrincipal();
    await message.reply(respuesta);

    // Guardar la respuesta del bot en la base de datos
    try {
      conversationDB.messages.push({ role: 'bot', content: respuesta });
      await conversationDB.save();
    } catch (err) {
      console.error('Error al guardar la respuesta del bot:', err);
    }

    return;
  }

  switch (conversation.step) {
    case 0: // Menú principal
      const menuPrincipal = generarMenuPrincipal();
      await message.reply(menuPrincipal);
      conversation.step++;

      // Guardar la respuesta del bot en la base de datos
      try {
        conversationDB.messages.push({ role: 'bot', content: menuPrincipal });
        await conversationDB.save();
      } catch (err) {
        console.error('Error al guardar la respuesta del bot:', err);
      }

      break;
    case 1: // Selección de departamento
      if (selectedOption >= 1 && selectedOption <= 4) {
        conversation.departamento = selectedOption;
        const subMenu = generarSubMenu(selectedOption);
        await message.reply(subMenu);
        conversation.step++;

        // Guardar la respuesta del bot en la base de datos
        try {
          conversationDB.messages.push({ role: 'bot', content: subMenu });
          await conversationDB.save();
        } catch (err) {
          console.error('Error al guardar la respuesta del bot:', err);
        }

      } else {
        await message.reply("Por favor, selecciona una opción válida.");
      }
      break;
    case 2: // Selección de opción dentro del submenú
      const respuestaSubMenu = generarRespuestaSubMenu(conversation.departamento, selectedOption);
      await message.reply(respuestaSubMenu + "\n\n0: Volver al menú principal");

      // Guardar la respuesta del bot en la base de datos
      try {
        conversationDB.messages.push({ role: 'bot', content: respuestaSubMenu + "\n\n0: Volver al menú principal" });
        await conversationDB.save();
      } catch (err) {
        console.error('Error al guardar la respuesta del bot:', err);
      }

      if (conversation.departamento === 4) { // Secretaria -> no tiene submenú, vuelve al inicio
        conversation.step = 0;
        conversation.departamento = null;
      } 
      break;
    default:
      const respuestaDefault = "No entendí tu solicitud. ¿En qué más puedo ayudarte?";
      await message.reply(respuestaDefault);
      conversation.step = 0;
      conversation.departamento = null;

      // Guardar la respuesta del bot en la base de datos
      try {
        conversationDB.messages.push({ role: 'bot', content: respuestaDefault });
        await conversationDB.save();
      } catch (err) {
        console.error('Error al guardar la respuesta del bot:', err);
      }
  }
}

module.exports = { procesarMensaje };