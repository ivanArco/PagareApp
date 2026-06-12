function numeroALetras(monto) {
  const total = Math.round(monto * 100);
  const entero = Math.floor(total / 100);
  const centavos = total % 100;

  function conv(n) {
    if (n === 0) return '';
    if (n <= 19) return ['','UN','DOS','TRES','CUATRO','CINCO','SEIS','SIETE','OCHO','NUEVE',
      'DIEZ','ONCE','DOCE','TRECE','CATORCE','QUINCE','DIECISEIS','DIECISIETE','DIECIOCHO','DIECINUEVE'][n];
    if (n <= 29) return ['VEINTE','VEINTIUN','VEINTIDOS','VEINTITRES','VEINTICUATRO','VEINTICINCO',
      'VEINTISEIS','VEINTISIETE','VEINTIOCHO','VEINTINUEVE'][n - 20];
    if (n < 100) {
      const t = ['','','VEINTE','TREINTA','CUARENTA','CINCUENTA','SESENTA','SETENTA','OCHENTA','NOVENTA'][Math.floor(n / 10)];
      const u = n % 10;
      return u === 0 ? t : t + ' Y ' + conv(u);
    }
    if (n === 100) return 'CIEN';
    if (n < 1000) {
      const h = ['','CIENTO','DOSCIENTOS','TRESCIENTOS','CUATROCIENTOS','QUINIENTOS',
        'SEISCIENTOS','SETECIENTOS','OCHOCIENTOS','NOVECIENTOS'][Math.floor(n / 100)];
      const r = n % 100;
      return r === 0 ? h : h + ' ' + conv(r);
    }
    if (n < 2000) { const r = n % 1000; return 'MIL' + (r ? ' ' + conv(r) : ''); }
    if (n < 1000000) { const k = Math.floor(n / 1000), r = n % 1000; return conv(k) + ' MIL' + (r ? ' ' + conv(r) : ''); }
    if (n < 2000000) { const r = n % 1000000; return 'UN MILLON' + (r ? ' ' + conv(r) : ''); }
    const m = Math.floor(n / 1000000), r = n % 1000000;
    return conv(m) + ' MILLONES' + (r ? ' ' + conv(r) : '');
  }

  return (conv(entero) || 'CERO') + ' PESOS ' + String(centavos).padStart(2, '0') + '/100 M.N.';
}

export const generatePagareHTML = (pagare) => {
  const fecha = new Date(pagare.fechaPago);
  const dia   = fecha.getDate().toString().padStart(2, '0');
  const mes   = fecha.toLocaleDateString('es-MX', { month: 'long' });
  const anio  = fecha.getFullYear();
  const monto = Number(pagare.monto).toLocaleString('es-MX', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });
  const montoEnLetras = numeroALetras(Number(pagare.monto));

  const cuerpo = `
  <!-- F1: encabezado -->
  <div class="row-header">
    <div class="h-title">Pagaré</div>
    <div class="h-lugar">
      <span class="lbl">Lugar de expedición</span>
      <div class="val">${pagare.lugarExpedicion}</div>
    </div>
    <div class="h-dia">
      <span class="lbl">Día</span>
      <div class="val val-bold">${dia}</div>
    </div>
    <div class="h-mes">
      <span class="lbl">Mes</span>
      <div class="val val-bold">${mes}</div>
    </div>
    <div class="h-anio">
      <span class="lbl">Año</span>
      <div class="val val-bold">${anio}</div>
    </div>
    <div class="h-bueno">
      <span class="lbl">Bueno por</span>
      <div class="val val-bold val-monto">$ ${monto}</div>
    </div>
  </div>

  <!-- F2: No. -->
  <div class="row-no">
    <div class="no-cell">
      <span class="lbl">No.</span>
      <div class="val val-num">${pagare.numero}</div>
    </div>
  </div>

  <!-- F3: promesa -->
  <div class="row-promesa">
    Debo(emos) y pagaré(mos) incondicionalmente sin pretexto este pagaré en el lugar y fechas citadas donde elija el tenedor el día de su vencimiento
  </div>

  <!-- F4: a la orden de + fecha vencimiento -->
  <div class="row-orden">
    <span style="white-space:nowrap;font-size:8px;">a la orden de</span>
    <div class="orden-line">${pagare.beneficiario}</div>
    <div class="fecha-vence">
      <span>el día</span>
      <div class="fval">${dia}</div>
      <span>de</span>
      <div class="fval fval-mes">${mes}</div>
      <span>de</span>
      <div class="fval">${anio}</div>
    </div>
  </div>

  <!-- F5: La cantidad de -->
  <div class="row-cantidad">
    <span class="cantidad-lbl">La cantidad de:</span>
    <div class="cantidad-box">$ ${monto} MXN</div>
  </div>

  <!-- F5b: Monto en letras -->
  <div class="row-letras">
    <span class="letras-prefix">Son:</span>
    <div class="letras-text">${montoEnLetras}</div>
  </div>

  <!-- F6: texto legal -->
  <div class="row-legal">
    VALOR RECIBIDO A MI (NUESTRA) ENTERA SATISFACCIÓN. ESTE PAGARÉ FORMA PARTE DE UNA SERIE NUMERADA DEL _____ AL _____ Y TODOS ESTÁN SUJETOS A LA CONDICIÓN DE QUE DE NO PAGARSE CUALQUIERA DE ELLOS A SU VENCIMIENTO, SERÁN EXIGIBLES TODOS LOS QUE LE SIGAN EN NÚMERO, ADEMÁS DE LOS YA VENCIDOS DE ACUERDO AL ART. 79 DE LA LEY GENERAL DE TÍTULOS Y OPERACIONES DE CRÉDITO. CAUSARÁN INTERESES MORATORIOS DEL ${pagare.interesMoratorio}% POR CADA MES O FRACCIÓN PAGADERO JUNTAMENTE CON EL PRINCIPAL. DICHOS INTERESES SE CAUSARÁN SOBRE EL CAPITAL INSOLUTO, CONFORME A LO DISPUESTO POR EL ART. 152 INCISO I, II, III, IV DE LA LEY GENERAL DE TÍTULOS Y OPERACIONES DE CRÉDITO.
  </div>

  <!-- F7: banda -->
  <div class="row-banda">
    <div class="banda-deudor"><span class="banda-lbl">Nombre y datos del deudor</span></div>
    <div class="banda-aval"><span class="banda-lbl">Aval</span></div>
    <div class="banda-deudorr"><span class="banda-lbl">Deudor</span></div>
  </div>

  <!-- F8: nombre/domicilio/población + firmas -->
  <div class="row-bottom">
    <div class="col-ndf">
      <div class="ndf-field">
        <div class="ndf-val">${pagare.nombreDeudor}</div>
        <span class="lbl">Nombre completo</span>
      </div>
      <div class="ndf-field">
        <div class="ndf-val">${pagare.direccionDeudor}</div>
        <span class="lbl">Domicilio</span>
      </div>
      <div class="ndf-field" style="border-bottom:none;">
        <div class="ndf-val">${pagare.poblacionDeudor}</div>
        <span class="lbl">Ciudad / Población</span>
      </div>
    </div>
    <div class="col-firma">
      <div class="firma-line"></div>
      <span class="firma-caption">Firma del Aval</span>
    </div>
    <div class="col-firma" style="border-right:none;">
      <div class="firma-line"></div>
      <span class="firma-caption">Firma del Deudor</span>
    </div>
  </div>`;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Pagaré ${pagare.numero}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{
    background:#c8c8c8;
    display:flex;flex-direction:column;align-items:center;
    padding:24px 16px;
    font-family:'Arial Narrow',Arial,sans-serif;
  }
  .toolbar{display:flex;gap:10px;margin-bottom:16px;}
  .toolbar button{padding:7px 18px;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}
  .btn-print{background:#042C53;color:#fff;}
  .btn-print:hover{background:#0C447C;}
  .btn-close{background:#E5E3DC;color:#5F5E5A;}
  .btn-close:hover{background:#D3D1C7;}

  /* Hoja carta vertical */
  .sheet{
    background:white;
    width:21.59cm;height:27.94cm;
    display:flex;flex-direction:column;
    border:1px solid #999;
    box-shadow:0 2px 12px rgba(0,0,0,.25);
    overflow:hidden;
  }

  /* Pagaré = tamaño fijo compacto */
  .pagare{
    height:14cm;flex-shrink:0;
    background:#f0f7f0;
    border:2.5px solid #2a6040;
    position:relative;overflow:hidden;
    display:flex;flex-direction:column;
    box-shadow:inset 0 0 0 1px rgba(42,96,64,.12);
  }
  .pagare::before{
    content:'';position:absolute;inset:0;
    background-image:
      repeating-linear-gradient(45deg,rgba(42,96,64,.06) 0,rgba(42,96,64,.06) 1px,transparent 0,transparent 50%),
      repeating-linear-gradient(-45deg,rgba(42,96,64,.06) 0,rgba(42,96,64,.06) 1px,transparent 0,transparent 50%);
    background-size:8px 8px;pointer-events:none;z-index:0;
  }
  .pagare>*{position:relative;z-index:1;}

  /* ── FILA 1: encabezado superior ── */
  .row-header{
    display:flex;align-items:stretch;
    border-bottom:2.5px solid #2a6040;
    flex-shrink:0;
    background:rgba(26,58,40,.03);
  }
  .h-title{
    background:linear-gradient(160deg,#1a3a28 0%,#2d6045 100%);
    color:#e8f4ec;
    font-size:18px;font-weight:900;letter-spacing:3px;
    text-transform:uppercase;
    padding:6px 14px;
    display:flex;align-items:center;flex-shrink:0;
    font-family:'Times New Roman',serif;
    border-right:2.5px solid #2a6040;
    min-width:96px;
  }
  .h-lugar{
    flex:1;padding:3px 10px;
    border-right:1.5px solid #2a6040;
    display:flex;flex-direction:column;justify-content:flex-end;
  }
  .h-dia,.h-mes,.h-anio{
    padding:3px 8px;
    border-right:1.5px solid #2a6040;
    display:flex;flex-direction:column;justify-content:flex-end;
    min-width:48px;
  }
  .h-bueno{
    padding:3px 10px;
    display:flex;flex-direction:column;justify-content:flex-end;
    min-width:100px;
    background:rgba(42,96,64,.06);
  }
  .lbl{font-size:6.5px;font-weight:700;color:#2a6040;text-transform:uppercase;letter-spacing:.5px;}
  .val{font-size:11px;color:#111;border-bottom:1px solid #2a6040;min-height:14px;padding-bottom:1px;}
  .val-bold{font-weight:700;}
  .val-monto{font-size:12px;font-weight:900;color:#1a3a28;}
  .val-num{font-size:11px;font-weight:700;color:#1a3a28;min-width:80px;}

  /* ── FILA 2: No. ── */
  .row-no{
    display:flex;align-items:stretch;
    border-bottom:1.5px solid #2a6040;
    flex-shrink:0;
  }
  .no-cell{
    padding:3px 10px;border-right:1.5px solid #2a6040;
    display:flex;align-items:center;gap:8px;
    flex-shrink:0;
  }
  .no-cell .lbl{font-size:8px;}

  /* ── FILA 3: promesa de pago ── */
  .row-promesa{
    padding:4px 10px;
    border-bottom:1px solid #2a6040;
    font-size:8px;color:#333;line-height:1.5;
    font-style:italic;
    flex-shrink:0;
  }

  /* ── FILA 4: a la orden de + fecha vencimiento ── */
  .row-orden{
    display:flex;align-items:flex-end;
    padding:3px 10px;gap:6px;
    border-bottom:1.5px solid #2a6040;
    font-size:8px;color:#333;
    flex-shrink:0;
  }
  .orden-line{border-bottom:1.5px solid #1a3a28;flex:1;min-width:80px;height:16px;padding:0 4px;font-size:11px;font-weight:700;color:#1a3a28;}
  .fecha-vence{display:flex;align-items:flex-end;gap:4px;margin-left:auto;font-size:8px;white-space:nowrap;}
  .fecha-vence .fval{border-bottom:1.5px solid #1a3a28;min-width:28px;height:16px;padding:0 3px;font-size:11px;font-weight:700;color:#1a3a28;text-align:center;}
  .fecha-vence .fval-mes{min-width:58px;}

  /* ── FILA 5: La cantidad de ── */
  .row-cantidad{
    display:flex;align-items:center;
    padding:4px 10px;gap:12px;
    border-bottom:1px solid #2a6040;
    flex-shrink:0;
    background:rgba(255,255,255,.35);
  }
  .cantidad-lbl{font-size:12px;font-weight:900;color:#1a3a28;text-transform:uppercase;letter-spacing:.8px;white-space:nowrap;}
  .cantidad-box{
    border:2px solid #2a6040;
    border-radius:2px;
    padding:3px 14px;
    font-size:16px;font-weight:900;color:#1a3a28;
    background:rgba(255,255,255,.7);
    letter-spacing:.5px;
  }

  /* ── FILA 5b: Monto en letras ── */
  .row-letras{
    display:flex;align-items:center;
    padding:3px 10px;gap:8px;
    border-bottom:1.5px solid #2a6040;
    flex-shrink:0;
    background:rgba(42,96,64,.05);
  }
  .letras-prefix{font-size:7.5px;font-weight:900;color:#1a3a28;text-transform:uppercase;white-space:nowrap;letter-spacing:.5px;}
  .letras-text{font-size:9px;font-weight:700;color:#1a3a28;letter-spacing:.3px;flex:1;}

  /* ── FILA 6: texto legal ── */
  .row-legal{
    padding:4px 10px;
    font-size:5.5px;color:#2a6040;line-height:1.6;
    text-align:justify;
    border-bottom:2px solid #2a6040;
    flex-shrink:0;
  }

  /* ── FILA 7: banda deudor/aval ── */
  .row-banda{
    display:flex;align-items:stretch;
    border-bottom:1px solid #2a6040;
    flex-shrink:0;
    background:rgba(42,96,64,.08);
  }
  .banda-deudor{
    flex:2;padding:3px 10px;
    border-right:1.5px solid #2a6040;
    display:flex;align-items:center;
  }
  .banda-aval,.banda-deudorr{
    flex:1;padding:3px 10px;
    border-right:1.5px solid #2a6040;
    display:flex;align-items:center;
  }
  .banda-deudorr{border-right:none;}
  .banda-lbl{font-size:7px;font-weight:900;color:#1a3a28;text-transform:uppercase;letter-spacing:.5px;}

  /* ── FILA 8: campos nombre/domicilio/poblacion + firmas ── */
  .row-bottom{
    display:flex;align-items:stretch;
    flex:1;
  }
  .col-ndf{
    flex:2;border-right:1.5px solid #2a6040;
    display:flex;flex-direction:column;
  }
  .ndf-field{
    flex:1;border-bottom:1px solid #2a6040;
    padding:0 10px 4px;
    display:flex;flex-direction:column;justify-content:flex-end;
  }
  .ndf-val{
    font-size:10.5px;font-weight:600;color:#111;
    border-bottom:1.5px solid #1a3a28;
    padding-bottom:1px;margin-bottom:2px;
    min-height:14px;
  }
  .col-firma{
    flex:1;border-right:1.5px solid #2a6040;
    padding:6px 10px 5px;
    display:flex;flex-direction:column;justify-content:flex-end;
  }
  .firma-line{
    border-top:1.5px solid #1a3a28;
    margin-bottom:3px;
  }
  .firma-caption{
    font-size:6.5px;font-weight:700;color:#1a3a28;
    text-transform:uppercase;text-align:center;letter-spacing:.4px;
  }

  @page{size:21.59cm 27.94cm;margin:0;}
  @media print{
    *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important;}
    html,body{width:21.59cm;height:27.94cm;background:white;padding:0;margin:0;overflow:hidden;}
    .toolbar{display:none!important;}
    .sheet{width:21.59cm;height:27.94cm;border:none;box-shadow:none;}
    .pagare{height:14cm!important;display:flex!important;}
  }
</style>
</head>
<body>

<div class="toolbar">
  <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
  <button class="btn-close" onclick="window.close()">Cerrar</button>
</div>

<div class="sheet">

<div class="pagare">
${cuerpo}
</div>

</div>

</body>
</html>`;
};

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
