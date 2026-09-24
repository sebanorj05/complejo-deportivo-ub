// ============================================================================
// FIGMA AUTOMATION ENGINE - COMPLEJO DEPORTIVO UB
// Archivo: "proyecto de sw" (File Key: cnSF65gpDx71Wg2prZIxTS)
// Convenciones: PSP (PascalCase), Design Tokens (#293827 Deep Bg), 12px/8px radius
// ============================================================================

(async function generateComplejoUBDesignSystem() {
  console.log("⚽ [Complejo Deportivo UB] Iniciando generación de Sistema de Diseño y Pantallas...");

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    return {
      r: parseInt(clean.substring(0, 2), 16) / 255,
      g: parseInt(clean.substring(2, 4), 16) / 255,
      b: parseInt(clean.substring(4, 6), 16) / 255
    };
  }

  // 1. CARGA DE TIPOGRAFÍAS (INTER)
  let semiBoldStyle = "Semi Bold";
  try {
    await Promise.all([
      figma.loadFontAsync({ family: "Inter", style: "Regular" }),
      figma.loadFontAsync({ family: "Inter", style: "Medium" }),
      figma.loadFontAsync({ family: "Inter", style: "Bold" }),
      (async () => {
        try {
          await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
          semiBoldStyle = "Semi Bold";
        } catch (_e) {
          try {
            await figma.loadFontAsync({ family: "Inter", style: "SemiBold" });
            semiBoldStyle = "SemiBold";
          } catch (_e2) {
            semiBoldStyle = "Bold";
          }
        }
      })()
    ]);
    console.log("✓ Tipografías Inter cargadas correctamente.");
  } catch (err) {
    console.error("Error cargando fuentes Inter:", err);
    figma.notify("⚠️ Error cargando fuentes tipográficas: " + err.message);
    return;
  }

  // 2. DESIGN TOKENS (LOCAL PAINT STYLES)
  const brandTokens = [
    { name: 'Primary', hex: '#65C556' },
    { name: 'Secondary', hex: '#689E5F' },
    { name: 'Accent', hex: '#57EF40' },
    { name: 'Neutral', hex: '#5A7056' },
    { name: 'Dark Text', hex: '#3D463C' },
    { name: 'Deep Bg', hex: '#293827' },
    { name: 'Dark Surface', hex: '#1E281D' },
    { name: 'Dark Card', hex: '#222E21' },
    { name: 'Danger', hex: '#E53E3E' }
  ];

  const localStyles = {};
  const existingStyles = figma.getLocalPaintStyles();

  for (const item of brandTokens) {
    let s = existingStyles.find(st => st.name === item.name);
    if (!s) {
      s = figma.createPaintStyle();
      s.name = item.name;
    }
    s.paints = [{ type: 'SOLID', color: hexToRgb(item.hex), opacity: 1 }];
    localStyles[item.name] = s;
  }
  console.log("✓ Estilos locales de color creados/sincronizados.");

  const primaryRgb = hexToRgb('#65C556');
  const secondaryRgb = hexToRgb('#689E5F');
  const accentRgb = hexToRgb('#57EF40');
  const neutralRgb = hexToRgb('#5A7056');
  const deepBgRgb = hexToRgb('#293827');
  const darkSurfaceRgb = hexToRgb('#1E281D');
  const darkCardRgb = hexToRgb('#222E21');
  const dangerRgb = hexToRgb('#E53E3E');
  const whiteRgb = { r: 1, g: 1, b: 1 };
  const lightMutedRgb = hexToRgb('#A3B8A1');

  // Helper para aplicar color
  function setFill(node, styleName, fallbackRgb, opacity = 1) {
    if (localStyles[styleName]) {
      node.fillStyleId = localStyles[styleName].id;
    } else {
      node.fills = [{ type: 'SOLID', color: fallbackRgb, opacity }];
    }
  }

  function setStroke(node, styleName, fallbackRgb, weight = 1) {
    if (localStyles[styleName]) {
      node.strokeStyleId = localStyles[styleName].id;
    } else {
      node.strokes = [{ type: 'SOLID', color: fallbackRgb }];
    }
    node.strokeWeight = weight;
  }

  // Asegurar carga asíncrona de páginas para Figma DocumentAccess
  if (typeof figma.loadAllPagesAsync === 'function') {
    await figma.loadAllPagesAsync();
  }

  // 3. PÁGINA: "Componentes"
  let compPage = figma.root.children.find(p => p.name === 'Componentes');
  if (!compPage) {
    compPage = figma.createPage();
    compPage.name = 'Componentes';
  }

  // 4. PÁGINA: "Pantallas - Complejo UB"
  let screensPage = figma.root.children.find(p => p.name === 'Pantallas - Complejo UB');
  if (!screensPage) {
    screensPage = figma.createPage();
    screensPage.name = 'Pantallas - Complejo UB';
  }

  // Limpiar componentes previos en compPage si se re-ejecuta
  const componentsToClean = ['RoleSelector', 'LoginForm', 'AdminSidebar', 'AdminActionBtn', 'BookingCard', 'TournamentModal'];
  for (const name of componentsToClean) {
    const existing = compPage.children.find(c => c.name === name);
    if (existing) existing.remove();
  }

  figma.currentPage = compPage;

  // ==========================================================================
  // COMPONENTE MAESTRO 1: RoleSelector (❖ PascalCase)
  // ==========================================================================
  const roleSelector = figma.createComponent();
  roleSelector.name = 'RoleSelector';
  roleSelector.layoutMode = 'HORIZONTAL';
  roleSelector.primaryAxisSizingMode = 'FIXED';
  roleSelector.counterAxisSizingMode = 'AUTO';
  roleSelector.resize(360, 44);
  roleSelector.paddingLeft = 4;
  roleSelector.paddingRight = 4;
  roleSelector.paddingTop = 4;
  roleSelector.paddingBottom = 4;
  roleSelector.itemSpacing = 4;
  roleSelector.cornerRadius = 8;
  setFill(roleSelector, 'Dark Surface', darkSurfaceRgb);
  setStroke(roleSelector, 'Neutral', neutralRgb, 1);
  roleSelector.x = 80;
  roleSelector.y = 80;

  const roles = [
    { label: 'Cliente / Capitán', active: true },
    { label: 'Administrador', active: false },
    { label: 'Árbitro', active: false }
  ];

  for (const r of roles) {
    const tab = figma.createFrame();
    tab.name = 'Tab-' + r.label;
    tab.layoutMode = 'HORIZONTAL';
    tab.layoutGrow = 1;
    tab.primaryAxisSizingMode = 'AUTO';
    tab.counterAxisSizingMode = 'AUTO';
    tab.primaryAxisAlignItems = 'CENTER';
    tab.counterAxisAlignItems = 'CENTER';
    tab.paddingTop = 8;
    tab.paddingBottom = 8;
    tab.paddingLeft = 6;
    tab.paddingRight = 6;
    tab.cornerRadius = 6;

    const txt = figma.createText();
    txt.characters = r.label;
    txt.fontSize = 12;

    if (r.active) {
      setFill(tab, 'Primary', primaryRgb);
      txt.fontName = { family: "Inter", style: semiBoldStyle };
      setFill(txt, 'Deep Bg', deepBgRgb);
    } else {
      tab.fills = [];
      txt.fontName = { family: "Inter", style: "Medium" };
      txt.fills = [{ type: 'SOLID', color: lightMutedRgb }];
    }
    tab.appendChild(txt);
    roleSelector.appendChild(tab);
  }
  compPage.appendChild(roleSelector);

  // Helper para crear inputs reutilizables
  function createInputFrame(labelStr, placeholderStr, isPassword = false) {
    const field = figma.createFrame();
    field.name = 'Field-' + labelStr;
    field.layoutMode = 'VERTICAL';
    field.itemSpacing = 6;
    field.layoutAlign = 'STRETCH';
    field.fills = [];

    const labelRow = figma.createFrame();
    labelRow.name = 'LabelRow';
    labelRow.layoutMode = 'HORIZONTAL';
    labelRow.layoutAlign = 'STRETCH';
    labelRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
    labelRow.counterAxisAlignItems = 'CENTER';
    labelRow.fills = [];

    const labelTxt = figma.createText();
    labelTxt.fontName = { family: "Inter", style: "Medium" };
    labelTxt.fontSize = 12;
    labelTxt.characters = labelStr;
    labelTxt.fills = [{ type: 'SOLID', color: whiteRgb }];
    labelRow.appendChild(labelTxt);

    if (isPassword) {
      const forgot = figma.createText();
      forgot.fontName = { family: "Inter", style: "Medium" };
      forgot.fontSize = 11;
      forgot.characters = "¿Olvidaste tu contraseña?";
      setFill(forgot, 'Primary', primaryRgb);
      labelRow.appendChild(forgot);
    }
    field.appendChild(labelRow);

    const box = figma.createFrame();
    box.name = 'InputBox';
    box.layoutMode = 'HORIZONTAL';
    box.layoutAlign = 'STRETCH';
    box.counterAxisSizingMode = 'FIXED';
    box.resize(100, 44);
    box.paddingLeft = 14;
    box.paddingRight = 14;
    box.counterAxisAlignItems = 'CENTER';
    box.cornerRadius = 8; // PSP: 8px para inputs
    setFill(box, 'Dark Surface', darkSurfaceRgb);
    setStroke(box, 'Neutral', neutralRgb, 1);

    const ph = figma.createText();
    ph.fontName = { family: "Inter", style: "Regular" };
    ph.fontSize = 13;
    ph.characters = placeholderStr;
    ph.fills = [{ type: 'SOLID', color: hexToRgb('#7A8F76') }];
    box.appendChild(ph);

    field.appendChild(box);
    return field;
  }

  // ==========================================================================
  // COMPONENTE MAESTRO 2: LoginForm (❖ PascalCase, RF-01)
  // ==========================================================================
  const loginForm = figma.createComponent();
  loginForm.name = 'LoginForm';
  loginForm.layoutMode = 'VERTICAL';
  loginForm.primaryAxisSizingMode = 'AUTO';
  loginForm.counterAxisSizingMode = 'FIXED';
  loginForm.resize(400, 500);
  loginForm.paddingLeft = 32;
  loginForm.paddingRight = 32;
  loginForm.paddingTop = 32;
  loginForm.paddingBottom = 32;
  loginForm.itemSpacing = 20;
  loginForm.cornerRadius = 12; // PSP: 12px para tarjetas principales
  setFill(loginForm, 'Deep Bg', deepBgRgb);
  setStroke(loginForm, 'Neutral', neutralRgb, 1);
  loginForm.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.4 },
    offset: { x: 0, y: 10 },
    radius: 30,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL'
  }];
  loginForm.x = 480;
  loginForm.y = 80;

  // Header
  const lHeader = figma.createFrame();
  lHeader.name = 'Header';
  lHeader.layoutMode = 'VERTICAL';
  lHeader.itemSpacing = 6;
  lHeader.layoutAlign = 'STRETCH';
  lHeader.fills = [];

  const lTitle = figma.createText();
  lTitle.fontName = { family: "Inter", style: "Bold" };
  lTitle.fontSize = 24;
  lTitle.characters = "Iniciar Sesión";
  setFill(lTitle, 'Primary', primaryRgb);
  lHeader.appendChild(lTitle);

  const lSubtitle = figma.createText();
  lSubtitle.fontName = { family: "Inter", style: "Regular" };
  lSubtitle.fontSize = 13;
  lSubtitle.characters = "Ingresá a tu cuenta de Complejo Deportivo UB";
  lSubtitle.fills = [{ type: 'SOLID', color: lightMutedRgb }];
  lHeader.appendChild(lSubtitle);
  loginForm.appendChild(lHeader);

  // Selector de roles anidado
  const roleInst = roleSelector.createInstance();
  roleInst.name = 'RoleSelectorInstance';
  roleInst.layoutAlign = 'STRETCH';
  loginForm.appendChild(roleInst);

  // Inputs
  loginForm.appendChild(createInputFrame("Correo electrónico", "usuario@ejemplo.com", false));
  loginForm.appendChild(createInputFrame("Contraseña", "••••••••••••", true));

  // Botón Submit (8px radius)
  const submitBtn = figma.createFrame();
  submitBtn.name = 'SubmitButton';
  submitBtn.layoutMode = 'HORIZONTAL';
  submitBtn.layoutAlign = 'STRETCH';
  submitBtn.counterAxisSizingMode = 'FIXED';
  submitBtn.resize(100, 46);
  submitBtn.primaryAxisAlignItems = 'CENTER';
  submitBtn.counterAxisAlignItems = 'CENTER';
  submitBtn.cornerRadius = 8;
  setFill(submitBtn, 'Primary', primaryRgb);

  const submitTxt = figma.createText();
  submitTxt.fontName = { family: "Inter", style: semiBoldStyle };
  submitTxt.fontSize = 15;
  submitTxt.characters = "Ingresar al Complejo";
  setFill(submitTxt, 'Deep Bg', deepBgRgb);
  submitBtn.appendChild(submitTxt);
  loginForm.appendChild(submitBtn);

  // Footer registro
  const lFooter = figma.createFrame();
  lFooter.name = 'Footer';
  lFooter.layoutMode = 'HORIZONTAL';
  lFooter.layoutAlign = 'STRETCH';
  lFooter.primaryAxisAlignItems = 'CENTER';
  lFooter.fills = [];

  const lFooterTxt = figma.createText();
  lFooterTxt.fontName = { family: "Inter", style: "Regular" };
  lFooterTxt.fontSize = 12;
  lFooterTxt.characters = "¿No tienes una cuenta? Regístrate aquí";
  lFooterTxt.fills = [{ type: 'SOLID', color: lightMutedRgb }];
  lFooter.appendChild(lFooterTxt);
  loginForm.appendChild(lFooter);

  compPage.appendChild(loginForm);

  // ==========================================================================
  // COMPONENTE MAESTRO 3: AdminSidebar (❖ PascalCase)
  // ==========================================================================
  const adminSidebar = figma.createComponent();
  adminSidebar.name = 'AdminSidebar';
  adminSidebar.layoutMode = 'VERTICAL';
  adminSidebar.primaryAxisSizingMode = 'FIXED';
  adminSidebar.counterAxisSizingMode = 'FIXED';
  adminSidebar.resize(260, 800);
  adminSidebar.paddingLeft = 20;
  adminSidebar.paddingRight = 20;
  adminSidebar.paddingTop = 28;
  adminSidebar.paddingBottom = 28;
  adminSidebar.itemSpacing = 24;
  adminSidebar.cornerRadius = 12;
  setFill(adminSidebar, 'Dark Surface', darkSurfaceRgb);
  setStroke(adminSidebar, 'Neutral', neutralRgb, 1);
  adminSidebar.x = 920;
  adminSidebar.y = 80;

  // Logo Brand
  const brandFrame = figma.createFrame();
  brandFrame.name = 'BrandLogo';
  brandFrame.layoutMode = 'HORIZONTAL';
  brandFrame.itemSpacing = 10;
  brandFrame.layoutAlign = 'STRETCH';
  brandFrame.counterAxisAlignItems = 'CENTER';
  brandFrame.fills = [];

  const brandIcon = figma.createFrame();
  brandIcon.name = 'BrandIcon';
  brandIcon.layoutMode = 'HORIZONTAL';
  brandIcon.primaryAxisAlignItems = 'CENTER';
  brandIcon.counterAxisAlignItems = 'CENTER';
  brandIcon.resize(32, 32);
  brandIcon.cornerRadius = 8;
  setFill(brandIcon, 'Primary', primaryRgb);
  const brandIconTxt = figma.createText();
  brandIconTxt.fontName = { family: "Inter", style: "Bold" };
  brandIconTxt.fontSize = 16;
  brandIconTxt.characters = "UB";
  setFill(brandIconTxt, 'Deep Bg', deepBgRgb);
  brandIcon.appendChild(brandIconTxt);
  brandFrame.appendChild(brandIcon);

  const brandName = figma.createText();
  brandName.fontName = { family: "Inter", style: "Bold" };
  brandName.fontSize = 15;
  brandName.characters = "Complejo UB";
  brandName.fills = [{ type: 'SOLID', color: whiteRgb }];
  brandFrame.appendChild(brandName);
  adminSidebar.appendChild(brandFrame);

  // Menú de navegación
  const navContainer = figma.createFrame();
  navContainer.name = 'NavMenu';
  navContainer.layoutMode = 'VERTICAL';
  navContainer.itemSpacing = 6;
  navContainer.layoutAlign = 'STRETCH';
  navContainer.layoutGrow = 1;
  navContainer.fills = [];

  const menuItems = [
    { icon: '📅', label: 'Agenda Diaria', active: true },
    { icon: '⚽', label: 'Gestión de Canchas', active: false },
    { icon: '🏆', label: 'Organizar Torneo', active: false },
    { icon: '📝', label: 'Cargar Resultados', active: false }
  ];

  for (const item of menuItems) {
    const navItem = figma.createFrame();
    navItem.name = 'NavItem-' + item.label;
    navItem.layoutMode = 'HORIZONTAL';
    navItem.itemSpacing = 12;
    navItem.layoutAlign = 'STRETCH';
    navItem.paddingTop = 11;
    navItem.paddingBottom = 11;
    navItem.paddingLeft = 14;
    navItem.paddingRight = 14;
    navItem.cornerRadius = 8;
    navItem.counterAxisAlignItems = 'CENTER';

    if (item.active) {
      setFill(navItem, 'Primary', primaryRgb, 0.15);
      setStroke(navItem, 'Primary', primaryRgb, 1);
    } else {
      navItem.fills = [];
    }

    const itemIcon = figma.createText();
    itemIcon.fontName = { family: "Inter", style: "Regular" };
    itemIcon.fontSize = 14;
    itemIcon.characters = item.icon;
    navItem.appendChild(itemIcon);

    const itemTxt = figma.createText();
    itemTxt.fontSize = 13;
    itemTxt.characters = item.label;

    if (item.active) {
      itemTxt.fontName = { family: "Inter", style: semiBoldStyle };
      setFill(itemTxt, 'Primary', primaryRgb);
    } else {
      itemTxt.fontName = { family: "Inter", style: "Medium" };
      itemTxt.fills = [{ type: 'SOLID', color: lightMutedRgb }];
    }
    navItem.appendChild(itemTxt);
    navContainer.appendChild(navItem);
  }
  adminSidebar.appendChild(navContainer);

  // Admin user footer
  const adminUser = figma.createFrame();
  adminUser.name = 'AdminUser';
  adminUser.layoutMode = 'HORIZONTAL';
  adminUser.itemSpacing = 10;
  adminUser.layoutAlign = 'STRETCH';
  adminUser.paddingTop = 12;
  adminUser.paddingBottom = 12;
  adminUser.paddingLeft = 12;
  adminUser.paddingRight = 12;
  adminUser.cornerRadius = 8;
  setFill(adminUser, 'Deep Bg', deepBgRgb);
  setStroke(adminUser, 'Neutral', neutralRgb, 1);
  adminUser.counterAxisAlignItems = 'CENTER';

  const avatar = figma.createFrame();
  avatar.name = 'Avatar';
  avatar.layoutMode = 'HORIZONTAL';
  avatar.primaryAxisAlignItems = 'CENTER';
  avatar.counterAxisAlignItems = 'CENTER';
  avatar.resize(32, 32);
  avatar.cornerRadius = 16;
  setFill(avatar, 'Secondary', secondaryRgb);

  const avTxt = figma.createText();
  avTxt.fontName = { family: "Inter", style: "Bold" };
  avTxt.fontSize = 13;
  avTxt.characters = "AD";
  avTxt.fills = [{ type: 'SOLID', color: whiteRgb }];
  avatar.appendChild(avTxt);
  adminUser.appendChild(avatar);

  const uInfo = figma.createFrame();
  uInfo.layoutMode = 'VERTICAL';
  uInfo.itemSpacing = 2;
  uInfo.fills = [];

  const uName = figma.createText();
  uName.fontName = { family: "Inter", style: semiBoldStyle };
  uName.fontSize = 12;
  uName.characters = "Admin Central";
  uName.fills = [{ type: 'SOLID', color: whiteRgb }];
  uInfo.appendChild(uName);

  const uRole = figma.createText();
  uRole.fontName = { family: "Inter", style: "Regular" };
  uRole.fontSize = 10;
  uRole.characters = "Superadministrador";
  setFill(uRole, 'Accent', accentRgb);
  uInfo.appendChild(uRole);

  adminUser.appendChild(uInfo);
  adminSidebar.appendChild(adminUser);
  compPage.appendChild(adminSidebar);

  // ==========================================================================
  // COMPONENTE MAESTRO 4: AdminActionBtn (❖ Component Set con Variantes)
  // ==========================================================================
  const btnAsignar = figma.createComponent();
  btnAsignar.name = 'Action=AsignarTurno, Variant=Primary';
  btnAsignar.layoutMode = 'HORIZONTAL';
  btnAsignar.primaryAxisSizingMode = 'AUTO';
  btnAsignar.counterAxisSizingMode = 'AUTO';
  btnAsignar.primaryAxisAlignItems = 'CENTER';
  btnAsignar.counterAxisAlignItems = 'CENTER';
  btnAsignar.paddingLeft = 18;
  btnAsignar.paddingRight = 18;
  btnAsignar.paddingTop = 11;
  btnAsignar.paddingBottom = 11;
  btnAsignar.cornerRadius = 8;
  btnAsignar.itemSpacing = 8;
  setFill(btnAsignar, 'Primary', primaryRgb);

  const plusTxt = figma.createText();
  plusTxt.fontName = { family: "Inter", style: "Bold" };
  plusTxt.fontSize = 16;
  plusTxt.characters = "+";
  setFill(plusTxt, 'Deep Bg', deepBgRgb);
  btnAsignar.appendChild(plusTxt);

  const asigTxt = figma.createText();
  asigTxt.fontName = { family: "Inter", style: semiBoldStyle };
  asigTxt.fontSize = 13;
  asigTxt.characters = "Asignar Turno Manual";
  setFill(asigTxt, 'Deep Bg', deepBgRgb);
  btnAsignar.appendChild(asigTxt);

  const btnBloquear = figma.createComponent();
  btnBloquear.name = 'Action=BloquearMantenimiento, Variant=Secondary';
  btnBloquear.layoutMode = 'HORIZONTAL';
  btnBloquear.primaryAxisSizingMode = 'AUTO';
  btnBloquear.counterAxisSizingMode = 'AUTO';
  btnBloquear.primaryAxisAlignItems = 'CENTER';
  btnBloquear.counterAxisAlignItems = 'CENTER';
  btnBloquear.paddingLeft = 18;
  btnBloquear.paddingRight = 18;
  btnBloquear.paddingTop = 11;
  btnBloquear.paddingBottom = 11;
  btnBloquear.cornerRadius = 8;
  btnBloquear.itemSpacing = 8;
  setFill(btnBloquear, 'Deep Bg', deepBgRgb);
  setStroke(btnBloquear, 'Secondary', secondaryRgb, 1.5);

  const warnTxt = figma.createText();
  warnTxt.fontName = { family: "Inter", style: "Bold" };
  warnTxt.fontSize = 14;
  warnTxt.characters = "⊘";
  setFill(warnTxt, 'Accent', accentRgb);
  btnBloquear.appendChild(warnTxt);

  const bloqTxt = figma.createText();
  bloqTxt.fontName = { family: "Inter", style: semiBoldStyle };
  bloqTxt.fontSize = 13;
  bloqTxt.characters = "Bloquear Mantenimiento";
  bloqTxt.fills = [{ type: 'SOLID', color: whiteRgb }];
  btnBloquear.appendChild(bloqTxt);

  compPage.appendChild(btnAsignar);
  compPage.appendChild(btnBloquear);
  btnAsignar.x = 80;
  btnAsignar.y = 160;
  btnBloquear.x = 80;
  btnBloquear.y = 230;

  const adminActionBtnSet = figma.combineAsVariants([btnAsignar, btnBloquear], compPage);
  adminActionBtnSet.name = 'AdminActionBtn';
  adminActionBtnSet.cornerRadius = 12;
  adminActionBtnSet.paddingLeft = 16;
  adminActionBtnSet.paddingRight = 16;
  adminActionBtnSet.paddingTop = 16;
  adminActionBtnSet.paddingBottom = 16;
  adminActionBtnSet.itemSpacing = 12;
  setFill(adminActionBtnSet, 'Dark Surface', darkSurfaceRgb);
  setStroke(adminActionBtnSet, 'Neutral', neutralRgb, 1);
  adminActionBtnSet.x = 80;
  adminActionBtnSet.y = 160;

  // ==========================================================================
  // COMPONENTE MAESTRO 5: BookingCard (❖ PascalCase, Perfil Cliente / Mis Reservas)
  // Con botón rojo de acción estandarizado "Cancelar turno"
  // ==========================================================================
  const bookingCard = figma.createComponent();
  bookingCard.name = 'BookingCard';
  bookingCard.layoutMode = 'VERTICAL';
  bookingCard.primaryAxisSizingMode = 'AUTO';
  bookingCard.counterAxisSizingMode = 'FIXED';
  bookingCard.resize(420, 220);
  bookingCard.paddingLeft = 20;
  bookingCard.paddingRight = 20;
  bookingCard.paddingTop = 20;
  bookingCard.paddingBottom = 20;
  bookingCard.itemSpacing = 16;
  bookingCard.cornerRadius = 12; // PSP: 12px
  setFill(bookingCard, 'Dark Surface', darkSurfaceRgb);
  setStroke(bookingCard, 'Neutral', neutralRgb, 1);
  bookingCard.x = 80;
  bookingCard.y = 360;

  // Top row (Cancha y Badge de Deporte)
  const bTopRow = figma.createFrame();
  bTopRow.layoutMode = 'HORIZONTAL';
  bTopRow.layoutAlign = 'STRETCH';
  bTopRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
  bTopRow.counterAxisAlignItems = 'CENTER';
  bTopRow.fills = [];

  const bCourtTitle = figma.createText();
  bCourtTitle.fontName = { family: "Inter", style: "Bold" };
  bCourtTitle.fontSize = 17;
  bCourtTitle.characters = "Cancha 1 - Fútbol 5";
  bCourtTitle.fills = [{ type: 'SOLID', color: whiteRgb }];
  bTopRow.appendChild(bCourtTitle);

  const bBadge = figma.createFrame();
  bBadge.name = 'StatusBadge';
  bBadge.layoutMode = 'HORIZONTAL';
  bBadge.primaryAxisAlignItems = 'CENTER';
  bBadge.counterAxisAlignItems = 'CENTER';
  bBadge.paddingLeft = 8;
  bBadge.paddingRight = 8;
  bBadge.paddingTop = 4;
  bBadge.paddingBottom = 4;
  bBadge.cornerRadius = 6;
  setFill(bBadge, 'Primary', primaryRgb, 0.15);
  setStroke(bBadge, 'Primary', primaryRgb, 1);

  const bBadgeTxt = figma.createText();
  bBadgeTxt.fontName = { family: "Inter", style: semiBoldStyle };
  bBadgeTxt.fontSize = 11;
  bBadgeTxt.characters = "Confirmado";
  setFill(bBadgeTxt, 'Primary', primaryRgb);
  bBadge.appendChild(bBadgeTxt);
  bTopRow.appendChild(bBadge);
  bookingCard.appendChild(bTopRow);

  // Middle info (Fecha, Hora, Superficie, Precio)
  const bMidFrame = figma.createFrame();
  bMidFrame.layoutMode = 'VERTICAL';
  bMidFrame.itemSpacing = 6;
  bMidFrame.layoutAlign = 'STRETCH';
  bMidFrame.fills = [];

  const bDateTxt = figma.createText();
  bDateTxt.fontName = { family: "Inter", style: "Medium" };
  bDateTxt.fontSize = 13;
  bDateTxt.characters = "📅 Viernes 12 de Septiembre • 20:00 - 21:00 hs";
  bDateTxt.fills = [{ type: 'SOLID', color: lightMutedRgb }];
  bMidFrame.appendChild(bDateTxt);

  const bPriceRow = figma.createFrame();
  bPriceRow.layoutMode = 'HORIZONTAL';
  bPriceRow.itemSpacing = 16;
  bPriceRow.fills = [];

  const bSurfaceTxt = figma.createText();
  bSurfaceTxt.fontName = { family: "Inter", style: "Regular" };
  bSurfaceTxt.fontSize = 12;
  bSurfaceTxt.characters = "Césped Sintético Premium";
  bSurfaceTxt.fills = [{ type: 'SOLID', color: hexToRgb('#8EA68B') }];
  bPriceRow.appendChild(bSurfaceTxt);

  const bPriceVal = figma.createText();
  bPriceVal.fontName = { family: "Inter", style: "Bold" };
  bPriceVal.fontSize = 13;
  bPriceVal.characters = "Total: $18.000 (Abonado)";
  setFill(bPriceVal, 'Accent', accentRgb);
  bPriceRow.appendChild(bPriceVal);

  bMidFrame.appendChild(bPriceRow);
  bookingCard.appendChild(bMidFrame);

  // Bottom action bar con botón rojo "Cancelar turno"
  const bActionBar = figma.createFrame();
  bActionBar.layoutMode = 'HORIZONTAL';
  bActionBar.layoutAlign = 'STRETCH';
  bActionBar.primaryAxisAlignItems = 'SPACE_BETWEEN';
  bActionBar.counterAxisAlignItems = 'CENTER';
  bActionBar.paddingTop = 10;
  bActionBar.fills = [];
  setStroke(bActionBar, 'Neutral', neutralRgb, 1);

  const bSubText = figma.createText();
  bSubText.fontName = { family: "Inter", style: "Regular" };
  bSubText.fontSize = 11;
  bSubText.characters = "Cancelación gratuita hasta 24hs antes";
  bSubText.fills = [{ type: 'SOLID', color: hexToRgb('#7A8F76') }];
  bActionBar.appendChild(bSubText);

  // BOTÓN ROJO DE ACCIÓN: Cancelar Turno (8px radius, #E53E3E)
  const cancelBtn = figma.createFrame();
  cancelBtn.name = 'CancelBookingButton';
  cancelBtn.layoutMode = 'HORIZONTAL';
  cancelBtn.itemSpacing = 6;
  cancelBtn.paddingLeft = 14;
  cancelBtn.paddingRight = 14;
  cancelBtn.paddingTop = 8;
  cancelBtn.paddingBottom = 8;
  cancelBtn.cornerRadius = 8; // PSP: 8px para botones
  setFill(cancelBtn, 'Danger', dangerRgb);
  cancelBtn.primaryAxisAlignItems = 'CENTER';
  cancelBtn.counterAxisAlignItems = 'CENTER';

  const cancelTxt = figma.createText();
  cancelTxt.fontName = { family: "Inter", style: semiBoldStyle };
  cancelTxt.fontSize = 12;
  cancelTxt.characters = "Cancelar turno";
  cancelTxt.fills = [{ type: 'SOLID', color: whiteRgb }];
  cancelBtn.appendChild(cancelTxt);
  bActionBar.appendChild(cancelBtn);

  bookingCard.appendChild(bActionBar);
  compPage.appendChild(bookingCard);

  // ==========================================================================
  // COMPONENTE MAESTRO 6: TournamentModal (❖ PascalCase, Modal de Inscripción)
  // Con campos de Nombre de Equipo y filas de Jugadores
  // ==========================================================================
  const tourneyModal = figma.createComponent();
  tourneyModal.name = 'TournamentModal';
  tourneyModal.layoutMode = 'VERTICAL';
  tourneyModal.primaryAxisSizingMode = 'AUTO';
  tourneyModal.counterAxisSizingMode = 'FIXED';
  tourneyModal.resize(560, 680);
  tourneyModal.paddingLeft = 32;
  tourneyModal.paddingRight = 32;
  tourneyModal.paddingTop = 32;
  tourneyModal.paddingBottom = 32;
  tourneyModal.itemSpacing = 20;
  tourneyModal.cornerRadius = 12; // PSP: 12px
  setFill(tourneyModal, 'Dark Surface', darkSurfaceRgb);
  setStroke(tourneyModal, 'Neutral', neutralRgb, 1);
  tourneyModal.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.6 },
    offset: { x: 0, y: 16 },
    radius: 40,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL'
  }];
  tourneyModal.x = 80;
  tourneyModal.y = 620;

  // Modal Header
  const mHead = figma.createFrame();
  mHead.layoutMode = 'HORIZONTAL';
  mHead.layoutAlign = 'STRETCH';
  mHead.primaryAxisAlignItems = 'SPACE_BETWEEN';
  mHead.counterAxisAlignItems = 'FLEX_START';
  mHead.fills = [];

  const mTitleCol = figma.createFrame();
  mTitleCol.layoutMode = 'VERTICAL';
  mTitleCol.itemSpacing = 4;
  mTitleCol.fills = [];

  const mTitle = figma.createText();
  mTitle.fontName = { family: "Inter", style: "Bold" };
  mTitle.fontSize = 20;
  mTitle.characters = "Inscripción a Torneo Apertura 2026";
  setFill(mTitle, 'Primary', primaryRgb);
  mTitleCol.appendChild(mTitle);

  const mSub = figma.createText();
  mSub.fontName = { family: "Inter", style: "Regular" };
  mSub.fontSize = 12;
  mSub.characters = "Completa los datos de tu equipo y la lista de jugadores";
  mSub.fills = [{ type: 'SOLID', color: lightMutedRgb }];
  mTitleCol.appendChild(mSub);
  mHead.appendChild(mTitleCol);

  const closeX = figma.createText();
  closeX.fontName = { family: "Inter", style: "Medium" };
  closeX.fontSize = 18;
  closeX.characters = "✕";
  closeX.fills = [{ type: 'SOLID', color: lightMutedRgb }];
  mHead.appendChild(closeX);
  tourneyModal.appendChild(mHead);

  // Campo Nombre del Equipo
  tourneyModal.appendChild(createInputFrame("Nombre del Equipo *", "Ej: Los Galácticos FC", false));

  // Sección Jugadores
  const pSection = figma.createFrame();
  pSection.name = 'PlayersSection';
  pSection.layoutMode = 'VERTICAL';
  pSection.itemSpacing = 10;
  pSection.layoutAlign = 'STRETCH';
  pSection.fills = [];

  const pSecHead = figma.createFrame();
  pSecHead.layoutMode = 'HORIZONTAL';
  pSecHead.layoutAlign = 'STRETCH';
  pSecHead.primaryAxisAlignItems = 'SPACE_BETWEEN';
  pSecHead.counterAxisAlignItems = 'CENTER';
  pSecHead.fills = [];

  const pSecTitle = figma.createText();
  pSecTitle.fontName = { family: "Inter", style: semiBoldStyle };
  pSecTitle.fontSize = 13;
  pSecTitle.characters = "Lista de Jugadores (Mín. 5 jugadores) *";
  pSecTitle.fills = [{ type: 'SOLID', color: whiteRgb }];
  pSecHead.appendChild(pSecTitle);

  const pCountTxt = figma.createText();
  pCountTxt.fontName = { family: "Inter", style: "Regular" };
  pCountTxt.fontSize = 11;
  pCountTxt.characters = "5 / 12 registrados";
  setFill(pCountTxt, 'Accent', accentRgb);
  pSecHead.appendChild(pCountTxt);
  pSection.appendChild(pSecHead);

  // Filas de jugadores
  const samplePlayers = [
    { num: '1', name: 'Martín Rodríguez (Capitán)', dni: '38.450.112', pos: 'Delantero' },
    { num: '2', name: 'Lucas Benítez', dni: '40.122.908', pos: 'Arquero' },
    { num: '3', name: 'Santiago Gómez', dni: '39.887.411', pos: 'Defensor' },
    { num: '4', name: 'Mateo Fernández', dni: '41.200.345', pos: 'Mediocampista' },
    { num: '5', name: 'Joaquín Díaz', dni: '39.400.120', pos: 'Defensor' }
  ];

  for (const p of samplePlayers) {
    const pRow = figma.createFrame();
    pRow.name = 'PlayerRow-' + p.num;
    pRow.layoutMode = 'HORIZONTAL';
    pRow.itemSpacing = 8;
    pRow.layoutAlign = 'STRETCH';
    pRow.paddingLeft = 10;
    pRow.paddingRight = 10;
    pRow.paddingTop = 8;
    pRow.paddingBottom = 8;
    pRow.cornerRadius = 6;
    setFill(pRow, 'Deep Bg', deepBgRgb);
    setStroke(pRow, 'Neutral', neutralRgb, 1);
    pRow.counterAxisAlignItems = 'CENTER';

    const numBadge = figma.createText();
    numBadge.fontName = { family: "Inter", style: "Bold" };
    numBadge.fontSize = 11;
    numBadge.characters = "#" + p.num;
    setFill(numBadge, 'Primary', primaryRgb);
    pRow.appendChild(numBadge);

    const nameCol = figma.createText();
    nameCol.fontName = { family: "Inter", style: "Medium" };
    nameCol.fontSize = 12;
    nameCol.characters = p.name;
    nameCol.layoutGrow = 1;
    nameCol.fills = [{ type: 'SOLID', color: whiteRgb }];
    pRow.appendChild(nameCol);

    const dniCol = figma.createText();
    dniCol.fontName = { family: "Inter", style: "Regular" };
    dniCol.fontSize = 11;
    dniCol.characters = "DNI: " + p.dni;
    dniCol.fills = [{ type: 'SOLID', color: lightMutedRgb }];
    pRow.appendChild(dniCol);

    pSection.appendChild(pRow);
  }

  // Botón Agregar Jugador (8px radius)
  const addPlayerBtn = figma.createFrame();
  addPlayerBtn.name = 'AddPlayerButton';
  addPlayerBtn.layoutMode = 'HORIZONTAL';
  addPlayerBtn.itemSpacing = 6;
  addPlayerBtn.paddingLeft = 12;
  addPlayerBtn.paddingRight = 12;
  addPlayerBtn.paddingTop = 8;
  addPlayerBtn.paddingBottom = 8;
  addPlayerBtn.cornerRadius = 8;
  setFill(addPlayerBtn, 'Deep Bg', deepBgRgb);
  setStroke(addPlayerBtn, 'Secondary', secondaryRgb, 1);
  addPlayerBtn.primaryAxisAlignItems = 'CENTER';
  addPlayerBtn.counterAxisAlignItems = 'CENTER';
  addPlayerBtn.layoutAlign = 'START';

  const addTxt = figma.createText();
  addTxt.fontName = { family: "Inter", style: semiBoldStyle };
  addTxt.fontSize = 12;
  addTxt.characters = "+ Agregar Jugador";
  setFill(addTxt, 'Secondary', secondaryRgb);
  addPlayerBtn.appendChild(addTxt);
  pSection.appendChild(addPlayerBtn);

  tourneyModal.appendChild(pSection);

  // Footer Acciones
  const mActions = figma.createFrame();
  mActions.name = 'ModalActions';
  mActions.layoutMode = 'HORIZONTAL';
  mActions.layoutAlign = 'STRETCH';
  mActions.primaryAxisAlignItems = 'FLEX_END';
  mActions.itemSpacing = 12;
  mActions.paddingTop = 8;
  mActions.fills = [];

  const cancelModalBtn = figma.createFrame();
  cancelModalBtn.name = 'CancelBtn';
  cancelModalBtn.layoutMode = 'HORIZONTAL';
  cancelModalBtn.primaryAxisAlignItems = 'CENTER';
  cancelModalBtn.counterAxisAlignItems = 'CENTER';
  cancelModalBtn.paddingLeft = 16;
  cancelModalBtn.paddingRight = 16;
  cancelModalBtn.paddingTop = 10;
  cancelModalBtn.paddingBottom = 10;
  cancelModalBtn.cornerRadius = 8;
  setFill(cancelModalBtn, 'Deep Bg', deepBgRgb);
  setStroke(cancelModalBtn, 'Neutral', neutralRgb, 1);

  const cancelModalTxt = figma.createText();
  cancelModalTxt.fontName = { family: "Inter", style: "Medium" };
  cancelModalTxt.fontSize = 13;
  cancelModalTxt.characters = "Cancelar";
  cancelModalTxt.fills = [{ type: 'SOLID', color: lightMutedRgb }];
  cancelModalBtn.appendChild(cancelModalTxt);
  mActions.appendChild(cancelModalBtn);

  const confirmModalBtn = figma.createFrame();
  confirmModalBtn.name = 'ConfirmBtn';
  confirmModalBtn.layoutMode = 'HORIZONTAL';
  confirmModalBtn.primaryAxisAlignItems = 'CENTER';
  confirmModalBtn.counterAxisAlignItems = 'CENTER';
  confirmModalBtn.paddingLeft = 20;
  confirmModalBtn.paddingRight = 20;
  confirmModalBtn.paddingTop = 10;
  confirmModalBtn.paddingBottom = 10;
  confirmModalBtn.cornerRadius = 8;
  setFill(confirmModalBtn, 'Primary', primaryRgb);

  const confirmModalTxt = figma.createText();
  confirmModalTxt.fontName = { family: "Inter", style: semiBoldStyle };
  confirmModalTxt.fontSize = 13;
  confirmModalTxt.characters = "Confirmar Inscripción";
  setFill(confirmModalTxt, 'Deep Bg', deepBgRgb);
  confirmModalBtn.appendChild(confirmModalTxt);
  mActions.appendChild(confirmModalBtn);

  tourneyModal.appendChild(mActions);
  compPage.appendChild(tourneyModal);

  console.log("✓ Todos los Componentes Maestros (❖) creados en PascalCase en la página 'Componentes'.");

  // ==========================================================================
  // GENERACIÓN DE LAS 4 PANTALLAS COMPLETAS EN "Pantallas - Complejo UB"
  // ==========================================================================
  figma.currentPage = screensPage;

  // Limpiar pantallas previas en screensPage
  const existingScreens = ['LoginScreen', 'AdminDashboard', 'TournamentModalScreen', 'MyBookingsScreen'];
  for (const sName of existingScreens) {
    const s = screensPage.children.find(c => c.name === sName);
    if (s) s.remove();
  }

  // --------------------------------------------------------------------------
  // PANTALLA 1: LoginScreen (RF-01)
  // --------------------------------------------------------------------------
  const loginScreen = figma.createFrame();
  loginScreen.name = 'LoginScreen';
  loginScreen.resize(1440, 900);
  setFill(loginScreen, 'Deep Bg', deepBgRgb);
  loginScreen.layoutMode = 'VERTICAL';
  loginScreen.primaryAxisAlignItems = 'CENTER';
  loginScreen.counterAxisAlignItems = 'CENTER';
  loginScreen.paddingTop = 60;
  loginScreen.paddingBottom = 60;
  loginScreen.itemSpacing = 24;
  loginScreen.x = 0;
  loginScreen.y = 0;

  // Top Bar Brand
  const topBrand = figma.createFrame();
  topBrand.layoutMode = 'HORIZONTAL';
  topBrand.itemSpacing = 12;
  topBrand.counterAxisAlignItems = 'CENTER';
  topBrand.fills = [];

  const topLogo = figma.createFrame();
  topLogo.name = 'TopLogo';
  topLogo.layoutMode = 'HORIZONTAL';
  topLogo.primaryAxisAlignItems = 'CENTER';
  topLogo.counterAxisAlignItems = 'CENTER';
  topLogo.resize(40, 40);
  topLogo.cornerRadius = 8;
  setFill(topLogo, 'Primary', primaryRgb);
  const topLogoTxt = figma.createText();
  topLogoTxt.fontName = { family: "Inter", style: "Bold" };
  topLogoTxt.fontSize = 18;
  topLogoTxt.characters = "UB";
  setFill(topLogoTxt, 'Deep Bg', deepBgRgb);
  topLogo.appendChild(topLogoTxt);
  topBrand.appendChild(topLogo);

  const topBrandTitle = figma.createText();
  topBrandTitle.fontName = { family: "Inter", style: "Bold" };
  topBrandTitle.fontSize = 22;
  topBrandTitle.characters = "COMPLEJO DEPORTIVO UB";
  topBrandTitle.fills = [{ type: 'SOLID', color: whiteRgb }];
  topBrand.appendChild(topBrandTitle);
  loginScreen.appendChild(topBrand);

  // Instancia del LoginForm centrado
  const loginInst = loginForm.createInstance();
  loginInst.name = 'LoginFormInstance';
  loginScreen.appendChild(loginInst);

  screensPage.appendChild(loginScreen);

  // --------------------------------------------------------------------------
  // PANTALLA 2: AdminDashboard (Panel de Administrador con Agenda Diaria)
  // --------------------------------------------------------------------------
  const adminScreen = figma.createFrame();
  adminScreen.name = 'AdminDashboard';
  adminScreen.resize(1440, 900);
  setFill(adminScreen, 'Deep Bg', deepBgRgb);
  adminScreen.layoutMode = 'HORIZONTAL';
  adminScreen.x = 1500;
  adminScreen.y = 0;

  // Sidebar anidado a la izquierda
  const sideInst = adminSidebar.createInstance();
  sideInst.name = 'AdminSidebarInstance';
  sideInst.resize(260, 900);
  adminScreen.appendChild(sideInst);

  // Contenido Principal del Dashboard
  const dashContent = figma.createFrame();
  dashContent.name = 'MainContent';
  dashContent.layoutMode = 'VERTICAL';
  dashContent.layoutGrow = 1;
  dashContent.paddingLeft = 36;
  dashContent.paddingRight = 36;
  dashContent.paddingTop = 32;
  dashContent.paddingBottom = 32;
  dashContent.itemSpacing = 24;
  dashContent.fills = [];

  // Top Bar con KPIs y Botones Operativos
  const dHeader = figma.createFrame();
  dHeader.layoutMode = 'HORIZONTAL';
  dHeader.layoutAlign = 'STRETCH';
  dHeader.primaryAxisAlignItems = 'SPACE_BETWEEN';
  dHeader.counterAxisAlignItems = 'CENTER';
  dHeader.fills = [];

  const dTitleCol = figma.createFrame();
  dTitleCol.layoutMode = 'VERTICAL';
  dTitleCol.itemSpacing = 4;
  dTitleCol.fills = [];

  const dTitle = figma.createText();
  dTitle.fontName = { family: "Inter", style: "Bold" };
  dTitle.fontSize = 26;
  dTitle.characters = "Agenda Diaria de Turnos";
  dTitle.fills = [{ type: 'SOLID', color: whiteRgb }];
  dTitleCol.appendChild(dTitle);

  const dSubtitle = figma.createText();
  dSubtitle.fontName = { family: "Inter", style: "Regular" };
  dSubtitle.fontSize = 13;
  dSubtitle.characters = "Lunes 7 de Septiembre • Ocupación actual: 82%";
  dSubtitle.fills = [{ type: 'SOLID', color: lightMutedRgb }];
  dTitleCol.appendChild(dSubtitle);
  dHeader.appendChild(dTitleCol);

  // Botones operativos anidados (AdminActionBtn)
  const opActions = figma.createFrame();
  opActions.name = 'AdminActionsRow';
  opActions.layoutMode = 'HORIZONTAL';
  opActions.itemSpacing = 12;
  opActions.fills = [];

  const asigInst = btnAsignar.createInstance();
  opActions.appendChild(asigInst);

  const bloqInst = btnBloquear.createInstance();
  opActions.appendChild(bloqInst);
  dHeader.appendChild(opActions);
  dashContent.appendChild(dHeader);

  // Tarjetas KPI Rápidas (3 cards con 12px radius)
  const kpiRow = figma.createFrame();
  kpiRow.name = 'KpiRow';
  kpiRow.layoutMode = 'HORIZONTAL';
  kpiRow.layoutAlign = 'STRETCH';
  kpiRow.itemSpacing = 16;
  kpiRow.fills = [];

  const kpis = [
    { title: 'Turnos Hoy', value: '28 / 32', desc: '4 horarios disponibles', color: 'Primary' },
    { title: 'Torneo Activo', value: 'Apertura 2026', desc: '16 equipos confirmados', color: 'Accent' },
    { title: 'Canchas Operativas', value: '5 de 6', desc: 'Pádel 2 en mantenimiento', color: 'Secondary' }
  ];

  for (const k of kpis) {
    const kCard = figma.createFrame();
    kCard.layoutMode = 'VERTICAL';
    kCard.layoutGrow = 1;
    kCard.paddingLeft = 20;
    kCard.paddingRight = 20;
    kCard.paddingTop = 16;
    kCard.paddingBottom = 16;
    kCard.itemSpacing = 6;
    kCard.cornerRadius = 12; // PSP: 12px
    setFill(kCard, 'Dark Surface', darkSurfaceRgb);
    setStroke(kCard, 'Neutral', neutralRgb, 1);

    const kT = figma.createText();
    kT.fontName = { family: "Inter", style: "Medium" };
    kT.fontSize = 12;
    kT.characters = k.title;
    kT.fills = [{ type: 'SOLID', color: lightMutedRgb }];
    kCard.appendChild(kT);

    const kV = figma.createText();
    kV.fontName = { family: "Inter", style: "Bold" };
    kV.fontSize = 22;
    kV.characters = k.value;
    setFill(kV, k.color, primaryRgb);
    kCard.appendChild(kV);

    const kD = figma.createText();
    kD.fontName = { family: "Inter", style: "Regular" };
    kD.fontSize = 11;
    kD.characters = k.desc;
    kD.fills = [{ type: 'SOLID', color: hexToRgb('#7A8F76') }];
    kCard.appendChild(kD);

    kpiRow.appendChild(kCard);
  }
  dashContent.appendChild(kpiRow);

  // GRILLA AGENDA DIARIA (Timeline de Canchas)
  const agendaContainer = figma.createFrame();
  agendaContainer.name = 'DailyScheduleGrid';
  agendaContainer.layoutMode = 'VERTICAL';
  agendaContainer.layoutAlign = 'STRETCH';
  agendaContainer.layoutGrow = 1;
  agendaContainer.paddingLeft = 20;
  agendaContainer.paddingRight = 20;
  agendaContainer.paddingTop = 20;
  agendaContainer.paddingBottom = 20;
  agendaContainer.itemSpacing = 12;
  agendaContainer.cornerRadius = 12;
  setFill(agendaContainer, 'Dark Surface', darkSurfaceRgb);
  setStroke(agendaContainer, 'Neutral', neutralRgb, 1);

  // Encabezado de Columnas (Horario y 4 canchas)
  const gHead = figma.createFrame();
  gHead.layoutMode = 'HORIZONTAL';
  gHead.layoutAlign = 'STRETCH';
  gHead.itemSpacing = 10;
  gHead.fills = [];

  const courts = ['Hora', 'Cancha 1 (Fútbol 5)', 'Cancha 2 (Fútbol 7)', 'Cancha 3 (Pádel 1)', 'Cancha 4 (Pádel 2)'];
  for (let i = 0; i < courts.length; i++) {
    const cHead = figma.createFrame();
    cHead.layoutMode = 'HORIZONTAL';
    cHead.layoutGrow = i === 0 ? 0 : 1;
    if (i === 0) cHead.resize(80, 36);
    cHead.paddingTop = 8;
    cHead.paddingBottom = 8;
    cHead.counterAxisAlignItems = 'CENTER';
    cHead.fills = [];

    const cTxt = figma.createText();
    cTxt.fontName = { family: "Inter", style: semiBoldStyle };
    cTxt.fontSize = 12;
    cTxt.characters = courts[i];
    setFill(cTxt, i === 0 ? 'Neutral' : 'Primary', primaryRgb);
    cHead.appendChild(cTxt);
    gHead.appendChild(cHead);
  }
  agendaContainer.appendChild(gHead);

  // Filas horarias (18:00, 19:00, 20:00, 21:00)
  const scheduleRows = [
    { hour: '18:00', c1: 'Reservado (Torneo)', c2: 'Disponible', c3: 'Reservado (Pádel Cl.)', c4: 'Mantenimiento' },
    { hour: '19:00', c1: 'Reservado (Pérez)', c2: 'Reservado (Liga)', c3: 'Reservado (López)', c4: 'Mantenimiento' },
    { hour: '20:00', c1: 'Reservado (Martín R.)', c2: 'Reservado (Gómez)', c3: 'Disponible', c4: 'Disponible' },
    { hour: '21:00', c1: 'Reservado (FC Stars)', c2: 'Disponible', c3: 'Reservado (Final)', c4: 'Disponible' }
  ];

  for (const sRow of scheduleRows) {
    const rFrame = figma.createFrame();
    rFrame.layoutMode = 'HORIZONTAL';
    rFrame.layoutAlign = 'STRETCH';
    rFrame.itemSpacing = 10;
    rFrame.fills = [];

    // Columna hora
    const hCol = figma.createFrame();
    hCol.name = 'HourCol';
    hCol.layoutMode = 'HORIZONTAL';
    hCol.primaryAxisAlignItems = 'CENTER';
    hCol.counterAxisAlignItems = 'CENTER';
    hCol.resize(80, 48);
    hCol.fills = [];

    const hTxt = figma.createText();
    hTxt.fontName = { family: "Inter", style: "Bold" };
    hTxt.fontSize = 13;
    hTxt.characters = sRow.hour;
    hTxt.fills = [{ type: 'SOLID', color: lightMutedRgb }];
    hCol.appendChild(hTxt);
    rFrame.appendChild(hCol);

    // 4 Slots de canchas
    const slotKeys = [sRow.c1, sRow.c2, sRow.c3, sRow.c4];
    for (const slot of slotKeys) {
      const sBox = figma.createFrame();
      sBox.layoutMode = 'HORIZONTAL';
      sBox.layoutGrow = 1;
      sBox.counterAxisSizingMode = 'FIXED';
      sBox.resize(100, 48);
      sBox.paddingLeft = 12;
      sBox.paddingRight = 12;
      sBox.cornerRadius = 8;
      sBox.counterAxisAlignItems = 'CENTER';

      const sTxt = figma.createText();
      sTxt.fontSize = 11;
      sTxt.characters = slot;

      if (slot === 'Disponible') {
        setFill(sBox, 'Deep Bg', deepBgRgb);
        setStroke(sBox, 'Neutral', neutralRgb, 1);
        sTxt.fontName = { family: "Inter", style: "Regular" };
        sTxt.fills = [{ type: 'SOLID', color: lightMutedRgb }];
      } else if (slot.includes('Mantenimiento')) {
        setFill(sBox, 'Dark Card', darkCardRgb);
        setStroke(sBox, 'Secondary', secondaryRgb, 1);
        sTxt.fontName = { family: "Inter", style: semiBoldStyle };
        setFill(sTxt, 'Accent', accentRgb);
      } else {
        // Reservado
        setFill(sBox, 'Primary', primaryRgb, 0.2);
        setStroke(sBox, 'Primary', primaryRgb, 1);
        sTxt.fontName = { family: "Inter", style: semiBoldStyle };
        setFill(sTxt, 'Primary', primaryRgb);
      }
      sBox.appendChild(sTxt);
      rFrame.appendChild(sBox);
    }
    agendaContainer.appendChild(rFrame);
  }
  dashContent.appendChild(agendaContainer);
  adminScreen.appendChild(dashContent);
  screensPage.appendChild(adminScreen);

  // --------------------------------------------------------------------------
  // PANTALLA 3: TournamentModalScreen (Vista con Modal de Inscripción)
  // --------------------------------------------------------------------------
  const tourneyScreen = figma.createFrame();
  tourneyScreen.name = 'TournamentModalScreen';
  tourneyScreen.resize(1440, 900);
  setFill(tourneyScreen, 'Deep Bg', deepBgRgb);
  tourneyScreen.layoutMode = 'VERTICAL';
  tourneyScreen.primaryAxisAlignItems = 'CENTER';
  tourneyScreen.counterAxisAlignItems = 'CENTER';
  tourneyScreen.x = 3000;
  tourneyScreen.y = 0;

  // Backdrop sombreado oscuro
  const backdrop = figma.createFrame();
  backdrop.name = 'BackdropOverlay';
  backdrop.resize(1440, 900);
  backdrop.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.7 }];
  backdrop.layoutMode = 'VERTICAL';
  backdrop.primaryAxisAlignItems = 'CENTER';
  backdrop.counterAxisAlignItems = 'CENTER';

  const tModalInst = tourneyModal.createInstance();
  tModalInst.name = 'TournamentModalInstance';
  backdrop.appendChild(tModalInst);

  tourneyScreen.appendChild(backdrop);
  screensPage.appendChild(tourneyScreen);

  // --------------------------------------------------------------------------
  // PANTALLA 4: MyBookingsScreen (Perfil del Cliente / Mis Reservas)
  // --------------------------------------------------------------------------
  const myBookingsScreen = figma.createFrame();
  myBookingsScreen.name = 'MyBookingsScreen';
  myBookingsScreen.resize(1440, 900);
  setFill(myBookingsScreen, 'Deep Bg', deepBgRgb);
  myBookingsScreen.layoutMode = 'VERTICAL';
  myBookingsScreen.paddingLeft = 80;
  myBookingsScreen.paddingRight = 80;
  myBookingsScreen.paddingTop = 40;
  myBookingsScreen.paddingBottom = 40;
  myBookingsScreen.itemSpacing = 28;
  myBookingsScreen.x = 4500;
  myBookingsScreen.y = 0;

  // Navbar de Cliente
  const cNav = figma.createFrame();
  cNav.layoutMode = 'HORIZONTAL';
  cNav.layoutAlign = 'STRETCH';
  cNav.primaryAxisAlignItems = 'SPACE_BETWEEN';
  cNav.counterAxisAlignItems = 'CENTER';
  cNav.paddingBottom = 20;
  cNav.fills = [];
  setStroke(cNav, 'Neutral', neutralRgb, 1);

  const cBrand = figma.createFrame();
  cBrand.layoutMode = 'HORIZONTAL';
  cBrand.itemSpacing = 10;
  cBrand.counterAxisAlignItems = 'CENTER';
  cBrand.fills = [];

  const cLogo = figma.createFrame();
  cLogo.name = 'ClientLogo';
  cLogo.layoutMode = 'HORIZONTAL';
  cLogo.primaryAxisAlignItems = 'CENTER';
  cLogo.counterAxisAlignItems = 'CENTER';
  cLogo.resize(36, 36);
  cLogo.cornerRadius = 8;
  setFill(cLogo, 'Primary', primaryRgb);
  const cLogoTxt = figma.createText();
  cLogoTxt.fontName = { family: "Inter", style: "Bold" };
  cLogoTxt.fontSize = 15;
  cLogoTxt.characters = "UB";
  setFill(cLogoTxt, 'Deep Bg', deepBgRgb);
  cLogo.appendChild(cLogoTxt);
  cBrand.appendChild(cLogo);

  const cTitle = figma.createText();
  cTitle.fontName = { family: "Inter", style: "Bold" };
  cTitle.fontSize = 18;
  cTitle.characters = "Complejo Deportivo UB";
  cTitle.fills = [{ type: 'SOLID', color: whiteRgb }];
  cBrand.appendChild(cTitle);
  cNav.appendChild(cBrand);

  const cUser = figma.createFrame();
  cUser.layoutMode = 'HORIZONTAL';
  cUser.itemSpacing = 12;
  cUser.counterAxisAlignItems = 'CENTER';
  cUser.fills = [];

  const cUserTxt = figma.createText();
  cUserTxt.fontName = { family: "Inter", style: semiBoldStyle };
  cUserTxt.fontSize = 13;
  cUserTxt.characters = "Martín Rodríguez • Cliente / Capitán";
  cUserTxt.fills = [{ type: 'SOLID', color: lightMutedRgb }];
  cUser.appendChild(cUserTxt);

  const cAv = figma.createFrame();
  cAv.name = 'UserAvatar';
  cAv.layoutMode = 'HORIZONTAL';
  cAv.primaryAxisAlignItems = 'CENTER';
  cAv.counterAxisAlignItems = 'CENTER';
  cAv.resize(36, 36);
  cAv.cornerRadius = 18;
  setFill(cAv, 'Primary', primaryRgb);
  const cAvTxt = figma.createText();
  cAvTxt.fontName = { family: "Inter", style: "Bold" };
  cAvTxt.fontSize = 14;
  cAvTxt.characters = "MR";
  setFill(cAvTxt, 'Deep Bg', deepBgRgb);
  cAv.appendChild(cAvTxt);
  cUser.appendChild(cAv);
  cNav.appendChild(cUser);
  myBookingsScreen.appendChild(cNav);

  // Tabs de Reservas
  const tabRow = figma.createFrame();
  tabRow.layoutMode = 'HORIZONTAL';
  tabRow.itemSpacing = 16;
  tabRow.fills = [];

  const tabActive = figma.createFrame();
  tabActive.name = 'TabActive';
  tabActive.layoutMode = 'HORIZONTAL';
  tabActive.primaryAxisAlignItems = 'CENTER';
  tabActive.counterAxisAlignItems = 'CENTER';
  tabActive.paddingLeft = 16;
  tabActive.paddingRight = 16;
  tabActive.paddingTop = 8;
  tabActive.paddingBottom = 8;
  tabActive.cornerRadius = 8;
  setFill(tabActive, 'Primary', primaryRgb);

  const tabActTxt = figma.createText();
  tabActTxt.fontName = { family: "Inter", style: semiBoldStyle };
  tabActTxt.fontSize = 13;
  tabActTxt.characters = "Mis Turnos Activos (3)";
  setFill(tabActTxt, 'Deep Bg', deepBgRgb);
  tabActive.appendChild(tabActTxt);
  tabRow.appendChild(tabActive);

  const tabHist = figma.createFrame();
  tabHist.name = 'TabHistory';
  tabHist.layoutMode = 'HORIZONTAL';
  tabHist.primaryAxisAlignItems = 'CENTER';
  tabHist.counterAxisAlignItems = 'CENTER';
  tabHist.paddingLeft = 16;
  tabHist.paddingRight = 16;
  tabHist.paddingTop = 8;
  tabHist.paddingBottom = 8;
  tabHist.cornerRadius = 8;
  setFill(tabHist, 'Dark Surface', darkSurfaceRgb);
  setStroke(tabHist, 'Neutral', neutralRgb, 1);

  const tabHistTxt = figma.createText();
  tabHistTxt.fontName = { family: "Inter", style: "Medium" };
  tabHistTxt.fontSize = 13;
  tabHistTxt.characters = "Historial Pasado (14)";
  tabHistTxt.fills = [{ type: 'SOLID', color: lightMutedRgb }];
  tabHist.appendChild(tabHistTxt);
  tabRow.appendChild(tabHist);
  myBookingsScreen.appendChild(tabRow);

  // Grilla de Tarjetas de Reservas (3 cards con botón rojo Cancelar turno)
  const cardsGrid = figma.createFrame();
  cardsGrid.name = 'BookingsGrid';
  cardsGrid.layoutMode = 'HORIZONTAL';
  cardsGrid.layoutAlign = 'STRETCH';
  cardsGrid.itemSpacing = 24;
  cardsGrid.fills = [];

  // Instancia 1
  const bInst1 = bookingCard.createInstance();
  cardsGrid.appendChild(bInst1);

  // Instancia 2
  const bInst2 = bookingCard.createInstance();
  cardsGrid.appendChild(bInst2);

  // Instancia 3
  const bInst3 = bookingCard.createInstance();
  cardsGrid.appendChild(bInst3);

  myBookingsScreen.appendChild(cardsGrid);
  screensPage.appendChild(myBookingsScreen);

  // --------------------------------------------------------------------------
  // FINALIZACIÓN Y SELECCIÓN EN FIGMA
  // --------------------------------------------------------------------------
  figma.currentPage = screensPage;
  figma.viewport.scrollAndZoomIntoView([loginScreen, adminScreen, tourneyScreen, myBookingsScreen]);

  const msg = "❖ ¡Sistema de Diseño y las 4 Pantallas de Alta Fidelidad generadas exitosamente en Complejo Deportivo UB!";
  console.log("✅ " + msg);
  figma.notify(msg, { timeout: 8000 });
  if (typeof figma.closePlugin === 'function') {
    figma.closePlugin();
  }
})();
