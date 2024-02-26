// Opciones de respuesta inicio de converzación
const respInicio = [
  "👋 ¡Hola! ¿En qué puedo ayudarte?",
  "*Selecciona con que area deseas conversar:*",
  "1: 🌎 Departamento de Redes (Wifi, Proxys, etc)",
  "2: 🖥️ Departamento Soporte Tecnico (CPU, Impresoras, etc)",
  "3: 👨‍💻 Departamento de Sistemas (Hc, Camas, etc)",
  "4: 🧑‍💼 Dirección de Informática (Secretaria)",
];

/* SubMenues */
// Sistemas
const subMenuSistemas = [
    {
        option: "Olvide mi clave de acceso",
        response: "Deberás solicitar una nueva clave de acceso enviando un email a Sistemas@clinicas.uba.ar indicando:\n" +
            "- Sistema (HC, Camas, MultiStock, etc)\n" +
            "- Nombre y Apellido\n" +
            "- Legajo / DNI\n" +
            "Recibirás como respuesta una nueva clave de acceso."
    },
    {
        option: "No tengo usuario del sistema",
        response: "Deberas solicitar la creación de usuario por nota, firmada por el jefe de servicio y enviarla adjunta al email: Sistemas@clinicas.uba.ar \n" +
        "con los siguientes datos:\n" +
        "- Sistema (HC, Camas, MultiStock, etc)\n" +
        "- Nombre y Apellido\n" +
        "- Legajo / DNI\n" +
        " - Email personal\n" +
        "Si es personal médico, numero de matricula"
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
    },
    {
        option: "¿Alejandro se la come?",
        response: "Por supuesto que si señores 😂"
    }
];

module.exports = {
  respInicio,
  subMenuSistemas,
  subMenuTecnicos,
  subMenuRedes
};
