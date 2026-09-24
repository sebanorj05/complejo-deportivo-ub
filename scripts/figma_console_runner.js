(async () => {
  function hexToRgb(hex) {
    const cleanHex = hex.replace('#', '');
    return {
      r: parseInt(cleanHex.substring(0, 2), 16) / 255,
      g: parseInt(cleanHex.substring(2, 4), 16) / 255,
      b: parseInt(cleanHex.substring(4, 6), 16) / 255
    };
  }

  // 1. Manejar Pagina 'Componentes'
  let compPage = figma.root.children.find(p => p.name === 'Componentes');
  if (!compPage) {
    compPage = figma.createPage();
    compPage.name = 'Componentes';
  }
  figma.currentPage = compPage;

  // 2. Generar y guardar estilos de color nativos (Local Styles)
  const colorPalette = [
    { name: 'Primary', hex: '#65C556' },
    { name: 'Secondary', hex: '#689E5F' },
    { name: 'Accent', hex: '#57EF40' },
    { name: 'Neutral', hex: '#5A7056' },
    { name: 'Dark Text', hex: '#3D463C' },
    { name: 'Deep Bg', hex: '#293827' }
  ];

  const localStyles = {};
  const existingStyles = figma.getLocalPaintStyles();

  for (const item of colorPalette) {
    let style = existingStyles.find(s => s.name === item.name);
    if (!style) {
      style = figma.createPaintStyle();
      style.name = item.name;
    }
    const rgb = hexToRgb(item.hex);
    style.paints = [{ type: 'SOLID', color: rgb, opacity: 1 }];
    localStyles[item.name] = style;
  }

  // 3. Cargar fuentes Inter
  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" })
  ]);

  function createButtonComponent(name, labelText, fillStyle, textColor) {
    const btn = figma.createComponent();
    btn.name = name;
    btn.layoutMode = 'HORIZONTAL';
    btn.primaryAxisSizingMode = 'AUTO';
    btn.counterAxisSizingMode = 'AUTO';
    btn.primaryAxisAlignItems = 'CENTER';
    btn.counterAxisAlignItems = 'CENTER';
    btn.paddingLeft = 24;
    btn.paddingRight = 24;
    btn.paddingTop = 12;
    btn.paddingBottom = 12;
    btn.cornerRadius = 8;
    btn.itemSpacing = 8;

    if (fillStyle) {
      btn.fillStyleId = fillStyle.id;
    }

    const text = figma.createText();
    text.fontName = { family: "Inter", style: "Semi Bold" };
    text.fontSize = 15;
    text.characters = labelText;

    if (textColor.id) {
      text.fillStyleId = textColor.id;
    } else {
      text.fills = [{ type: 'SOLID', color: textColor }];
    }

    btn.appendChild(text);
    return btn;
  }

  const startX = 100;
  const startY = 100;

  // Boton principal: Primary (#65C556), texto Deep Bg (#293827)
  const btnPrincipal = createButtonComponent(
    'Botón principal',
    'Botón principal',
    localStyles['Primary'],
    localStyles['Deep Bg']
  );
  btnPrincipal.x = startX;
  btnPrincipal.y = startY;

  // Boton oscuro: Deep Bg (#293827), texto Accent (#57EF40)
  const btnOscuro = createButtonComponent(
    'Botón oscuro',
    'Botón oscuro',
    localStyles['Deep Bg'],
    localStyles['Accent']
  );
  btnOscuro.x = startX + 220;
  btnOscuro.y = startY;

  // Boton secundario: Secondary (#689E5F), texto Blanco (#FFFFFF)
  const btnSecundario = createButtonComponent(
    'Botón secundario',
    'Botón secundario',
    localStyles['Secondary'],
    { r: 1, g: 1, b: 1 }
  );
  btnSecundario.x = startX + 440;
  btnSecundario.y = startY;

  // 4. Componente Maestro tournament-card (Auto Layout, radius 12 px)
  const tournamentCard = figma.createComponent();
  tournamentCard.name = 'tournament-card';
  tournamentCard.layoutMode = 'VERTICAL';
  tournamentCard.primaryAxisSizingMode = 'AUTO';
  tournamentCard.counterAxisSizingMode = 'FIXED';
  tournamentCard.resize(360, 240);
  tournamentCard.cornerRadius = 12;
  tournamentCard.paddingLeft = 24;
  tournamentCard.paddingRight = 24;
  tournamentCard.paddingTop = 24;
  tournamentCard.paddingBottom = 24;
  tournamentCard.itemSpacing = 16;
  tournamentCard.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  tournamentCard.strokes = [{ type: 'SOLID', color: hexToRgb('#D9E2D8') }];
  tournamentCard.strokeWeight = 1;

  tournamentCard.x = startX;
  tournamentCard.y = startY + 120;

  // Badge
  const badgeFrame = figma.createFrame();
  badgeFrame.layoutMode = 'HORIZONTAL';
  badgeFrame.primaryAxisSizingMode = 'AUTO';
  badgeFrame.counterAxisSizingMode = 'AUTO';
  badgeFrame.paddingLeft = 10;
  badgeFrame.paddingRight = 10;
  badgeFrame.paddingTop = 4;
  badgeFrame.paddingBottom = 4;
  badgeFrame.cornerRadius = 6;
  badgeFrame.fillStyleId = localStyles['Neutral'].id;

  const badgeText = figma.createText();
  badgeText.fontName = { family: "Inter", style: "Medium" };
  badgeText.fontSize = 11;
  badgeText.characters = "TORNEO OFICIAL";
  badgeText.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  badgeFrame.appendChild(badgeText);
  tournamentCard.appendChild(badgeFrame);

  // Titulo H3 (Inter SemiBold, 18 px) con color Dark Text (#3D463C)
  const h3Title = figma.createText();
  h3Title.fontName = { family: "Inter", style: "Semi Bold" };
  h3Title.fontSize = 18;
  h3Title.lineHeight = { value: 24, unit: 'PIXELS' };
  h3Title.characters = "Torneo Apertura Pádel 2026";
  h3Title.fillStyleId = localStyles['Dark Text'].id;
  h3Title.layoutAlign = 'STRETCH';
  tournamentCard.appendChild(h3Title);

  // Metadatos
  const metaInfo = figma.createText();
  metaInfo.fontName = { family: "Inter", style: "Regular" };
  metaInfo.fontSize = 13;
  metaInfo.characters = "16 Equipos • Cancha Central • Inscripciones abiertas";
  metaInfo.fillStyleId = localStyles['Neutral'].id;
  metaInfo.layoutAlign = 'STRETCH';
  tournamentCard.appendChild(metaInfo);

  // Anidar instancia de 'Boton secundario'
  const btnSecundarioInstance = btnSecundario.createInstance();
  btnSecundarioInstance.layoutAlign = 'STRETCH';
  tournamentCard.appendChild(btnSecundarioInstance);

  // Anexar a la pagina 'Componentes'
  compPage.appendChild(btnPrincipal);
  compPage.appendChild(btnOscuro);
  compPage.appendChild(btnSecundario);
  compPage.appendChild(tournamentCard);

  figma.currentPage.selection = [btnPrincipal, btnOscuro, btnSecundario, tournamentCard];
  figma.viewport.scrollAndZoomIntoView([btnPrincipal, btnOscuro, btnSecundario, tournamentCard]);

  figma.notify("✅ ¡Componentes y estilos creados exitosamente!");
})();
