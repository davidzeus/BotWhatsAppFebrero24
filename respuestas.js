const respuestas = {
    respInicio: [
      "👋 ¡Hola! Bienvenido al bot de la Dirección de informática \n" + 
      "Primero selecciona el area que necesites. \n" +
      "*Selecciona el área:* \n \n" +
      "1: 👨‍💻 Departamento de Sistemas (Portal, HC, Camas, etc)\n \n" +
      "2: 🖥️ Departamento Soporte Técnico (CPU, Impresoras, etc.)\n \n" +
      "3: 🌎 Departamento de Redes (Internet, Wifi, etc.)\n \n" +
      "0: Volver al menú principal"
    ],
    
    // Submenú para el Departamento de Sistemas
    subMenuSistemas: [
      {
        option: "*Nuevo Usuario*",
        response: "Enviar Email a sistemas@clinicas.uba.ar \n" +
          "Adjuntando Nota autorizada por el Jefe/a del Servicio y debe contener los siguientes datos:\n" +
          "* Apellido y Nombre del usuario \n" +
          "* Legajo y DNI \n" +
          "* Matrícula Profesional \n" +
          "* Mail Personal \n" +
          "* Indicar sistema (HC, Camas, MultiStock, etc)"
      },
      {
        option: "*Blanqueo de clave*",
        response: "Por favor, indicanos: \n" +
          "* Legajo y/o DNI \n" +
          "* Email personal (donde te llegará la nueva clave). \n" +
          "* Indicar Sistema (HC, Camas, Farmacia) \n" +
          "En unos minutos recibirás la clave a tu email."
      },
      {
        option: "*Baja Usuario*",
        response: "Enviar Email a sistemas@clinicas.uba.ar. \n" +
          "Adjuntando Nota solicitando la baja especificando los datos del usuario, firmada por el Jefe/a del Servicio."
      },
      {
        option: "*Usuario Portal web*",
        response: "Si al entrar al portal sólo visualiza 'Mis Turnos' y 'Sacar Turno',\n" +
          "Significa que no tiene el perfil del personal del hospital. \n" +
          "Debe ir a MI PERFIL, AJUSTES, y en la sección inferior indicar que es PERSONAL DEL HOSPITAL y completar los datos faltantes."
      },
      {
        option: "*No tengo Sistema*",
        response: "* Indicar Sistema \n" +
          "* Inconveniente \n" +
          "* Realizar de ser necesario una Captura de Pantalla \n" +
          "A la brevedad, nuestro personal se estará comunicando para despejar dudas o informar si el inconveniente fue resuelto."
      },
      {
        option: "*Solicitud de Modificaciones en el Sistema*",
        response: "Enviar Email a sistemas@clinicas.uba.ar \n" +
          "* Sistema \n" +
          "* Requerimientos \n" +
          "* Un email y teléfono de contacto \n"
      }
    ],
  
    // Submenú para el Departamento de Soporte Técnico
    subMenuTecnicos: [
      {
        option: " *Solicitar asistencia remota* ",
        response: "Verifique si tiene instalado el programa VNC, e indique los números que le muestra en la barra de tareas (Icono celeste con un ojito en el medio) \n" +
          "Ejemplo: 10.10.x.x"
      },
      {
        option: " *Solicitar asistencia técnica para Impresora* ",
        response: "Verifique que esté conectada a la corriente y reinicie el equipo donde está conectada la impresora.\n" +
          "Si el problema persiste, indique los números del VNC (Icono celeste con un ojito en la barra de tareas)."
      },
      {
        option: " *Cambiar la configuración del proxy en Chrome* ",
        response: "Abra Chrome y seleccione Configuración. Desplácese hacia abajo hasta Sistema y haga clic en 'Abrir configuración de proxy'. Introduzca:\n" +
          "Servidor HTTP: 10.10.15.6 \n" +
          "Puerto: 8080"
      },
      {
        option: "*Hablar con un técnico*",
        response: "Aguarde y será atendido por un técnico."
      }
    ],
  
    // Submenú para el Departamento de Redes (temporalmente no disponible)
    subMenuRedes: [
      "⚠️ *ATENCIÓN: *⚠️ \n" +
      "Este servicio aún no está disponible. \n" +
      "Para más información, puede comunicarse al interno 8015."
    ]
  };
  
  module.exports = respuestas;
  