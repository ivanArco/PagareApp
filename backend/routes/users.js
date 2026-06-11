const router = require('express').Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const authorize = require('../middleware/role');
const generateMatricula = require('../utils/generateMatricula');
const bcrypt = require('bcryptjs');

// ============================================
// TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN
// ============================================
router.use(authMiddleware);

// ============================================
// RUTA DE PRUEBA / DEBUG (solo para desarrollo)
// ============================================
router.get('/test', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ 
      success: true, 
      count: users.length,
      users: users 
    });
  } catch (error) {
    console.error('Error en /test:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// OBTENER TODOS LOS USUARIOS
// ============================================
router.get('/', async (req, res) => {
  try {
    console.log('📋 Obteniendo usuarios - Usuario que consulta:', req.user.id, 'Rol:', req.user.rol);
    
    let query = {};
    
    // Si no es admin, solo puede ver usuarios básicos (para seleccionar deudores)
    if (req.user.rol !== 'admin') {
      query = { rol: 'basico' };
    }
    
    const users = await User.find(query).select('-password');
    
    console.log(`✅ Usuarios encontrados: ${users.length}`);
    res.json(users);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ msg: 'Error al obtener usuarios', error: error.message });
  }
});

// ============================================
// OBTENER UN USUARIO ESPECÍFICO
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    // Verificar permisos: solo admin o el propio usuario
    if (req.user.rol !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ msg: 'No autorizado para ver este usuario' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener usuario' });
  }
});

// ============================================
// CREAR USUARIO (SOLO ADMIN)
// ============================================
router.post('/', authorize('admin'), async (req, res) => {
  try {
    const { 
      nombre, 
      apellidos, 
      email, 
      password, 
      rol, 
      direccion, 
      telefono, 
      poblacion 
    } = req.body;
    
    console.log('📝 Creando nuevo usuario:', email);
    
    // Validar campos requeridos
    if (!nombre || !apellidos || !email || !password) {
      return res.status(400).json({ msg: 'Nombre, apellidos, email y contraseña son requeridos' });
    }
    
    // Verificar si el email ya existe
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'El correo electrónico ya está registrado' });
    }
    
    // Generar matrícula única
    let matricula = generateMatricula();
    let existeMatricula = await User.findOne({ matricula });
    while (existeMatricula) {
      matricula = generateMatricula();
      existeMatricula = await User.findOne({ matricula });
    }
    
    // Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Crear usuario
    const user = new User({
      nombre,
      apellidos,
      email,
      password: hashedPassword,
      matricula,
      rol: rol || 'basico',
      direccion: direccion || '',
      telefono: telefono || '',
      poblacion: poblacion || ''
    });
    
    await user.save();
    
    console.log(`✅ Usuario creado: ${user.nombre} ${user.apellidos} (${user.email}) - Matrícula: ${user.matricula}`);
    
    res.status(201).json({ 
      msg: 'Usuario creado exitosamente',
      user: {
        id: user._id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        matricula: user.matricula,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ msg: 'Error al crear usuario', error: error.message });
  }
});

// ============================================
// ACTUALIZAR USUARIO (SOLO ADMIN)
// ============================================
router.put('/:id', authorize('admin'), async (req, res) => {
  try {
    const { nombre, apellidos, email, rol, direccion, telefono, poblacion, password } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    // Actualizar campos
    if (nombre) user.nombre = nombre;
    if (apellidos) user.apellidos = apellidos;
    if (email) {
      // Verificar que el nuevo email no esté en uso
      const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (emailExists) {
        return res.status(400).json({ msg: 'El correo electrónico ya está en uso' });
      }
      user.email = email;
    }
    if (rol) user.rol = rol;
    if (direccion) user.direccion = direccion;
    if (telefono) user.telefono = telefono;
    if (poblacion) user.poblacion = poblacion;
    
    // Actualizar contraseña si se proporciona
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    
    await user.save();
    
    console.log(`✅ Usuario actualizado: ${user.nombre} ${user.apellidos}`);
    
    res.json({ 
      msg: 'Usuario actualizado exitosamente',
      user: {
        id: user._id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        matricula: user.matricula,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ msg: 'Error al actualizar usuario', error: error.message });
  }
});

// ============================================
// ELIMINAR USUARIO (SOLO ADMIN)
// ============================================
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    // No permitir eliminar el propio usuario
    if (req.params.id === req.user.id) {
      return res.status(400).json({ msg: 'No puedes eliminar tu propio usuario' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    await user.deleteOne();
    
    console.log(`🗑️ Usuario eliminado: ${user.nombre} ${user.apellidos} (${user.email})`);
    
    res.json({ msg: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ msg: 'Error al eliminar usuario', error: error.message });
  }
});

// ============================================
// OBTENER SOLO DEUDORES (USUARIOS CON ROL BASICO)
// ============================================
router.get('/deudores/list', async (req, res) => {
  try {
    console.log('📋 Obteniendo lista de deudores (rol: basico)');
    
    const deudores = await User.find({ rol: 'basico' }).select('-password');
    
    console.log(`✅ Deudores encontrados: ${deudores.length}`);
    res.json(deudores);
  } catch (error) {
    console.error('❌ Error al obtener deudores:', error);
    res.status(500).json({ msg: 'Error al obtener deudores', error: error.message });
  }
});

// ============================================
// OBTENER SOLO ABOGADOS
// ============================================
router.get('/abogados/list', authorize('admin', 'abogado'), async (req, res) => {
  try {
    const abogados = await User.find({ rol: 'abogado' }).select('-password');
    res.json(abogados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener abogados' });
  }
});

// ============================================
// CAMBIAR ROL DE USUARIO (SOLO ADMIN)
// ============================================
router.patch('/:id/rol', authorize('admin'), async (req, res) => {
  try {
    const { rol } = req.body;
    const rolesValidos = ['admin', 'abogado', 'contador', 'basico'];
    
    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({ msg: 'Rol no válido' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    
    user.rol = rol;
    await user.save();
    
    console.log(`🔄 Rol actualizado: ${user.nombre} ${user.apellidos} -> ${rol}`);
    
    res.json({ 
      msg: 'Rol actualizado exitosamente',
      user: {
        id: user._id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('❌ Error al cambiar rol:', error);
    res.status(500).json({ msg: 'Error al cambiar rol', error: error.message });
  }
});

// ============================================
// ESTADÍSTICAS DE USUARIOS (SOLO ADMIN)
// ============================================
router.get('/stats/overview', authorize('admin'), async (req, res) => {
  try {
    const total = await User.countDocuments();
    const admins = await User.countDocuments({ rol: 'admin' });
    const abogados = await User.countDocuments({ rol: 'abogado' });
    const contadores = await User.countDocuments({ rol: 'contador' });
    const basicos = await User.countDocuments({ rol: 'basico' });
    
    res.json({
      total,
      porRol: {
        admin: admins,
        abogado: abogados,
        contador: contadores,
        basico: basicos
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener estadísticas' });
  }
});

module.exports = router;