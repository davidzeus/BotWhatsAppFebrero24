const { 
    generarMenuPrincipal,
    generarSubMenu,
    generarRespuestaSubMenu
  } = require("../views/mensajes");
  const respuestas = require("../respuestas"); 
  const { Conversation, ClaveAcceso } = require('../models/conversationModel'); 
  
  async function procesarMensaje(message, conversation, client) {
    const selectedOption = parseInt(message.body);
  
    let conversationDB;
    let respuesta;
  
    try {
      // Buscar o crear la conversación en la base de datos
      conversationDB = await Conversation.findOne({ phoneNumber: conversation.phoneNumber });
      if (!conversationDB) {
        conversationDB = new Conversation({ phoneNumber: conversation.phoneNumber, messages: [] });
      }
  
      // Guardar el mensaje del usuario
      /* conversationDB.messages.push({ role: 'user', content: message.body });
      await conversationDB.save(); */
  
      if (message.body === "0") { // Volver al menú principal
        conversation.step = 0;
        conversation.departamento = null;
        respuesta = await generarMenuPrincipal();
      /* } else if (conversation.step === 2 && conversation.departamento === 3 && selectedOption === 1) {
        // Opción "Olvidé mi clave de acceso" en el submenú de Sistemas
        conversation.step = 3; // Nuevo paso para recopilar datos
        respuesta = "¿A qué sistema intentas acceder (HC, Camas, MultiStock, Parte Diario)?"; */
      } else {
        switch (conversation.step) {
          case 0: // Menú principal
            respuesta = await generarMenuPrincipal();
            conversation.step++;
            break;
          case 1: // Selección de departamento
            if (selectedOption >= 1 && selectedOption <= 4) { // Ajusta el número de departamentos si es necesario
              conversation.departamento = selectedOption;
              respuesta = await generarSubMenu(selectedOption);
              conversation.step++;
            } else {
              respuesta = "Por favor, selecciona una opción válida.";
            }
            break;
          case 2: // Selección de opción dentro del submenú
            respuesta = await generarRespuestaSubMenu(conversation.departamento, selectedOption);
  
            if (respuesta === "__MANUAL_INTERACTION__") {
              await message.reply(respuestas.subMenuSistemas[selectedOption - 1]?.response);
  
              // Reiniciar el temporizador de inactividad
              if (conversation.inactivityTimeout) {
                clearTimeout(conversation.inactivityTimeout);
              }
  
              // Establecer un nuevo temporizador de inactividad
              conversation.inactivityTimeout = setTimeout(async () => {
                conversation.step = 0;
                conversation.departamento = null;
                await message.reply("Ha pasado el limite de inactividad. ¿En qué más puedo ayudarte?");
              }, 2 * 60 * 1000); // 2 minutos en milisegundos
  
              return;
            } else {
              respuesta += "\n\n0: Volver al menú principal";
  
              // Reiniciar el temporizador de inactividad si el usuario interactúa
              if (conversation.inactivityTimeout) {
                clearTimeout(conversation.inactivityTimeout);
                conversation.inactivityTimeout = setTimeout(async () => {
                  conversation.step = 0;
                  conversation.departamento = null;
                  await message.reply("Han pasado 2 minutos de inactividad. ¿En qué más puedo ayudarte?");
                }, 2 * 60 * 1000);
              }
            }
  
            if (conversation.departamento === 4) { // Si es el departamento de Secretaría, vuelve al inicio
              conversation.step = 0;
              conversation.departamento = null;
            }
            break;
  
          default:
            respuesta = "No entendí tu solicitud. ¿En qué más puedo ayudarte?";
            conversation.step = 0;
            conversation.departamento = null;
        }
      }
  
      // Enviar la respuesta al usuario
      await message.reply(respuesta);
  
      // Guardar la respuesta del bot
      /* conversationDB.messages.push({ role: 'bot', content: respuesta });
      await conversationDB.save(); */
  
    } catch (err) {
      console.error('Error al procesar el mensaje o interactuar con la base de datos:', err);
      await message.reply("Lo siento, ocurrió un error. Por favor, inténtalo de nuevo más tarde.");
    }
  }
  
  module.exports = { procesarMensaje };