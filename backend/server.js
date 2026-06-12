
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const pagareRoutes = require('./routes/pagare');
const expedienteRoutes = require('./routes/expediente');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/pagares', pagareRoutes);
app.use('/api/expedientes', expedienteRoutes);

// 🚀 Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Conectado a MongoDB Atlas');
    // Eliminar índice obsoleto 'numero_1' si existe (quedó de una versión anterior)
    try {
      await mongoose.connection.collection('expedientes').dropIndex('numero_1');
      console.log('🧹 Índice obsoleto numero_1 eliminado');
    } catch (_) {
      // Si no existe el índice, no hay problema
    }
  })
  .catch(err => console.error('❌ Error MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
