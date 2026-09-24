// ============================================================================
// AUTOMATIZACIÓN DE COMPONENTES MAESTROS EN FIGMA (RF-05 / PSP / BRAND MANUAL)
// Proyecto: Complejo Deportivo UB | File Key: 2QdhwIwbWtyS5qnPX9twOW
// Componentes a crear: RoleSelector, LoginForm, AdminActionBtn
// ============================================================================

(async () => {
  console.log("🚀 Iniciando generación de Componentes Maestros en Figma...");

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    return {
      r: parseInt(clean.substring(0, 2), 16) / 255,
      g: parseInt(clean.substring(2, 4), 16) / 255,
      b: parseInt(clean.substring(4, 6), 16) / 255
    };
  }

  // 1. Cargar fuentes requeridas de la familia Inter de forma robusta y resiliente
  // Nota: En Figma, el estilo para Inter 600 es "Semi Bold" (con espacio)
  let semiBoldStyle = "Semi Bold";

  await Promise.all([
    figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    figma.loadFontAsync({ family: "Inter", style: "Medium" }),
    figma.loadFontAsync({ family: "Inter", style: "Bold" }),
    (async () => {
      try {
        await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
        semiBoldStyle = "Semi Bold";
      } catch (e) {
        try {
          await figma.loadFontAsync({ family: "Inter", style: "SemiBold" });
          semiBoldStyle = "SemiBold";
        } catch (e2) {
          console.warn("No se pudo cargar Semi Bold, usando Bold como respaldo.");
          semiBoldStyle = "Bold";
        }
      }
    })()
  ]);

  console.log(`✓ Fuentes cargadas correctamente (Inter: Regular, Medium, ${semiBoldStyle}, Bold).`);

  // 2. Gestionar la página 'Componentes'
  let compPage = figma.root.children.find(p => p.name === 'Componentes');
  if (!compPage) {
    compPage = figma.createPage();
    compPage.name = 'Componentes';
  }
  figma.currentPage = compPage;

  // Limpiar versiones previas si se re-ejecuta el script para evitar duplicados
  const prevRole = compPage.children.find(c => c.name === 'RoleSelector');
  if (prevRole) prevRole.remove();
  const prevLogin = compPage.children.find(c => c.name === 'LoginForm');
  if (prevLogin) prevLogin.remove();
  const prevAdminBtn = compPage.children.find(c => c.name === 'AdminActionBtn');
  if (prevAdminBtn) prevAdminBtn.remove();

  // 3. Obtener o inicializar los Local Paint Styles de marca
  const brandPalette = [
    { name: 'Primary', hex: '#65C556' },
    { name: 'Secondary', hex: '#689E5F' },
    { name: 'Accent', hex: '#57EF40' },
    { name: 'Neutral', hex: '#5A7056' },
    { name: 'Dark Text', hex: '#3D463C' },
    { name: 'Deep Bg', hex: '#293827' }
  ];

  const localStyles = {};
  const existingStyles = figma.getLocalPaintStyles();

  for (const item of brandPalette) {
    let s = existingStyles.find(st => st.name === item.name);
    if (!s) {
      s = figma.createPaintStyle();
      s.name = item.name;
      s.paints = [{ type: 'SOLID', color: hexToRgb(item.hex), opacity: 1 }];
    }
    localStyles[item.name] = s;
  }

  const primaryRgb = hexToRgb('#65C556');
  const deepBgRgb = hexToRgb('#293827');
  const neutralRgb = hexToRgb('#5A7056');
  const darkSurfaceRgb = hexToRgb('#1E281D');
  const whiteRgb = { r: 1, g: 1, b: 1 };
  const lightMutedRgb = hexToRgb('#A3B8A1');

  // Coordenadas base en la página Componentes
  const originX = 100;
  let originY = 400; // Debajo de los botones y tournament-card previos

  // ==========================================================================
  // COMPONENTE 1: RoleSelector (❖ Master Component)
  // Segmented Control con Auto Layout horizontal y 3 roles (RF-01 / PSP)
  // ==========================================================================
  console.log("Creando RoleSelector...");
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
  roleSelector.fills = [{ type: 'SOLID', color: darkSurfaceRgb }];
  roleSelector.strokes = [{ type: 'SOLID', color: neutralRgb }];
  roleSelector.strokeWeight = 1;
  roleSelector.x = originX;
  roleSelector.y = originY;

  const roles = [
    { label: 'Cliente/Capitán', active: true },
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
      if (localStyles['Primary']) tab.fillStyleId = localStyles['Primary'].id;
      else tab.fills = [{ type: 'SOLID', color: primaryRgb }];

      txt.fontName = { family: "Inter", style: semiBoldStyle };
      if (localStyles['Deep Bg']) txt.fillStyleId = localStyles['Deep Bg'].id;
      else txt.fills = [{ type: 'SOLID', color: deepBgRgb }];
    } else {
      tab.fills = []; // Transparente
      txt.fontName = { family: "Inter", style: "Medium" };
      txt.fills = [{ type: 'SOLID', color: lightMutedRgb }];
    }

    tab.appendChild(txt);
    roleSelector.appendChild(tab);
  }

  // ==========================================================================
  // COMPONENTE 2: LoginForm (❖ Master Component)
  // Formulario completo de inicio de sesión Dark Mode (RF-01 / RF-05)
  // ==========================================================================
  console.log("Creando LoginForm...");
  const loginForm = figma.createComponent();
  loginForm.name = 'LoginForm';
  loginForm.layoutMode = 'VERTICAL';
  loginForm.primaryAxisSizingMode = 'AUTO';
  loginForm.counterAxisSizingMode = 'FIXED';
  loginForm.resize(400, 480);
  loginForm.paddingLeft = 32;
  loginForm.paddingRight = 32;
  loginForm.paddingTop = 32;
  loginForm.paddingBottom = 32;
  loginForm.itemSpacing = 20;
  loginForm.cornerRadius = 16;

  if (localStyles['Deep Bg']) loginForm.fillStyleId = localStyles['Deep Bg'].id;
  else loginForm.fills = [{ type: 'SOLID', color: deepBgRgb }];

  loginForm.strokes = [{ type: 'SOLID', color: neutralRgb }];
  loginForm.strokeWeight = 1;
  loginForm.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.35 },
    offset: { x: 0, y: 8 },
    radius: 24,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL'
  }];

  loginForm.x = originX + 420;
  loginForm.y = originY;

  // Encabezado
  const headerFrame = figma.createFrame();
  headerFrame.name = 'Header';
  headerFrame.layoutMode = 'VERTICAL';
  headerFrame.itemSpacing = 6;
  headerFrame.layoutAlign = 'STRETCH';
  headerFrame.fills = [];

  const titleTxt = figma.createText();
  titleTxt.fontName = { family: "Inter", style: "Bold" };
  titleTxt.fontSize = 24;
  titleTxt.characters = "Iniciar Sesión";
  if (localStyles['Primary']) titleTxt.fillStyleId = localStyles['Primary'].id;
  else titleTxt.fills = [{ type: 'SOLID', color: primaryRgb }];
  headerFrame.appendChild(titleTxt);

  const subtitleTxt = figma.createText();
  subtitleTxt.fontName = { family: "Inter", style: "Regular" };
  subtitleTxt.fontSize = 13;
  subtitleTxt.characters = "Ingresá a tu cuenta de Complejo Deportivo UB";
  subtitleTxt.fills = [{ type: 'SOLID', color: lightMutedRgb }];
  headerFrame.appendChild(subtitleTxt);
  loginForm.appendChild(headerFrame);

  // Selector de roles anidado (instancia de RoleSelector)
  const roleInst = roleSelector.createInstance();
  roleInst.name = 'RoleSelectorInstance';
  roleInst.layoutAlign = 'STRETCH';
  loginForm.appendChild(roleInst);

  // Función auxiliar para crear campos de texto del formulario
  function createInputField(labelStr, placeholderStr, isPassword = false) {
    const fieldContainer = figma.createFrame();
    fieldContainer.name = 'Field-' + labelStr;
    fieldContainer.layoutMode = 'VERTICAL';
    fieldContainer.itemSpacing = 6;
    fieldContainer.layoutAlign = 'STRETCH';
    fieldContainer.fills = [];

    // Fila superior de etiqueta
    const labelRow = figma.createFrame();
    labelRow.name = 'LabelRow';
    labelRow.layoutMode = 'HORIZONTAL';
    labelRow.layoutAlign = 'STRETCH';
    labelRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
    labelRow.counterAxisAlignItems = 'CENTER';
    labelRow.fills = [];

    const label = figma.createText();
    label.fontName = { family: "Inter", style: "Medium" };
    label.fontSize = 12;
    label.characters = labelStr;
    label.fills = [{ type: 'SOLID', color: whiteRgb }];
    labelRow.appendChild(label);

    if (isPassword) {
      const forgotLink = figma.createText();
      forgotLink.fontName = { family: "Inter", style: "Medium" };
      forgotLink.fontSize = 11;
      forgotLink.characters = "¿Olvidaste tu contraseña?";
      if (localStyles['Primary']) forgotLink.fillStyleId = localStyles['Primary'].id;
      else forgotLink.fills = [{ type: 'SOLID', color: primaryRgb }];
      labelRow.appendChild(forgotLink);
    }

    fieldContainer.appendChild(labelRow);

    // Caja de input
    const inputBox = figma.createFrame();
    inputBox.name = 'InputBox';
    inputBox.layoutMode = 'HORIZONTAL';
    inputBox.layoutAlign = 'STRETCH';
    inputBox.counterAxisSizingMode = 'FIXED';
    inputBox.resize(100, 44);
    inputBox.paddingLeft = 14;
    inputBox.paddingRight = 14;
    inputBox.counterAxisAlignItems = 'CENTER';
    inputBox.cornerRadius = 8;
    inputBox.fills = [{ type: 'SOLID', color: darkSurfaceRgb }];
    inputBox.strokes = [{ type: 'SOLID', color: neutralRgb }];
    inputBox.strokeWeight = 1;

    const placeholder = figma.createText();
    placeholder.fontName = { family: "Inter", style: "Regular" };
    placeholder.fontSize = 13;
    placeholder.characters = placeholderStr;
    placeholder.fills = [{ type: 'SOLID', color: hexToRgb('#7A8F76') }];
    inputBox.appendChild(placeholder);

    fieldContainer.appendChild(inputBox);
    return fieldContainer;
  }

  loginForm.appendChild(createInputField("Correo electrónico o DNI", "usuario@ejemplo.com", false));
  loginForm.appendChild(createInputField("Contraseña", "••••••••••••", true));

  // Botón Submit dentro del formulario
  const submitBtn = figma.createFrame();
  submitBtn.name = 'SubmitButton';
  submitBtn.layoutMode = 'HORIZONTAL';
  submitBtn.layoutAlign = 'STRETCH';
  submitBtn.counterAxisSizingMode = 'FIXED';
  submitBtn.resize(100, 46);
  submitBtn.primaryAxisAlignItems = 'CENTER';
  submitBtn.counterAxisAlignItems = 'CENTER';
  submitBtn.cornerRadius = 8;

  if (localStyles['Primary']) submitBtn.fillStyleId = localStyles['Primary'].id;
  else submitBtn.fills = [{ type: 'SOLID', color: primaryRgb }];

  const submitTxt = figma.createText();
  submitTxt.fontName = { family: "Inter", style: semiBoldStyle };
  submitTxt.fontSize = 15;
  submitTxt.characters = "Iniciar Sesión";
  if (localStyles['Deep Bg']) submitTxt.fillStyleId = localStyles['Deep Bg'].id;
  else submitTxt.fills = [{ type: 'SOLID', color: deepBgRgb }];
  submitBtn.appendChild(submitTxt);
  loginForm.appendChild(submitBtn);

  // Footer con link de registro
  const footerRow = figma.createFrame();
  footerRow.name = 'Footer';
  footerRow.layoutMode = 'HORIZONTAL';
  footerRow.layoutAlign = 'STRETCH';
  footerRow.primaryAxisAlignItems = 'CENTER';
  footerRow.fills = [];

  const footerTxt = figma.createText();
  footerTxt.fontName = { family: "Inter", style: "Regular" };
  footerTxt.fontSize = 12;
  footerTxt.characters = "¿No tienes una cuenta? Regístrate aquí";
  footerTxt.fills = [{ type: 'SOLID', color: lightMutedRgb }];
  footerRow.appendChild(footerTxt);
  loginForm.appendChild(footerRow);

  // ==========================================================================
  // COMPONENTE 3: AdminActionBtn (❖ Master Component Set con Variantes)
  // Botones operativos del Administrador (RF-12 y RF-13)
  // ==========================================================================
  console.log("Creando AdminActionBtn (Component Set con variantes)...");

  // Variante Primaria: Asignar Turno Manual
  const btnAsignar = figma.createComponent();
  btnAsignar.name = 'Action=AsignarTurno, Variant=Primary';
  btnAsignar.layoutMode = 'HORIZONTAL';
  btnAsignar.primaryAxisSizingMode = 'AUTO';
  btnAsignar.counterAxisSizingMode = 'AUTO';
  btnAsignar.primaryAxisAlignItems = 'CENTER';
  btnAsignar.counterAxisAlignItems = 'CENTER';
  btnAsignar.paddingLeft = 20;
  btnAsignar.paddingRight = 20;
  btnAsignar.paddingTop = 11;
  btnAsignar.paddingBottom = 11;
  btnAsignar.cornerRadius = 8;
  btnAsignar.itemSpacing = 8;

  if (localStyles['Primary']) btnAsignar.fillStyleId = localStyles['Primary'].id;
  else btnAsignar.fills = [{ type: 'SOLID', color: primaryRgb }];

  const plusIcon = figma.createText();
  plusIcon.fontName = { family: "Inter", style: "Bold" };
  plusIcon.fontSize = 16;
  plusIcon.characters = "+";
  if (localStyles['Deep Bg']) plusIcon.fillStyleId = localStyles['Deep Bg'].id;
  else plusIcon.fills = [{ type: 'SOLID', color: deepBgRgb }];
  btnAsignar.appendChild(plusIcon);

  const txtAsignar = figma.createText();
  txtAsignar.fontName = { family: "Inter", style: semiBoldStyle };
  txtAsignar.fontSize = 14;
  txtAsignar.characters = "Asignar Turno Manual";
  if (localStyles['Deep Bg']) txtAsignar.fillStyleId = localStyles['Deep Bg'].id;
  else txtAsignar.fills = [{ type: 'SOLID', color: deepBgRgb }];
  btnAsignar.appendChild(txtAsignar);

  // Variante Secundaria: Bloquear por Mantenimiento
  const btnBloquear = figma.createComponent();
  btnBloquear.name = 'Action=BloquearMantenimiento, Variant=Secondary';
  btnBloquear.layoutMode = 'HORIZONTAL';
  btnBloquear.primaryAxisSizingMode = 'AUTO';
  btnBloquear.counterAxisSizingMode = 'AUTO';
  btnBloquear.primaryAxisAlignItems = 'CENTER';
  btnBloquear.counterAxisAlignItems = 'CENTER';
  btnBloquear.paddingLeft = 20;
  btnBloquear.paddingRight = 20;
  btnBloquear.paddingTop = 11;
  btnBloquear.paddingBottom = 11;
  btnBloquear.cornerRadius = 8;
  btnBloquear.itemSpacing = 8;

  if (localStyles['Deep Bg']) btnBloquear.fillStyleId = localStyles['Deep Bg'].id;
  else btnBloquear.fills = [{ type: 'SOLID', color: deepBgRgb }];

  btnBloquear.strokes = [{ type: 'SOLID', color: hexToRgb('#689E5F') }];
  btnBloquear.strokeWeight = 1.5;

  const warnIcon = figma.createText();
  warnIcon.fontName = { family: "Inter", style: "Bold" };
  warnIcon.fontSize = 14;
  warnIcon.characters = "⊘";
  warnIcon.fills = [{ type: 'SOLID', color: hexToRgb('#57EF40') }];
  btnBloquear.appendChild(warnIcon);

  const txtBloquear = figma.createText();
  txtBloquear.fontName = { family: "Inter", style: semiBoldStyle };
  txtBloquear.fontSize = 14;
  txtBloquear.characters = "Bloquear por Mantenimiento";
  txtBloquear.fills = [{ type: 'SOLID', color: whiteRgb }];
  btnBloquear.appendChild(txtBloquear);

  // Agrupar variantes en un ComponentSet
  compPage.appendChild(btnAsignar);
  compPage.appendChild(btnBloquear);
  btnAsignar.x = originX + 860;
  btnAsignar.y = originY;
  btnBloquear.x = originX + 860;
  btnBloquear.y = originY + 70;

  const adminActionBtnSet = figma.combineAsVariants([btnAsignar, btnBloquear], compPage);
  adminActionBtnSet.name = 'AdminActionBtn';
  adminActionBtnSet.cornerRadius = 12;
  adminActionBtnSet.paddingLeft = 20;
  adminActionBtnSet.paddingRight = 20;
  adminActionBtnSet.paddingTop = 20;
  adminActionBtnSet.paddingBottom = 20;
  adminActionBtnSet.itemSpacing = 16;
  adminActionBtnSet.fills = [{ type: 'SOLID', color: hexToRgb('#161E15') }];
  adminActionBtnSet.strokes = [{ type: 'SOLID', color: neutralRgb }];
  adminActionBtnSet.strokeWeight = 1;
  adminActionBtnSet.x = originX + 860;
  adminActionBtnSet.y = originY;

  // Añadir RoleSelector y LoginForm a la página Componentes
  compPage.appendChild(roleSelector);
  compPage.appendChild(loginForm);

  // ==========================================================================
  // ACTUALIZACIÓN DE PANTALLA ADMIN DASHBOARD (RF-12 y RF-13)
  // Reemplazo del botón genérico "Nueva Reserva" por los nuevos botones
  // ==========================================================================
  const page1 = figma.root.children.find(p => p.name === 'Page 1');
  if (page1) {
    const adminDash = page1.children.find(c => c.name === 'admin-dashboard');
    if (adminDash) {
      console.log("Encontrado admin-dashboard en Page 1. Verificando botón de acciones...");
      const mainContent = adminDash.children.find(c => c.name === 'Main_Content');
      if (mainContent && mainContent.children.length > 0) {
        const topHeader = mainContent.children[0]; // Frame 99:44
        const oldButton = topHeader.children.find(c => c.name === 'Frame' && c.id === '99:48');
        
        // Limpiar contenedor previo si ya existe
        const prevActions = topHeader.children.find(c => c.name === 'admin-action-buttons');
        if (prevActions) prevActions.remove();

        // Crear un contenedor Auto Layout con las dos variantes de AdminActionBtn
        const actionsContainer = figma.createFrame();
        actionsContainer.name = 'admin-action-buttons';
        actionsContainer.layoutMode = 'HORIZONTAL';
        actionsContainer.itemSpacing = 12;
        actionsContainer.primaryAxisSizingMode = 'AUTO';
        actionsContainer.counterAxisSizingMode = 'AUTO';
        actionsContainer.counterAxisAlignItems = 'CENTER';
        actionsContainer.fills = [];

        // Instancia de Asignar Turno
        const instAsignar = btnAsignar.createInstance();
        actionsContainer.appendChild(instAsignar);

        // Instancia de Bloquear por Mantenimiento
        const instBloquear = btnBloquear.createInstance();
        actionsContainer.appendChild(instBloquear);

        topHeader.appendChild(actionsContainer);

        if (oldButton) {
          oldButton.visible = false; // Ocultamos el botón genérico legacy
          console.log("Botón legacy 'Nueva Reserva' (99:48) reemplazado por admin-action-buttons.");
        }
      }
    }
  }

  // ==========================================================================
  // SELECCIÓN Y NOTIFICACIÓN
  // ==========================================================================
  const createdComponents = [roleSelector, loginForm, adminActionBtnSet];
  figma.currentPage.selection = createdComponents;
  figma.viewport.scrollAndZoomIntoView(createdComponents);

  const successMsg = "❖ Componentes Maestros 'RoleSelector', 'LoginForm' y 'AdminActionBtn' creados con éxito. ¡Ya disponibles en la pestaña de Assets!";
  console.log("✅ " + successMsg);
  figma.notify(successMsg, { timeout: 6000 });
})();
