const mongoose = require('mongoose');

const alertaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fechaHora: { type: Date, default: Date.now, required: true },
  tipoAlerta: { type: String, required: true }, // Tipo de alerta (ej: "alta temperatura", "bajo nivel de luz", etc.)
  mq2: Number, // Valor del sensor MQ2 (gas y humo)
  dht22Temperatura: Number, 
  dht22Humedad: Number, 
  yl69Yl38: Number, // Valor de humedad del suelo
  ldr: Number, // Valor de luz ambiental
});

module.exports = mongoose.model('Alerta', alertaSchema);
