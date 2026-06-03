require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const users = [
  {
    nombre: 'Admin',
    apellidos: 'Principal',
    email: 'admin@despacho.com',
    password: 'admin123',
    rol: 'admin',
    direccion: 'Oficinas Centrales',
    telefono: '555-0001',
    poblacion: 'Ciudad Legal',
  },
  {
    nombre: 'Abogado',
    apellidos: 'López',
    email: 'abogado@despacho.com',
    password: 'abogado123',
    rol: 'abogado',
    direccion: 'Bufete Jurídico',
    telefono: '555-1002',
    poblacion: 'Centro',
  },
  {
    nombre: 'Contador',
    apellidos: 'García',
    email: 'contador@despacho.com',
    password: 'contador123',
    rol: 'contador',
    direccion: 'Despacho Contable',
    telefono: '555-2003',
    poblacion: 'Norte',
  },
  {
    nombre: 'Juan',
    apellidos: 'Pérez',
    email: 'deudor@despacho.com',
    password: 'basico123',
    rol: 'basico',
    direccion: 'Calle Falsa 123',
    telefono: '555-1234567',
    poblacion: 'Ciudad Ejemplo',
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar colección
    await User.deleteMany({});
    console.log('🗑️ Usuarios existentes eliminados');

    // Inserción secuencial para evitar conflictos de matrícula
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`✔️ Creado: ${user.nombre} ${user.apellidos} (${user.email}) → rol: ${user.rol}, matrícula: ${user.matricula}`);
    }

    console.log(`✅ ${users.length} usuarios creados correctamente`);
  } catch (error) {
    console.error('❌ Error en seed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

seedDB();