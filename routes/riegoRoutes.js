const express = require('express');
const router = express.Router();
const ConfiguracionRiego = require('../models/configuracionRiego');

// Middleware de autenticación (igual que en authRoutes.js)

// Obtener configuración de riego
router.get('/:usuarioId', authenticateToken, async (req, res) => {
    try {
        const configuracion = await ConfiguracionRiego.findOne({ usuarioId: req.params.usuarioId });
        if (!configuracion) {
          return res.status(404).json({ message: 'Configuración no encontrada' });
        }
        res.json(configuracion);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener configuración de riego', error: err.message });
      }
});

// Guardar/actualizar configuración de riego
router.post('/:usuarioId', authenticateToken, async (req, res) => {
  try {
    const { horarioRiego } = req.body; // Solo recibimos el horario de riego

    let configuracion = await ConfiguracionRiego.findOne({ usuarioId: req.params.usuarioId });
    if (!configuracion) {
      configuracion = new ConfiguracionRiego({ usuarioId: req.params.usuarioId });
    }

    configuracion.horarioRiego = horarioRiego; // Actualizamos solo el horario
    await configuracion.save();

    res.json({ message: 'Configuración de riego guardada exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al guardar configuración de riego', error: err.message });
  }
});

module.exports = router;
