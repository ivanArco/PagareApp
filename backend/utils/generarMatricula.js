const generateMatricula = () => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const sequence = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `MAT-${year}-${random}-${sequence}`;
};

module.exports = generateMatricula;