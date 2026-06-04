export const generatePagareHTML = (pagare) => {
  const fecha = new Date(pagare.fechaPago);
  const dia   = fecha.getDate().toString().padStart(2, '0');
  const mes   = fecha.toLocaleDateString('es-MX', { month: 'long' });
  const anio  = fecha.getFullYear();
  const fechaExp = new Date(pagare.fechaExpedicion).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  const monto = Number(pagare.monto).toLocaleString('es-MX', {
    minimumFractionDigits: 2, maximumFractionDigits: 2
  });

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

  /* Hoja carta apaisada */
  .sheet{
    background:white;
    width:27.94cm;height:21.59cm;
    display:flex;flex-direction:column;
    border:1px solid #999;
    box-shadow:0 2px 12px rgba(0,0,0,.25);
    overflow:hidden;
  }

  /* Pagaré = mitad superior */
  .pagare{
    height:50%;flex-shrink:0;
    background:#eef5ee;
    border:2px solid #2a6040;
    position:relative;overflow:hidden;
    display:flex;flex-direction:column;
  }
  .pagare::before{
    content:'';position:absolute;inset:0;
    background-image:
      repeating-linear-gradient(45deg,rgba(100,160,120,.09) 0,rgba(100,160,120,.09) 1px,transparent 0,transparent 50%),
      repeating-linear-gradient(-45deg,rgba(100,160,120,.09) 0,rgba(100,160,120,.09) 1px,transparent 0,transparent 50%);
    background-size:8px 8px;pointer-events:none;z-index:0;
  }
  .pagare>*{position:relative;z-index:1;}

  /* ── FILA 1: encabezado superior ── */
  .row-header{
    display:flex;align-items:stretch;
    border-bottom:2px solid #2a6040;
    flex-shrink:0;
  }
  .h-title{
    background:#1a3a28;color:#eef5ee;
    font-size:14px;font-weight:900;letter-spacing:2px;
    text-transform:uppercase;
    padding:4px 10px;
    display:flex;align-items:center;flex-shrink:0;
    font-family:'Times New Roman',serif;
    border-right:2px solid #2a6040;
  }
  .h-lugar{
    flex:1;padding:2px 8px;
    border-right:1.5px solid #2a6040;
    display:flex;flex-direction:column;justify-content:flex-end;
  }
  .h-dia,.h-mes,.h-anio{
    padding:2px 8px;
    border-right:1.5px solid #2a6040;
    display:flex;flex-direction:column;justify-content:flex-end;
    min-width:52px;
  }
  .h-bueno{
    padding:2px 8px;
    display:flex;flex-direction:column;justify-content:flex-end;
    min-width:90px;
  }
  .lbl{font-size:7px;font-weight:700;color:#1a3a28;text-transform:uppercase;letter-spacing:.4px;}
  .val{font-size:11px;color:#111;border-bottom:1px solid #2a6040;min-height:14px;padding-bottom:1px;}
  .val-bold{font-weight:700;}

  /* ── FILA 2: No. ── */
  .row-no{
    display:flex;align-items:stretch;
    border-bottom:1px solid #2a6040;
    flex-shrink:0;
  }
  .no-cell{
    padding:2px 8px;border-right:1.5px solid #2a6040;
    display:flex;align-items:center;gap:6px;
    flex-shrink:0;min-width:130px;
  }
  .no-cell .lbl{font-size:8px;}
  .no-cell .val{font-size:11px;font-weight:700;min-width:60px;}
  /* separador visual para el $ */
  .no-dollar{
    margin-left:auto;padding:2px 8px;
    border-left:1.5px solid #2a6040;
    display:flex;align-items:flex-end;
    font-size:16px;font-weight:900;color:#1a3a28;
    min-width:44px;
  }

  /* ── FILA 3: promesa de pago ── */
  .row-promesa{
    padding:3px 8px;
    border-bottom:1px solid #2a6040;
    font-size:8px;color:#111;line-height:1.5;
    flex-shrink:0;
  }

  /* ── FILA 4: a la orden de + fecha vencimiento ── */
  .row-orden{
    display:flex;align-items:flex-end;
    padding:2px 8px;gap:6px;
    border-bottom:1px solid #2a6040;
    font-size:8px;color:#111;
    flex-shrink:0;
  }
  .orden-line{border-bottom:1px solid #2a6040;flex:1;min-width:80px;height:14px;padding:0 3px;font-size:10px;font-weight:700;color:#111;}
  .fecha-vence{display:flex;align-items:flex-end;gap:4px;margin-left:auto;font-size:8px;white-space:nowrap;}
  .fecha-vence .fval{border-bottom:1px solid #2a6040;min-width:28px;height:14px;padding:0 3px;font-size:10px;font-weight:700;color:#111;text-align:center;}
  .fecha-vence .fval-mes{min-width:54px;}

  /* ── FILA 5: La cantidad de ── */
  .row-cantidad{
    display:flex;align-items:center;
    padding:3px 8px;gap:10px;
    border-bottom:1px solid #2a6040;
    flex-shrink:0;
  }
  .cantidad-lbl{font-size:11px;font-weight:900;color:#1a3a28;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap;}
  .cantidad-box{
    border:1.5px solid #2a6040;
    padding:2px 10px;
    font-size:14px;font-weight:900;color:#111;
    background:rgba(255,255,255,.45);
    min-width:180px;
  }

  /* ── FILA 6: texto legal ── */
  .row-legal{
    padding:3px 8px;
    font-size:5.8px;color:#1a3a28;line-height:1.5;
    text-align:justify;
    border-bottom:1.5px solid #2a6040;
    flex-shrink:0;
  }

  /* ── FILA 7: banda "NOMBRE Y DATOS DEL DEUDOR | AVAL | DEUDOR" ── */
  .row-banda{
    display:flex;align-items:stretch;
    border-bottom:1px solid #2a6040;
    flex-shrink:0;
  }
  .banda-deudor{
    flex:2;padding:2px 8px;
    border-right:1.5px solid #2a6040;
    display:flex;align-items:center;
  }
  .banda-aval,.banda-deudorr{
    flex:1;padding:2px 8px;
    border-right:1.5px solid #2a6040;
    display:flex;align-items:center;
  }
  .banda-deudorr{border-right:none;}
  .banda-lbl{font-size:7px;font-weight:700;color:#1a3a28;text-transform:uppercase;letter-spacing:.4px;}

  /* ── FILA 8: campos nombre/domicilio/poblacion + firmas ── */
  .row-bottom{
    display:flex;align-items:stretch;
    flex:1;
  }
  /* Columna izquierda: 3 campos apilados */
  .col-ndf{
    flex:2;border-right:1.5px solid #2a6040;
    display:flex;flex-direction:column;
  }
  .ndf-field{
    flex:1;border-bottom:1px solid #2a6040;
    padding:1px 8px;
    display:flex;flex-direction:column;justify-content:flex-end;
  }
  .ndf-field:last-child{border-bottom:none;}
  .ndf-field .val{font-size:10px;}
  /* Celdas de firma */
  .col-firma{
    flex:1;border-right:1.5px solid #2a6040;
    padding:3px 8px;
    display:flex;flex-direction:column;justify-content:space-between;
  }
  .col-firma:last-child{border-right:none;}
  .firma-bottom{border-top:1px solid #2a6040;margin-top:auto;}

  @media print{
    body{background:white;padding:0;margin:0;}
    .toolbar{display:none!important;}
    .sheet{width:27.94cm;height:21.59cm;border:none;box-shadow:none;}
    .blank-half{border-top:none;}
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
      <div class="val val-bold">$ ${monto}</div>
    </div>
  </div>

  <!-- F2: No. -->
  <div class="row-no">
    <div class="no-cell">
      <span class="lbl">No.</span>
      <div class="val">${pagare.numero}</div>
    </div>
    <div class="no-dollar">$</div>
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
      <span>de *</span>
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
      <div class="ndf-field"><span class="lbl">Nombre</span><div class="val">${pagare.nombreDeudor}</div></div>
      <div class="ndf-field"><span class="lbl">Domicilio</span><div class="val">${pagare.direccionDeudor}</div></div>
      <div class="ndf-field"><span class="lbl">Población</span><div class="val">${pagare.poblacionDeudor}</div></div>
    </div>
    <div class="col-firma">
      <span class="lbl" style="font-size:7px;">Firma(s)</span>
      <div class="firma-bottom"></div>
    </div>
    <div class="col-firma">
      <span class="lbl" style="font-size:7px;">Firma(s)</span>
      <div class="firma-bottom"></div>
    </div>
  </div>

</div>
<!-- Mitad inferior en blanco -->
<div style="flex:1;background:white;border-top:1px dashed #ccc;"></div>
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