const router = require('express').Router();
const { authMiddleware } = require('../middleware/auth');
const authorize = require('../middleware/role');
const Expediente = require('../models/Expediente');
const User = require('../models/User');
const generateExpedienteNo = require('../utils/generateExpedienteNo');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener todos los expedientes (según rol)
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // Si no es admin, solo ver sus expedientes como abogado o deudor
    if (req.user.rol !== 'admin') {
      query = {
        $or: [
          { 'abogado.id': req.user.id },
          { 'deudor.id': req.user.id }
        ]
      };
    }
    
    const expedientes = await Expediente.find(query)
      .sort({ fechaCreacion: -1 })
      .populate('abogado.id', 'nombre apellidos matricula')
      .populate('deudor.id', 'nombre apellidos matricula correo');
    
    res.json(expedientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener expedientes' });
  }
});

// Obtener un expediente específico
router.get('/:id', async (req, res) => {
  try {
    const expediente = await Expediente.findById(req.params.id)
      .populate('abogado.id', 'nombre apellidos matricula')
      .populate('deudor.id', 'nombre apellidos matricula correo');
    
    if (!expediente) {
      return res.status(404).json({ msg: 'Expediente no encontrado' });
    }
    
    // Verificar permisos
    if (req.user.rol !== 'admin' && 
        expediente.abogado.id.toString() !== req.user.id && 
        expediente.deudor.id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado' });
    }
    
    res.json(expediente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener expediente' });
  }
});

// Crear nuevo expediente (OPTIMIZADO para coincidir con tu esquema estricto)
router.post('/', authorize('abogado', 'admin'), async (req, res) => {
  try {
    const {
      deudorId,
      prestamista,
      montoTotal,
      numPagos,
      pagares,
      notasAdicionales
    } = req.body;

    // El abogado es el usuario que está haciendo la petición a través del token
    const abogadoId = req.user.id;
    
    // Validar que el abogado exista y tenga rol de abogado
    const abogado = await User.findById(abogadoId);
    if (!abogado || (abogado.rol !== 'abogado' && abogado.role !== 'abogado')) {
      return res.status(400).json({ msg: 'El usuario no tiene rol de abogado o no existe.' });
    }

    // Validar que el deudor exista
    if (!deudorId) {
      return res.status(400).json({ msg: 'El campo deudorId es requerido obligatorio' });
    }
    const deudor = await User.findById(deudorId);
    if (!deudor) {
      return res.status(400).json({ msg: 'Deudor no válido o inexistente en el sistema' });
    }

    // Validar que el deudor no sea el mismo abogado
    if (deudorId.toString() === abogadoId.toString()) {
      return res.status(400).json({ msg: 'El abogado no puede ser asignado como el deudor' });
    }

    // Validar datos del prestamista
    if (!prestamista || !prestamista.nombre || !prestamista.apellidos || 
        (!prestamista.correo && !prestamista.email) || !prestamista.telefono || 
        !prestamista.direccion || !prestamista.identificacion) {
      return res.status(400).json({ msg: 'Todos los datos del prestamista son obligatorios' });
    }

    // Validar monto y pagos
    if (!montoTotal || montoTotal <= 0) {
      return res.status(400).json({ msg: 'El monto total debe ser un número mayor a 0' });
    }

    if (!numPagos || numPagos < 1 || numPagos > 36) {
      return res.status(400).json({ msg: 'El número de pagos debe estar entre 1 y 36' });
    }

    if (!pagares || pagares.length !== parseInt(numPagos)) {
      return res.status(400).json({ msg: 'Los pagarés no coinciden con el número de pagos solicitado' });
    }

    // Generar número de expediente automático mediante la utilidad
    const noExpediente = await generateExpedienteNo(Expediente);

    // Crear el expediente inyectando los datos requeridos por tu Schema de Mongoose
    const expediente = new Expediente({
      noExpediente,
      abogado: {
        id: abogado._id,
        nombre: abogado.nombre,
        apellidos: abogado.apellidos || '',
        matricula: abogado.matricula || 'N/A'
      },
      deudor: {
        id: deudor._id,
        nombre: deudor.nombre,
        apellidos: deudor.apellidos || '',
        correo: deudor.email || deudor.correo || 'N/A',
        matricula: deudor.matricula || 'N/A' // Rellena el required: true del subdocumento deudor
      },
      prestamista: {
        nombre: prestamista.nombre,
        apellidos: prestamista.apellidos,
        correo: prestamista.correo || prestamista.email,
        telefono: prestamista.telefono,
        direccion: prestamista.direccion,
        identificacion: prestamista.identificacion
      },
      montoTotal: parseFloat(montoTotal),
      numPagos: parseInt(numPagos),
      pagares: pagares.map((pagare, index) => ({
        numero: pagare.numero || (index + 1),
        monto: parseFloat(pagare.monto),
        fechaVencimiento: new Date(pagare.fechaVencimiento),
        saldo: parseFloat(pagare.monto),
        estado: 'pendiente',
        pagosRealizados: []
      })),
      notasAdicionales: notasAdicionales || '',
      estadoGeneral: 'activo'
    });

    await expediente.save();
    
    // Respuesta con el expediente creado de forma exitosa
    res.status(201).json({
      msg: 'Expediente creado exitosamente',
      noExpediente: expediente.noExpediente,
      expediente: {
        id: expediente._id,
        noExpediente: expediente.noExpediente,
        abogado: expediente.abogado,
        deudor: expediente.deudor,
        montoTotal: expediente.montoTotal,
        numPagos: expediente.numPagos,
        fechaCreacion: expediente.fechaCreacion
      }
    });
  } catch (error) {
    console.error('Error al crear expediente:', error);
    res.status(500).json({ msg: 'Error al crear expediente: ' + error.message });
  }
});

// Registrar pago a un pagaré
router.post('/:id/pagar', authorize('abogado', 'admin'), async (req, res) => {
  try {
    const { pagareNumero, monto, recibo, notas } = req.body;
    const expediente = await Expediente.findById(req.params.id);
    
    if (!expediente) {
      return res.status(404).json({ msg: 'Expediente no encontrado' });
    }

    // Verificar que el abogado sea el asignado o admin
    if (req.user.rol !== 'admin' && expediente.abogado.id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado para registrar pagos en este expediente' });
    }

    const pagare = expediente.pagares.find(p => p.numero === pagareNumero);
    if (!pagare) {
      return res.status(404).json({ msg: 'Pagaré no encontrado' });
    }

    // Validar monto del pago
    if (monto <= 0) {
      return res.status(400).json({ msg: 'El monto del pago debe ser mayor a 0' });
    }

    if (monto > pagare.saldo) {
      return res.status(400).json({ msg: `El monto excede el saldo pendiente ($${pagare.saldo.toFixed(2)})` });
    }

    // Registrar el pago
    const nuevoPago = {
      fecha: new Date(),
      monto: parseFloat(monto),
      recibo: recibo || `REC-${Date.now()}-${pagareNumero}`,
      registradoPor: req.user.id,
      notas: notas || ''
    };
    
    pagare.pagosRealizados.push(nuevoPago);
    pagare.saldo = parseFloat((pagare.saldo - monto).toFixed(2));
    
    // Actualizar estado del pagaré
    if (pagare.saldo <= 0) {
      pagare.estado = 'pagado';
    } else if (pagare.saldo < pagare.monto) {
      pagare.estado = 'parcial';
    }

    // Actualizar estado general del expediente
    const todosPagados = expediente.pagares.every(p => p.estado === 'pagado');
    const algunVencido = expediente.pagares.some(p => {
      return p.estado !== 'pagado' && new Date(p.fechaVencimiento) < new Date();
    });
    
    if (todosPagados) {
      expediente.estadoGeneral = 'pagado';
    } else if (algunVencido) {
      expediente.estadoGeneral = 'vencido';
    } else {
      expediente.estadoGeneral = 'activo';
    }

    await expediente.save();
    
    res.json({ 
      msg: 'Pago registrado exitosamente', 
      pagare: {
        numero: pagare.numero,
        saldo: pagare.saldo,
        estado: pagare.estado
      },
      expediente: {
        id: expediente._id,
        estadoGeneral: expediente.estadoGeneral
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al registrar pago' });
  }

  // ... (dentro de tu router.post('/', ...))

// El abogado es el usuario que está haciendo la petición a través del token
const abogadoId = req.user.id;

// Validar que el abogado exista en la BD
const abogado = await User.findById(abogadoId);
if (!abogado) {
  return res.status(400).json({ msg: 'El usuario autenticado ya no existe en la base de datos.' });
}

// Extraer el rol sin importar si se llama 'rol' o 'role'
const rolUsuario = (abogado.rol || abogado.role || '').toLowerCase().trim();

// Validación multi-rol: Permitimos 'abogado' o 'admin' para interactuar
if (rolUsuario !== 'abogado' && rolUsuario !== 'admin') {
  return res.status(400).json({ 
    msg: `Acceso denegado. Tu rol actual es '${rolUsuario}'. Se requiere rol de 'abogado' o 'admin'.` 
  });
}

// ... (el resto de tu código de creación de expediente sigue igual)
});

// Actualizar estado del expediente
router.put('/:id/estado', authorize('admin', 'abogado'), async (req, res) => {
  try {
    const { estadoGeneral, notas } = req.body;
    const expediente = await Expediente.findById(req.params.id);
    
    if (!expediente) {
      return res.status(404).json({ msg: 'Expediente no encontrado' });
    }
    
    // Verificar permisos
    if (req.user.rol !== 'admin' && expediente.abogado.id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado' });
    }
    
    const estadosValidos = ['activo', 'pagado', 'vencido', 'cancelado', 'en_proceso'];
    if (!estadosValidos.includes(estadoGeneral)) {
      return res.status(400).json({ msg: 'Estado no válido' });
    }
    
    expediente.estadoGeneral = estadoGeneral;
    if (notas) {
      expediente.notasAdicionales = expediente.notasAdicionales 
        ? `${expediente.notasAdicionales}\n[${new Date().toLocaleDateString()}] ${notas}`
        : `[${new Date().toLocaleDateString()}] ${notas}`;
    }
    
    await expediente.save();
    
    res.json({ 
      msg: 'Estado actualizado correctamente', 
      expediente: {
        id: expediente._id,
        estadoGeneral: expediente.estadoGeneral,
        notasAdicionales: expediente.notasAdicionales
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar estado' });
  }
});

// Obtener resumen financiero de un expediente
router.get('/:id/resumen', async (req, res) => {
  try {
    const expediente = await Expediente.findById(req.params.id);
    
    if (!expediente) {
      return res.status(404).json({ msg: 'Expediente no encontrado' });
    }
    
    // Verificar permisos
    if (req.user.rol !== 'admin' && 
        expediente.abogado.id.toString() !== req.user.id && 
        expediente.deudor.id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'No autorizado' });
    }
    
    const totalPagado = expediente.pagares.reduce((sum, pagare) => {
      const pagos = pagare.pagosRealizados.reduce((s, p) => s + p.monto, 0);
      return sum + pagos;
    }, 0);
    
    const saldoPendiente = expediente.montoTotal - totalPagado;
    const pagaresPagados = expediente.pagares.filter(p => p.estado === 'pagado').length;
    const pagaresPendientes = expediente.pagares.filter(p => p.estado !== 'pagado').length;
    
    res.json({
      expedienteId: expediente._id,
      noExpediente: expediente.noExpediente,
      montoTotal: expediente.montoTotal,
      totalPagado: parseFloat(totalPagado.toFixed(2)),
      saldoPendiente: parseFloat(saldoPendiente.toFixed(2)),
      pagares: {
        total: expediente.numPagos,
        pagados: pagaresPagados,
        pendientes: pagaresPendientes
      },
      porcentajeAvance: ((totalPagado / expediente.montoTotal) * 100).toFixed(2)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener resumen' });
  }
});

module.exports = router;