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
      conversationDB.messages.push({ role: 'user', content: message.body });
      await conversationDB.save();

      if (message.body === "0") { // Volver al menú principal
          conversation.step = 0;
          conversation.departamento = null; 
          respuesta = await generarMenuPrincipal(); 
      } else if (conversation.step === 2 && conversation.departamento === 3 && selectedOption === 1) { 
          // Opción "Olvidé mi clave de acceso" en el submenú de Sistemas
          conversation.step = 3; // Nuevo paso para recopilar datos
          respuesta = "¿A qué sistema intentas acceder (HC, Camas, MultiStock, Parte Diario)?";
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
                  respuesta += "\n\n0: Volver al menú principal";

                  if (conversation.departamento === 4) { // Si es el departamento de Secretaría, vuelve al inicio
                      conversation.step = 0;
                      conversation.departamento = null;
                  } 
                  break;
              case 3: // Recopilación de datos para recuperación de clave
                  if (!conversation.claveAccesoData) {
                      conversation.claveAccesoData = { phoneNumber: conversation.phoneNumber };
                  }

                  if (!conversation.claveAccesoData.sistema) {
                      conversation.claveAccesoData.sistema = message.body;
                      respuesta = "Por favor, ingresa tu dirección de correo electrónico:";
                  } else if (!conversation.claveAccesoData.email) {
                      conversation.claveAccesoData.email = message.body;
                      respuesta = "Por favor, ingresa tu número de legajo:";
                  } else if (!conversation.claveAccesoData.legajo) {
                      conversation.claveAccesoData.legajo = message.body;
                      respuesta = "Gracias por la información. Procesaremos tu solicitud y te enviaremos una nueva clave de acceso a tu correo electrónico.";

                      // Guardar los datos de recuperación de clave en la base de datos
                      try {
                          const nuevaClaveAcceso = new ClaveAcceso(conversation.claveAccesoData);
                          await nuevaClaveAcceso.save();

                          // Enviar mensaje a un número específico (reemplaza con el número real)
                          const numeroDestino = "5491171011639@c.us"; // Asegúrate de incluir el código de país
                          const mensajeParaDestino = `Solicitud de nueva clave de acceso:\nSistema: ${conversation.claveAccesoData.sistema}\nEmail: ${conversation.claveAccesoData.email}\nLegajo: ${conversation.claveAccesoData.legajo}`;
                          await client.sendMessage(numeroDestino, mensajeParaDestino);

                      } catch (err) {
                          console.error('Error al guardar los datos de recuperación de clave:', err);
                          respuesta = "Lo siento, ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.";
                      }

                      conversation.step = 0; 
                      conversation.departamento = null;
                      conversation.claveAccesoData = null; 
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
      conversationDB.messages.push({ role: 'bot', content: respuesta });
      await conversationDB.save();

  } catch (err) {
      console.error('Error al procesar el mensaje o interactuar con la base de datos:', err);
      await message.reply("Lo siento, ocurrió un error. Por favor, inténtalo de nuevo más tarde."); 
  }
}

module.exports = { procesarMensaje };
