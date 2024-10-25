const respuestas = require("../respuestas"); 

module.exports = {
  generarMenuPrincipal: () => respuestas.respInicio.join("\n"),
  generarSubMenu: (departamento) => {
    switch (departamento) {
      case 1: return generarSubMenu(respuestas.subMenuSistemas);
      case 2: return generarSubMenu(respuestas.subMenuTecnicos);
      case 3: return respuestas.subMenuRedes;
      default: return "Departamento no válido. Por favor, selecciona una opción válida.";
    }
  }
};

function generarSubMenu(options) {
  return options
    .map((option, index) => `${index + 1}: ${option.option}`)
    .join("\n") + "\n\n0: Volver al menú principal";
}
