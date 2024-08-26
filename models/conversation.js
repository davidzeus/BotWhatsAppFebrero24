class Conversation {
    constructor(phoneNumber) {
      this.phoneNumber = phoneNumber;
      this.step = 0; 
      this.departamento = null; // Para almacenar el departamento seleccionado
      // Puedes agregar más propiedades según las necesidades de tu bot
    }
  }
  
  module.exports = Conversation;