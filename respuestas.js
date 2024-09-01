// Opciones de respuesta inicio de converzación
const respInicio = [
  "👋 ¡Hola! ¿En qué puedo ayudarte?",
  "*Selecciona el area:*",
  /* "1: 🌎 Departamento de Redes (Wifi, Proxys, etc)",
  "2: 🖥️ Departamento Soporte Tecnico (CPU, Impresoras, etc)", */
  "1: 👨‍💻 Departamento de Sistemas"
  /* "4: 🧑‍💼 Dirección de Informática (Secretaria)", */
];

/* SubMenues */
// Sistemas
const subMenuSistemas = [
    {
        option: "Nuevo Usuario",
        response: "Enviar Email a sistemas@clinicas.uba.ar \n" +
    "Adjuntando Nota autorizada por el Jefe/a del Servicio y debe contener los siguientes datos:\n" +
    "* Apellido y Nombre del usuario \n"+
    "* Legajo y DNI \n"+
    "* Matrícula Profesional \n"+
    "* Mail Personal \n"+
    "* Indicar sistema (HC, Camas, MultiStock, etc)"
    },
    {
        option: "Blanqueo de clave",
        response: "Enviar Email a sistemas@clinicas.uba.ar solicitando el blanqueo desde su mail particular. \n"
    },
    {
        option: "Baja Usuario",
        response: "Enviar Email a sistemas@clinicas.uba.ar. \n" +
        "Adjuntando Nota solicitando la baja especificando los datos del usuario, firmada por el Jefe/a del Servicio. \n"
    },
    {
        option: "Usuario Portal web - Perfil Personal del Hospital",
        response: "Si al entrar al portal sólo visualiza Mis Turnos y Sacar Turno,\n" +
        "Significa que no tiene el perfil del personal del hospital.\n" +
        "Para ello debe ir a MI PERFIL, AJUSTES,  y en la sección inferior indicar que es PERSONAL DEL HOSPITAL y completar los datos faltantes, luego se verificará el tipo de permiso correspondiente."
    },
    {
        option: "Inconvenientes con el Sistema",
        response: "* Indicar Sistema \n"+
        "* Inconveniente \n"+
        "* Realizar de ser necesario una Captura de Pantalla \n"+
        "A la brevedad nuestro personal se estará comunicado, para despejar dudas o informar si el inconveniente fue resuelto."
    },
    {
        option: "Solicitud de Modificaciones en el Sistema",
        response: "Enviar Email a sistemas@clinicas.uba.ar \n"+
        "* Sistema \n" +
        "* Requerimientos \n"+
        "* Un email y telefono de contacto \n"
    }

];

// Tecnicos
const subMenuTecnicos = [
    {
        option: "Solicitar asistencia tecnica para PC",
        response: "Verifique si tiene instalado el programa VNC, e indique los numeros que les indica \n" +
        "Ejemplo: 10.10.15.13 \n" 
    },
    {
        option: "Solicitar asistencia tecnica para Impresora",
        response: "Verifique que se encuentre conectado a la corriente correctamente \n" +
        "Reinicie el equipo donde se encuentra conectada la impresora."
    },
    {
        option: "Cambiar la configuración del proxy en Chrome",
        response: "Abre Chrome \n" +
        "Haz clic en el ícono de menú de tres puntos en la esquina superior derecha. \n" +
        "Selecciona Configuración. \n" +
        "Desplázate hacia abajo y haz clic en Avanzada \n" +
        "En la sección Sistema, haz clic en Abrir configuración de proxy. \n " +
        "Configuración manual de proxy: \n" +
        "Servidor HTTP: Introduce la dirección 10.10.15.6 \n" +
        "Puerto: Introduce el puerto 8080"
    }
];

// redes
const subMenuRedes = [
    {
        option: "¿que es tcp?",
        response: "El Protocolo de Control de Transmisión (TCP, por sus siglas en inglés) es un protocolo fundamental en la comunicación de datos a través de redes como Internet. Se encarga de establecer una conexión confiable entre dos dispositivos, garantizando la entrega segura y ordenada de la información." 
    },
    {
        option: "¿que es el cable utp?",
        response: "El cable UTP, por sus siglas en inglés -Unshielded Twisted Pair-, es un tipo de cable de red que se compone de pares de hilos de cobre trenzados entre sí."
    }
   /*  {
        option: "¿Alejandro se la come?",
        response: "Por supuesto que si señores 😂"
    } */
];

module.exports = {
  respInicio,
  subMenuSistemas,
  subMenuTecnicos,
  subMenuRedes
};
