const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Todas requieren autenticación y rol admin
router.use(authMiddleware, adminMiddleware);

// Obtener todos los usuarios
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Crear usuario (admin)
router.post('/users', async (req, res) => {
  try {
    const { nombre, apellidos, email, password, rol } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email ya registrado' });
    const user = new User({ nombre, apellidos, email, password, rol });
    await user.save();
    res.json({ msg: 'Usuario creado', user });
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear usuario' });
  }
});

// Actualizar rol de usuario
router.put('/users/:id/role', async (req, res) => {
  try {
    const { rol } = req.body;
    if (!['admin', 'basico', 'contador', 'abogado'].includes(rol)) {
      return res.status(400).json({ msg: 'Rol inválido' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { rol }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar rol' });
  }
});

// Eliminar usuario
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar' });
  }
});

module.exports = router;