const mongoose = require('mongoose');

const configuracionRiegoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  horarioRiego: [
    {
      dia: { type: Number, required: true }, // 0: Domingo, 1: Lunes, ..., 6: Sábado
      hora: { type: String, required: true }, // Formato HH:mm (ejemplo: "08:30")
      duracion: { type: Number, required: true }, // Duración del riego en minutos
    },
  ],
});

module.exports = mongoose.model('ConfiguracionRiego', configuracionRiegoSchema);
