const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { authMiddleware } = require('../middleware/auth');
// nodemailer (opcional)
const nodemailer = require('nodemailer');

// Registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellidos, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'El usuario ya existe' });
    user = new User({ nombre, apellidos, email, password });
    await user.save();
    const payload = { userId: user._id, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, nombre, apellidos, email, matricula: user.matricula, rol: user.rol } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Credenciales inválidas' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Credenciales inválidas' });
    const payload = { userId: user._id, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, nombre: user.nombre, apellidos: user.apellidos, email: user.email, matricula: user.matricula, rol: user.rol } });
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});

// Recuperar contraseña - enviar email con token
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'No existe usuario con ese email' });
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();

    // Simular envío de email (consola). Si tienes nodemailer configurado, descomenta.
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;
    console.log(`🔐 Link para restablecer contraseña: ${resetLink}`);

    // Opcional: enviar email real con nodemailer
    /*
    const transporter = nodemailer.create transporter({ service: 'gmail', auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
    await transporter.sendMail({ from: process.env.EMAIL_USER, to: email, subject: 'Recuperación de contraseña', html: `<a href="${resetLink}">Restablecer</a>` });
    */
    res.json({ msg: 'Se ha enviado un enlace a tu correo (ver consola)' });
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});

// Resetear contraseña
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ msg: 'Token inválido o expirado' });
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ msg: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(500).send('Error en el servidor');
  }
});

// Obtener perfil del usuario autenticado
router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json(user);
});

module.exports = router;