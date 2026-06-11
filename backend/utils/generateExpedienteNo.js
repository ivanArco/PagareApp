// Generar número de expediente único secuencial
const generateExpedienteNo = async (ExpedienteModel) => {
  try {
    // Obtener el último expediente creado
    const lastExpediente = await ExpedienteModel.findOne()
      .sort({ fechaCreacion: -1 })
      .lean();

    if (!lastExpediente || !lastExpediente.noExpediente) {
      // Si es el primer expediente, comenzar con EXP-2026-001
      const year = new Date().getFullYear();
      return `EXP-${year}-001`;
    }

    // Extraer el número secuencial del último expediente
    const parts = lastExpediente.noExpediente.split('-');
    let sequential = parseInt(parts[parts.length - 1]) || 0;
    sequential++;

    // Formatear con ceros a la izquierda
    const year = new Date().getFullYear();
    return `EXP-${year}-${String(sequential).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generando número de expediente:', error);
    const year = new Date().getFullYear();
    return `EXP-${year}-001`;
  }
};

module.exports = generateExpedienteNo;
