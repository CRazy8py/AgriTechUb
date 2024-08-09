require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const riegoRoutes = require('./routes/riegoRoutes');
const alertaRoutes = require('./routes/alertaRoutes');

const app = express();
const port = process.env.PORT || 3000; // Usa el puerto definido por Glitch o 3000 si no está definido

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conexión exitosa a MongoDB Atlas'))
  .catch((err) => console.error('Error al conectar a MongoDB Atlas:', err));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/riego', riegoRoutes);
app.use('/api/alerta', alertaRoutes);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal!' });
});

// Iniciar el servidor
const listener = app.listen(port, () => {
  console.log('Tu app está escuchando en el puerto ' + listener.address().port);
});
