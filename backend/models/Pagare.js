const mongoose = require('mongoose');

const pagareSchema = new mongoose.Schema({
  numero: { type: String, unique: true },
  fechaExpedicion: { type: Date, default: Date.now },
  lugarExpedicion: { type: String, required: true },
  monto: { type: Number, required: true },
  fechaPago: { type: Date, required: true },
  lugarPago: { type: String, required: true },
  interesMoratorio: { type: Number, required: true, min: 0 }, // porcentaje mensual
  beneficiario: { type: String, required: true }, // "a la orden de"
  // Datos del deudor (usuario básico)
  deudorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nombreDeudor: { type: String, required: true },
  direccionDeudor: { type: String, required: true },
  telefonoDeudor: { type: String, required: true },
  poblacionDeudor: { type: String, required: true },
  acepto: { type: Boolean, default: false }, // simulación de firma
  // Abogado que crea el pagaré
  abogadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Generar número de pagaré automático antes de guardar
pagareSchema.pre('save', async function() {
  if (!this.numero) {
    const count = await mongoose.model('Pagare').countDocuments();
    const year = new Date().getFullYear();
    this.numero = `PAG-${year}-${(count + 1).toString().padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Pagare', pagareSchema);