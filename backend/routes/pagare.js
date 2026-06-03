const express = require('express');
const router = express.Router();
const Pagare = require('../models/Pagare');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener lista de usuarios básicos (para el selector)
router.get('/usuarios-basicos', async (req, res) => {
  // Solo abogados o admin pueden acceder
  if (req.user.rol !== 'abogado' && req.user.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado' });
  }
  const usuarios = await User.find({ rol: 'basico' }).select('nombre apellidos email direccion telefono poblacion');
  res.json(usuarios);
});

// Crear un nuevo pagaré (con deudor existente o nuevo)
router.post('/', async (req, res) => {
  if (req.user.rol !== 'abogado') {
    return res.status(403).json({ msg: 'Solo abogados pueden crear pagarés' });
  }
  try {
    const {
      lugarExpedicion, monto, fechaPago, lugarPago, interesMoratorio,
      beneficiario, acepto,
      deudorId,
      nuevoDeudor
    } = req.body;

    let deudor;
    if (deudorId) {
      deudor = await User.findOne({ _id: deudorId, rol: 'basico' });
      if (!deudor) return res.status(400).json({ msg: 'Deudor inválido o no es usuario básico' });
    } else if (nuevoDeudor) {
      const { nombre, apellidos, email, direccion, telefono, poblacion, password } = nuevoDeudor;
      if (!nombre || !apellidos || !email) {
        return res.status(400).json({ msg: 'Nombre, apellidos y email son obligatorios para nuevo deudor' });
      }
      const existe = await User.findOne({ email });
      if (existe) return res.status(400).json({ msg: 'Ya existe un usuario con ese email. Use la opción de selección.' });
      const nuevo = new User({
        nombre,
        apellidos,
        email,
        password: password || 'cambiar123',
        rol: 'basico',
        direccion: direccion || '',
        telefono: telefono || '',
        poblacion: poblacion || ''
      });
      await nuevo.save();
      deudor = nuevo;
    } else {
      return res.status(400).json({ msg: 'Debe proporcionar un deudor existente o los datos de un nuevo deudor' });
    }

    const pagare = new Pagare({
      lugarExpedicion,
      monto,
      fechaPago,
      lugarPago,
      interesMoratorio,
      beneficiario,
      deudorId: deudor._id,
      nombreDeudor: `${deudor.nombre} ${deudor.apellidos}`,
      direccionDeudor: deudor.direccion,
      telefonoDeudor: deudor.telefono,
      poblacionDeudor: deudor.poblacion,
      acepto: acepto || false,
      abogadoId: req.user.userId
    });
    await pagare.save();
    res.status(201).json(pagare);
  } catch (err) {
    console.error('Error crear pagaré:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Datos inválidos', details: err.errors });
    }
    res.status(500).json({ msg: 'Error al crear pagaré' });
  }
});

// Obtener todos los pagarés del abogado autenticado (o todos si admin)
router.get('/', async (req, res) => {
  if (req.user.rol !== 'abogado' && req.user.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado' });
  }
  const filtro = req.user.rol === 'admin' ? {} : { abogadoId: req.user.userId };
  const pagares = await Pagare.find(filtro).populate('deudorId', 'nombre apellidos email').sort({ createdAt: -1 });
  res.json(pagares);
});

// Obtener un pagaré por ID
router.get('/:id', async (req, res) => {
  if (req.user.rol !== 'abogado' && req.user.rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso denegado' });
  }
  try {
    const pagare = await Pagare.findById(req.params.id).populate('deudorId', 'nombre apellidos email direccion telefono poblacion');
    if (!pagare) return res.status(404).json({ msg: 'Pagare no encontrado' });
    // Verificar que pertenezca al abogado o sea admin
    if (req.user.rol !== 'admin' && pagare.abogadoId.toString() !== req.user.userId) {
      return res.status(403).json({ msg: 'No autorizado' });
    }
    res.json(pagare);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener pagaré' });
  }
});

module.exports = router;