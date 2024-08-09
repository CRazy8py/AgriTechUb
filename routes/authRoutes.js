const express = require('express');
const router = express.Router();
const User = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, last_name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya existe' });
    }

    const user = new User({ email, password, name, last_name });
    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en el inicio de sesión', error: err.message });
  }
});

// Verificación de token y obtención de datos del usuario
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { password, ...userData } = user.toObject(); // Excluye la contraseña
    res.json(userData); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo datos del usuario' });
  }
});

// Recuperación de contraseña
router.post('/recover', async (req, res) => {
  const { email, date } = req.body; 

  try {
      const user = await User.findOne({ email, date });

      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado o fecha de nacimiento incorrecta' });
      }

      return res.json({ message: 'User found' }); 
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Actualización de contraseña (requiere autenticación)
router.put('/updatePassword', authenticateToken, async (req, res) => {
  try {
      const { newPassword } = req.body; // Ya no necesitamos la contraseña actual

      const user = await User.findById(req.user.userId);
      if (!user) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Actualizar la contraseña en la base de datos
      await   
User.updateOne({ _id: user._id }, { password: hashedPassword });

      res.json({ message: 'Contraseña actualizada exitosamente' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al actualizar contraseña', error: err.message });
  }
});

module.exports = router;
