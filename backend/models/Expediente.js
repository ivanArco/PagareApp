const mongoose = require('mongoose');

const pagareSchema = new mongoose.Schema({
  numero: { type: Number, required: true },
  monto: { type: Number, required: true },
  fechaVencimiento: { type: Date, required: true },
  saldo: { type: Number, required: true },
  estado: { 
    type: String, 
    enum: ['pendiente', 'pagado', 'vencido', 'parcial'], 
    default: 'pendiente' 
  },
  pagosRealizados: [{
    fecha: { type: Date, default: Date.now },
    monto: { type: Number, required: true },
    recibo: { type: String }
  }]
});

const expedienteSchema = new mongoose.Schema({
  noExpediente: { type: String, unique: true, required: true },
  abogado: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nombre: { type: String, required: true },
    matricula: { type: String, required: true }
  },
  deudor: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    correo: { type: String, required: true },
    matricula: { type: String, required: true }
  },
  prestamista: {
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    direccion: { type: String, required: true },
    identificacion: { type: String, required: true }
  },
  montoTotal: { type: Number, required: true },
  numPagos: { type: Number, required: true },
  pagares: [pagareSchema],
  estadoGeneral: {
    type: String,
    enum: ['activo', 'pagado', 'vencido', 'cancelado', 'en_proceso'],
    default: 'activo'
  },
  fechaCreacion: { type: Date, default: Date.now },
  notasAdicionales: { type: String },
  contratoPDF: { type: String } // Para almacenar ruta del PDF generado
});

// Índices para búsquedas rápidas
expedienteSchema.index({ 'deudor.id': 1 });
expedienteSchema.index({ 'abogado.id': 1 });
// ANTES de exportar el modelo en tu archivo de Mongoose backend:
expedienteSchema.pre('validate', async function (next) {
  if (!this.noExpediente) {
    // Genera un código único basado en el año y un número aleatorio (Ej: EXP-2026-8492)
    const ano = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.noExpediente = `EXP-${ano}-${rand}`;
  }
  next();
});

module.exports = mongoose.model('Expediente', expedienteSchema);