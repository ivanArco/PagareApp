const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Soportar tanto 'x-auth-token' como 'Authorization: Bearer <token>'
  let token = req.header('x-auth-token');
  if (!token) {
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7);
    }
  }
  if (!token) return res.status(401).json({ msg: 'No token, autorización denegada' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // EXPLICACIÓN DEL AJUSTE:
    // Si el payload del JWT guardó al usuario dentro de un objeto 'user' o 'usuario', 
    // lo extraemos directamente para normalizar 'req.user'.
    if (decoded.user) {
      req.user = decoded.user;
    } else if (decoded.usuario) {
      req.user = decoded.usuario;
    } else {
      req.user = decoded; // Si venía en la raíz, lo dejamos en la raíz
    }

    // Aseguramos compatibilidad absoluta por si en tu BD se llama 'role' o 'rol'
    if (req.user && !req.user.rol && req.user.role) {
      req.user.rol = req.user.role;
    }
    
    // Normalizar el ID sin importar si viene como 'id', '_id' o 'userId'
    if (req.user && !req.user.id) {
      req.user.id = req.user._id || req.user.userId;
    }

    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};

const adminMiddleware = (req, res, next) => {
  // Extraemos el rol de forma segura convirtiéndolo a minúsculas
  const rol = (req.user?.rol || req.user?.role || '').toLowerCase().trim();
  
  if (rol !== 'admin') {
    return res.status(403).json({ msg: 'Acceso solo para administradores' });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };