const express = require('express');
const router = express.Router();
const Alerta = require('../models/alerta');

// Middleware de autenticación 
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401); 
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); 
      }
      req.user = user;
      next();
    });
  }
  

// Guardar alerta
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { usuarioId, fechaHora, sensor, tipoAlerta, mq2, dht22Temperatura, dht22Humedad, yl69Yl38, ldr } = req.body;

    const alerta = new Alerta({ 
      usuarioId, 
      fechaHora, 
      sensor, 
      tipoAlerta,
      mq2, 
      dht22Temperatura, 
      dht22Humedad, 
      yl69Yl38, 
      ldr 
    });
    await alerta.save();

    res.status(201).json({ message: 'Alerta guardada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al guardar alerta', error: err.message });
  }
});

// Obtener alertas de un usuario
router.get('/:usuarioId', authenticateToken, async (req, res) => {
  try {
    const alertas = await Alerta.find({ usuarioId: req.params.usuarioId });
    res.json(alertas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener alertas', error: err.message });
  }
});

module.exports = router;
