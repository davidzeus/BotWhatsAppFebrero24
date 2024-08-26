const { 
    generarMenuPrincipal,
    generarSubMenu,
    generarRespuestaSubMenu
  } = require("../views/mensajes");
  const respuestas = require("../respuestas"); 
  
  async function procesarMensaje(message, conversation) {
    const selectedOption = parseInt(message.body);
  
    if (message.body === "0") { // Volver al menú principal
      conversation.step = 0;
      conversation.departamento = null; 
      await message.reply(generarMenuPrincipal());
      return;
    }
  
    switch (conversation.step) {
      case 0: // Menú principal
        await message.reply(generarMenuPrincipal());
        conversation.step++;
        break;
      case 1: // Selección de departamento
        if (selectedOption >= 1 && selectedOption <= 4) {
          conversation.departamento = selectedOption;
          await message.reply(generarSubMenu(selectedOption));
          conversation.step++;
        } else {
          await message.reply("Por favor, selecciona una opción válida.");
        }
        break;
      case 2: // Selección de opción dentro del submenú
        const respuestaSubMenu = generarRespuestaSubMenu(conversation.departamento, selectedOption);
        await message.reply(respuestaSubMenu + "\n\n0: Volver al menú principal");
  
        if (conversation.departamento === 4) { // Secretaria -> no tiene submenú, vuelve al inicio
          conversation.step = 0;
          conversation.departamento = null;
        } 
        break;
      default:
        await message.reply("No entendí tu solicitud. ¿En qué más puedo ayudarte?");
        conversation.step = 0;
        conversation.departamento = null;
    }
  }
  
  module.exports = { procesarMensaje };