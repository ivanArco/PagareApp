const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  matricula: { type: String, unique: true },
  password: { type: String, required: true },
  direccion: { type: String, default: '' },
  telefono: { type: String, default: '' },
  poblacion: { type: String, default: '' },
  rol: {
    type: String,
    enum: ['admin', 'basico', 'contador', 'abogado'],
    default: 'basico'
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

// Pre-save hook: genera matrícula y hashea la contraseña (sin next)
userSchema.pre('save', async function() {
  // Generar matrícula solo si no existe
  if (!this.matricula) {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  this.matricula = `LEG-${year}-${random}`;
  // Verificar unicidad (poco probable colisión, pero se puede reintentar)
  }
  // Hashear contraseña solo si fue modificada
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
//me la pelan, los amo putos 