const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, autorización denegada' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.rol !== 'admin') return res.status(403).json({ msg: 'Acceso solo para administradores' });
  next();
};

module.exports = { authMiddleware, adminMiddleware };