require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

// Nuevos usuarios para agregar (sin repetir los existentes)
const nuevosUsuarios = [
  {
    nombre: 'Carlos',
    apellidos: 'Ramírez',
    email: 'carlos.ramirez@despacho.com',
    password: 'abogado456',
    rol: 'abogado',
    direccion: 'Av. Reforma 123, Col. Centro',
    telefono: '555-1234',
    poblacion: 'Ciudad de México',
  },
  {
    nombre: 'María',
    apellidos: 'Fernández',
    email: 'maria.fernandez@despacho.com',
    password: 'abogada789',
    rol: 'abogado',
    direccion: 'Calle Juárez 45, Col. Industrial',
    telefono: '555-5678',
    poblacion: 'Guadalajara',
  },
  {
    nombre: 'Roberto',
    apellidos: 'Sánchez',
    email: 'roberto.sanchez@despacho.com',
    password: 'contador456',
    rol: 'contador',
    direccion: 'Blvd. López Mateos 789, Col. Moderna',
    telefono: '555-9012',
    poblacion: 'Monterrey',
  },
  {
    nombre: 'Laura',
    apellidos: 'Martínez',
    email: 'laura.martinez@despacho.com',
    password: 'contadora789',
    rol: 'contador',
    direccion: 'Calle Hidalgo 234, Col. Centro',
    telefono: '555-3456',
    poblacion: 'Puebla',
  },
  {
    nombre: 'Pedro',
    apellidos: 'Gómez',
    email: 'pedro.gomez@despacho.com',
    password: 'basico456',
    rol: 'basico',
    direccion: 'Av. Universidad 567, Col. Universitaria',
    telefono: '555-7890',
    poblacion: 'Querétaro',
  },
  {
    nombre: 'Ana',
    apellidos: 'López',
    email: 'ana.lopez@despacho.com',
    password: 'basico789',
    rol: 'basico',
    direccion: 'Calle Morelos 890, Col. Centro',
    telefono: '555-2345',
    poblacion: 'León',
  },
  {
    nombre: 'Miguel',
    apellidos: 'Hernández',
    email: 'miguel.hernandez@despacho.com',
    password: 'abogado999',
    rol: 'abogado',
    direccion: 'Blvd. Zaragoza 111, Col. Villa',
    telefono: '555-6789',
    poblacion: 'Toluca',
  },
  {
    nombre: 'Isabel',
    apellidos: 'Díaz',
    email: 'isabel.diaz@despacho.com',
    password: 'contador999',
    rol: 'contador',
    direccion: 'Calle Independencia 222, Col. Centro',
    telefono: '555-0123',
    poblacion: 'San Luis Potosí',
  },
  {
    nombre: 'Javier',
    apellidos: 'Torres',
    email: 'javier.torres@despacho.com',
    password: 'basico999',
    rol: 'basico',
    direccion: 'Av. Constitución 333, Col. Moderna',
    telefono: '555-4567',
    poblacion: 'Mérida',
  },
  {
    nombre: 'Patricia',
    apellidos: 'Romero',
    email: 'patricia.romero@despacho.com',
    password: 'deudor456',
    rol: 'basico',
    direccion: 'Calle 16 de Septiembre 444, Col. Centro',
    telefono: '555-8901',
    poblacion: 'Cancún',
  },
  {
    nombre: 'Fernando',
    apellidos: 'Mendoza',
    email: 'fernando.mendoza@despacho.com',
    password: 'deudor789',
    rol: 'basico',
    direccion: 'Blvd. Kukulkán 555, Zona Hotelera',
    telefono: '555-2345',
    poblacion: 'Cancún',
  },
  {
    nombre: 'Carmen',
    apellidos: 'Castro',
    email: 'carmen.castro@despacho.com',
    password: 'abogada555',
    rol: 'abogado',
    direccion: 'Calle Real 666, Col. Centro',
    telefono: '555-6789',
    poblacion: 'Morelia',
  },
];

// Función para generar matrícula única
const generarMatriculaUnica = (index) => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `MAT-${year}-${random}-${index}`;
};

const agregarNuevosUsuarios = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    let creados = 0;
    let existentes = 0;

    // Procesar cada usuario
    for (let i = 0; i < nuevosUsuarios.length; i++) {
      const userData = nuevosUsuarios[i];
      
      // Verificar si el email ya existe
      const usuarioExistente = await User.findOne({ email: userData.email });
      
      if (usuarioExistente) {
        console.log(`⚠️ Usuario ya existe: ${userData.email} - omitido`);
        existentes++;
        continue;
      }

      // Crear nuevo usuario con matrícula única
      const user = new User({
        ...userData,
        matricula: generarMatriculaUnica(i),
      });
      
      await user.save();
      console.log(`✅ Creado: ${user.nombre} ${user.apellidos} (${user.email}) → rol: ${user.rol}, matrícula: ${user.matricula}`);
      creados++;
    }

    console.log('\n📊 Resumen:');
    console.log(`   ✨ Usuarios nuevos creados: ${creados}`);
    console.log(`   ⚠️ Usuarios existentes (omitidos): ${existentes}`);
    console.log(`   📝 Total procesados: ${nuevosUsuarios.length}`);

    // Mostrar resumen por roles
    const totalUsuarios = await User.find();
    const abogados = totalUsuarios.filter(u => u.rol === 'abogado').length;
    const contadores = totalUsuarios.filter(u => u.rol === 'contador').length;
    const admins = totalUsuarios.filter(u => u.rol === 'admin').length;
    const basicos = totalUsuarios.filter(u => u.rol === 'basico').length;

    console.log('\n📈 Total de usuarios en BD después del seed:');
    console.log(`   👨‍⚖️ Abogados: ${abogados}`);
    console.log(`   🧾 Contadores: ${contadores}`);
    console.log(`   ⚙️ Admins: ${admins}`);
    console.log(`   👤 Básicos/Deudores: ${basicos}`);
    console.log(`   📌 TOTAL: ${totalUsuarios.length}`);

  } catch (error) {
    console.error('❌ Error en el seed:', error);
    if (error.code === 11000) {
      console.error('⚠️ Error de duplicado - clave duplicada:', error.keyValue);
    }
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado de MongoDB');
  }
};

// Ejecutar el seed
agregarNuevosUsuarios();