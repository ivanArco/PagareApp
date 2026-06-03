// Función exportada para generar HTML del pagaré
export const generatePagareHTML = (pagare) => {
  const fechaExpedicion = new Date(pagare.fechaExpedicion).toLocaleDateString('es-ES');
  const fechaPago = new Date(pagare.fechaPago).toLocaleDateString('es-ES');
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pagaré ${pagare.numero}</title>
      <style>
        body {
          font-family: 'Times New Roman', serif;
          background-color: #f9f9f9;
          margin: 0;
          padding: 20px;
          min-height: 100vh;
        }
        .pagare {
          background-color: white;
          border: 2px solid black;
          padding: 40px;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          border-radius: 6px;
          box-shadow: 0 0 15px rgba(0,0,0,0.25);
          box-sizing: border-box;
          font-size: 16px;
        }
        h2 {
          text-align: center;
          text-transform: uppercase;
          border-bottom: 2px solid black;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        h3 {
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .row {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          margin-bottom: 15px;
        }
        .field {
          flex: 1;
          margin-right: 10px;
          min-width: 120px;
        }
        .field label {
          font-weight: bold;
          display: block;
          margin-bottom: 3px;
        }
        .field .value {
          border-bottom: 1px solid black;
          padding: 3px;
          font-size: 14px;
        }
        .long-text {
          border: 1px solid black;
          padding: 10px;
          margin-top: 15px;
          font-size: 13px;
          text-align: justify;
        }
        .signature {
          margin-top: 40px;
          text-align: right;
        }
        .signature-line {
          border-top: 1px solid black;
          width: 300px;
          margin-left: auto;
          margin-top: 40px;
        }
        .buttons {
          margin-top: 20px;
          text-align: center;
        }
        button {
          background-color: black;
          color: white;
          border: none;
          padding: 10px 20px;
          margin: 5px;
          cursor: pointer;
          font-size: 14px;
          border-radius: 4px;
        }
        button:hover {
          background-color: #333;
        }
        @media print {
          body { background: white; margin: 0; padding: 0; }
          .pagare { max-width: 100%; width: 100%; box-shadow: none; border: 1px solid black; margin: 0; }
          .buttons { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="pagare">
        <h2>PAGARÉ</h2>
        <div class="row">
          <div class="field"><label>Número:</label><div class="value">${pagare.numero}</div></div>
          <div class="field"><label>Fecha expedición:</label><div class="value">${fechaExpedicion}</div></div>
          <div class="field"><label>Lugar expedición:</label><div class="value">${pagare.lugarExpedicion}</div></div>
        </div>
        <div class="row">
          <div class="field"><label>Monto ($):</label><div class="value">${pagare.monto.toFixed(2)}</div></div>
          <div class="field"><label>Interés moratorio (% mensual):</label><div class="value">${pagare.interesMoratorio}</div></div>
        </div>
        <div class="row">
          <div class="field"><label>Beneficiario:</label><div class="value">${pagare.beneficiario}</div></div>
          <div class="field"><label>Lugar de pago:</label><div class="value">${pagare.lugarPago}</div></div>
          <div class="field"><label>Fecha de pago:</label><div class="value">${fechaPago}</div></div>
        </div>
        <h3>Datos del Deudor</h3>
        <div class="row">
          <div class="field"><label>Nombre:</label><div class="value">${pagare.nombreDeudor}</div></div>
          <div class="field"><label>Dirección:</label><div class="value">${pagare.direccionDeudor}</div></div>
        </div>
        <div class="row">
          <div class="field"><label>Teléfono:</label><div class="value">${pagare.telefonoDeudor}</div></div>
          <div class="field"><label>Población:</label><div class="value">${pagare.poblacionDeudor}</div></div>
        </div>
        <div class="long-text">
          Valor recibido a mi entera satisfacción. Este pagaré forma parte de una serie numerada del 1 al ____ y todos están sujetos a la condición de que, al no pagarse cualquiera de ellos a su vencimiento, serán exigibles todos los que le sigan en número, además de los ya vencidos. Desde la fecha de vencimiento de este documento hasta el día de su liquidación, causará intereses moratorios al tipo señalado, pagadero en esta ciudad puntualmente con el principal.
        </div>
        <div class="signature">
          <p>Firma del Deudor:</p>
          <div class="signature-line"></div>
        </div>
        <div class="buttons">
          <button onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
          <button onclick="window.close()">Cerrar pestaña</button>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Componente para abrir en nueva pestaña
export const openPagareInNewTab = (pagare) => {
  const html = generatePagareHTML(pagare);
  const w = window.open('', '_blank');
  if (!w) {
    alert('No se pudo abrir nueva pestaña. Revisa el bloqueador de ventanas emergentes.');
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
};

export default function PagareVistaPrevia() {
  return null;
}
