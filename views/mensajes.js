const respuestas = require("../respuestas"); // Asegúrate de que la ruta sea correcta

function generarMenuPrincipal() {
  return respuestas.respInicio.join("\n");
}

function generarSubMenu(departamento) {
  switch (departamento) {
    case 1: // Redes
      return respuestas.subMenuRedes
        .map((option, index) => `${index + 1}: ${option.option}`)
        .join("\n") + "\n\n0: Volver al menú principal";
    case 2: // Técnicos
      return respuestas.subMenuTecnicos
        .map((option, index) => `${index + 1}: ${option.option}`)
        .join("\n") + "\n\n0: Volver al menú principal";
    case 3: // Sistemas
      return respuestas.subMenuSistemas
        .map((option, index) => `${index + 1}: ${option.option}`)
        .join("\n") + "\n\n0: Volver al menú principal";
    default:
      return "Departamento no válido. Por favor, selecciona una opción válida.";
  }
}

function generarRespuestaSubMenu(departamento, opcion) {
  switch (departamento) {
    case 1: // Redes
      return respuestas.subMenuRedes[opcion - 1]?.response || "Opción no válida."; 
    case 2: // Técnicos
      return respuestas.subMenuTecnicos[opcion - 1]?.response || "Opción no válida.";
    case 3: // Sistemas
      return respuestas.subMenuSistemas[opcion - 1]?.response || "Opción no válida.";
    default:
      return "Departamento o opción no válidos.";
  }
}

module.exports = {
  generarMenuPrincipal,
  generarSubMenu,
  generarRespuestaSubMenu
};