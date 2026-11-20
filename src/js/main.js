'use strict';

/* ---------------------------------------------------------
   Datos iniciales de la lista
   --------------------------------------------------------- */
const DEFAULT_GROUPS = [
  {
    name: 'Carnes, congelados y proteínas',
    items: ['Pechuga', 'Patitas de pollo', 'Cederiras', 'Muslo y ala', 'Carne chica', 'Cerdo', 'Osobuco', 'Falda', 'Pancho', 'Chorizo', 'Nuggets', 'Milanesas', 'Paté', 'Queso granulado', 'Jamón', 'Requesón', 'Papitas', 'Vori vori', 'Ñoquis', 'Ravioles', 'Disco de empanada', 'Atún', 'Sardina']
  },
  {
    name: 'Pastas, arroz y legumbres',
    items: ['Fideo moñito', 'Fideo dadito', 'Caracolito', 'Tallarín listón', 'Fideo nido', 'Arroz', 'Ramen', 'Fideo de arroz']
  },
  {
    name: 'Panificados',
    items: ['Pan', 'Pan sándwich', 'Pan de hamburguesa', 'Pan de pancho', 'Pan de ajo', 'Pan árabe', 'Rapidita', 'Coquito', 'Chipita']
  },
  {
    name: 'Desayuno, bebidas y snacks',
    items: ['Huevo', 'Leche', 'Vino', 'Jugos (Aquarius)', 'Ades manzana', 'Azúcar', 'Edulcorante', 'Galletitas (pepas, rumba, nikito frutilla/DDL, anillos de coco, Tippy, Terrabusi, Lincoln)', 'Alfajor (caja)', 'Turrón (caja)', 'Cereal (chocolate, maíz)', 'Maní desayuno chico', 'Papitas', 'Presunto', 'Saladix', 'Chuche sano', 'Café de soja', 'Dulce de guayaba / mermelada', 'Dulce de leche', 'Miel', 'Leche condensada', 'Caramelitos de miel', 'Yummy', 'Maní picante']
  },
  {
    name: 'Conservas y básicos',
    items: ['Conserva', 'Manteca', 'Sal', 'Sal condimentada', 'Salsa de pizza', 'Aceitunas', 'Vinagre de manzana']
  },
  {
    name: 'Condimentos',
    items: ['Condimentos limón y orégano / ajo y cebolla', 'Nuez moscada', 'Laurel', 'Romero', 'Provenzal', 'Orégano', 'Ají', 'Condimento para pollo', 'Albahaca', 'Comino', 'Flor de Jamaica', 'Cola de caballo']
  },
  {
    name: 'Harinas y repostería',
    items: ['Harina de maíz', 'Almidón de mandioca', 'Aceite', 'Harina L/C', 'Levadura seca', 'Royal', 'Canela', 'Yerba Indega', 'Pororó', 'Poroto', 'Mezcla para bizcocho / brownie (Mazei)']
  },
  {
    name: 'Salsas y aderezos',
    items: ['Mayonesa', 'Ketchup', 'Ahumada / Asado', 'Ajo', 'Savora']
  },
  {
    name: 'Verduras',
    items: ['Tomate', 'Repollo', 'Papa', 'Cebolla', 'Locote', 'Ajo', 'Zanahoria', 'Batata', 'Jengibre', 'Remolacha']
  },
  {
    name: 'Frutas',
    items: ['Limón', 'Uva', 'Banana', 'Manzana', 'Melón', 'Sandía', 'Piña', 'Naranja', 'Mandarina', 'Frutilla']
  },
  {
    name: 'Limpieza del hogar',
    items: ['Bolsa de basura 150 / 100 L', 'Esponjas', 'Detergente', 'Alambrillo', 'Guantes de látex', 'Trapo de piso', 'Papel higiénico', 'Servilleta', 'Confort concentrado', 'Jabón para ropa', 'Lavandina', 'Desodorante de ambiente', 'Mata todo', 'Stick mosquito', 'Mata todo para exterior']
  },
  {
    name: 'Higiene personal',
    items: ['Desodorantes', 'Toallita húmeda', 'Jabón antibacterial', 'Mode', 'Desodorante', 'Jabón Dove', 'Quitaesmalte']
  },
  {
    name: 'Descartables y cocina',
    items: ['Moldes de papel para air fryer', 'Papel aluminio', 'Papel manteca', 'Bolsas para congelar', 'Potes para congelar', 'Porta bizcochos para exhibidor', 'Tarteletas 4 / 6', 'Batidor de leche', 'Balanza']
  },
  {
    name: 'Hogar y ferretería',
    items: ['Estante para ropa sucia', 'Espejo mediano', 'Escuadras', 'Bisagras', 'Pasador de cerradura', 'Focos', 'Mata moscas raqueta', 'Vela de citronela / aromas']
  }
];

const $ = function (id) { return document.getElementById(id); };
const STATE_KEY = 'compra.shopping-list.v1';
const GUEST_KEY = STATE_KEY + '.guest';
const PROMOS_URL = 'https://yosoymitxel.github.io/promociones-tarjetas-bancos-paraguay-py/promos.json';
const SUPABASE_URL = 'https://uxhftljmnljmtyynzyie.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-SUBO7VrZiXyeWFRoXzZ9Q_4Vm5xS3g';
const AUTH_REDIRECT = 'https://yosoymitxel.github.io/Web-scrapping/';
const storage = {
  get: function (key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value == null ? fallback : JSON.parse(value);
    } catch (_) { return fallback; }
  },
  set: function (key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (_) { return false; }
  }
};
const normalize = function (value) {
  return String(value == null ? '' : value)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-PY').replace(/[^a-z0-9]+/g, ' ').trim();
};
const escapeHTML = function (value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (char) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char];
  });
};
const slug = function (value) {
  return normalize(value).replace(/\s+/g, '-').replace(/^-+|-+$/g, '');
};
const idFor = function (group, name) { return 'item-' + slug(group + '-' + name); };
const makeDefaultItems = function () {
  return DEFAULT_GROUPS.flatMap(function (group) {
    return group.items.map(function (name) {
      return {
        id: idFor(group.name, name),
        name: name,
        group: group.name,
        checked: false,
        priority: false,
        preferred: false,
        preferredStore: '',
        updatedAt: 0
      };
    });
  });
};
const DEFAULT_ITEMS = makeDefaultItems();
const defaultState = function () {
  return { version: 1, theme: 'light', themeUpdatedAt: 0, updatedAt: 0,
    groups: DEFAULT_GROUPS.map(function (group) { return group.name; }),
    deletedGroupNames: [], deletedItemIds: [],
    items: DEFAULT_ITEMS.map(function (item) { return Object.assign({}, item); }),
    calculatorLines: [], calculatorStore: '', priceHistory: [] };
};
const normalizeState = function (raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const incoming = Array.isArray(source.items) ? source.items : DEFAULT_ITEMS;
  const deletedItemIds = Array.from(new Set((Array.isArray(source.deletedItemIds) ? source.deletedItemIds : []).map(String)));
  const deletedGroupNames = Array.from(new Set((Array.isArray(source.deletedGroupNames) ? source.deletedGroupNames : []).map(String)));
  const deletedItems = new Set(deletedItemIds), deletedGroups = new Set(deletedGroupNames), byId = new Map();
  incoming.filter(function (item) { return item && typeof item === 'object' && typeof item.name === 'string' && item.name.trim(); }).forEach(function (item) {
    const group = String(item.group || 'Otros'), name = String(item.name).trim(), id = String(item.id || idFor(group, name));
    if (!deletedItems.has(id) && !deletedGroups.has(group)) byId.set(id, Object.assign({}, item, { id: id, group: group, name: name }));
  });
  const items = Array.from(byId.values());
  const sourceGroups = Array.isArray(source.groups) ? source.groups : DEFAULT_GROUPS.map(function (group) { return group.name; }).concat(items.map(function (item) { return item.group; }));
  const groups = Array.from(new Set(sourceGroups.map(function (name) { return String(name || '').trim(); }).filter(Boolean))).filter(function (name) { return !deletedGroups.has(name); });
  items.forEach(function (item) { if (!groups.includes(item.group) && !deletedGroups.has(item.group)) groups.push(item.group); });
  return {
    version: 1, theme: source.theme === 'dark' ? 'dark' : 'light',
    themeUpdatedAt: Number(source.themeUpdatedAt) || 0, updatedAt: Number(source.updatedAt) || 0,
    groups: groups, deletedGroupNames: deletedGroupNames, deletedItemIds: deletedItemIds, items: items,
    calculatorLines: Array.isArray(source.calculatorLines) ? source.calculatorLines.filter(function (line) { return line && typeof line === 'object' && typeof line.product === 'string'; }).map(function (line, index) {
      return Object.assign({}, line, { id: String(line.id || ('calc-' + index + '-' + slug(line.product))), itemId: String(line.itemId || ''), unitPrice: Number(line.unitPrice) || 0, quantity: Number(line.quantity) || 1, updatedAt: Number(line.updatedAt) || 0 });
    }) : [],
    calculatorStore: String(source.calculatorStore || ''),
    priceHistory: Array.isArray(source.priceHistory) ? source.priceHistory.filter(function (entry) { return entry && typeof entry === 'object' && typeof entry.itemId === 'string'; }) : []
  };
};

let session = storage.get('panel.sess', null);
let activeUserId = session && session.userId ? String(session.userId) : 'guest';
const initialAccountState = activeUserId === 'guest' ? null : storage.get(STATE_KEY + '.' + activeUserId, null);
let localBelongsToAccount = activeUserId === 'guest' || !!initialAccountState;
let state = normalizeState(initialAccountState || storage.get(GUEST_KEY, null) || defaultState());
let activeFilter = 'all';
let syncTimer = null;
let toastTimer = null;
let syncPromise = null;

const stateStorageKey = function () {
  return activeUserId === 'guest' ? GUEST_KEY : STATE_KEY + '.' + activeUserId;
};
const persistLocal = function () {
  if (activeUserId === 'guest' || localBelongsToAccount) storage.set(stateStorageKey(), state);
};
const formatMoney = function (amount) {
  const number = Number(amount) || 0;
  return '₲ ' + Math.round(number).toLocaleString('es-PY');
};
const localDate = function () {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Asuncion', year: 'numeric', month: '2-digit', day: '2-digit'
    }).formatToParts(new Date());
    const map = {};
    parts.forEach(function (part) { map[part.type] = part.value; });
    return map.year + '-' + map.month + '-' + map.day;
  } catch (_) { return new Date().toISOString().slice(0, 10); }
};
const parseAmount = function (value) {
  const parsed = Number(String(value == null ? '' : value).trim().replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};
const makeId = function () {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
  return 'price-' + Date.now() + '-' + Math.random().toString(36).slice(2, 10);
};
const showToast = function (message) {
  const element = $('toast');
  if (!element) return;
  element.textContent = message;
  element.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { element.classList.remove('visible'); }, 2200);
};
const setSyncStatus = function (mode) {
  const element = $('syncStatus');
  if (!element) return;
  element.classList.remove('synced', 'syncing', 'error');
  if (mode === 'synced') {
    element.textContent = 'Sincronizado';
    element.classList.add('synced');
  } else if (mode === 'syncing') {
    element.textContent = 'Sincronizando';
    element.classList.add('syncing');
  } else if (mode === 'error') {
    element.textContent = 'Sin conexión';
    element.classList.add('error');
  } else if (mode === 'account') {
    element.textContent = 'Cuenta';
    element.classList.add('synced');
  } else {
    element.textContent = 'Local';
  }
};
const getLastPrice = function (itemId) {
  return state.priceHistory.filter(function (entry) { return entry.itemId === itemId; })
    .sort(function (a, b) { return String(b.date || b.savedAt || '').localeCompare(String(a.date || a.savedAt || '')); })[0] || null;
};

/* ---------------------------------------------------------
   Lista: grupos plegables en masonry
   --------------------------------------------------------- */
const SHORT_GROUPS = {
  'Carnes, congelados y proteínas': 'Carnes y congelados',
  'Pastas, arroz y legumbres': 'Pastas y arroz',
  'Desayuno, bebidas y snacks': 'Desayuno y snacks',
  'Conservas y básicos': 'Conservas',
  'Harinas y repostería': 'Harinas',
  'Salsas y aderezos': 'Salsas',
  'Limpieza del hogar': 'Limpieza',
  'Higiene personal': 'Higiene',
  'Descartables y cocina': 'Cocina',
  'Hogar y ferretería': 'Hogar'
};
const openGroupNames = new Set();
let listInitialized = false;
const shortGroup = function (name) { return SHORT_GROUPS[name] || name; };
const countLabel = function (count, singular, plural) {
  return count + ' ' + (count === 1 ? singular : plural);
};
const ICON_FLAG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 21V4m0 0h11l-2 3 2 3H5"></path></svg>';
const ICON_STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.9L12 3z"></path></svg>';
const renderItem = function (item) {
  const last = getLastPrice(item.id);
  const priceHint = last ? '<span class="product-price-hint"><strong>' + escapeHTML(formatMoney(last.finalUnitPrice || last.total)) + '</strong>' + (last.supermarket ? ' · ' + escapeHTML(last.supermarket) : '') + '</span>' : '';
  return '<article class="product-row' + (item.checked ? ' is-done' : '') + '" data-item-id="' + escapeHTML(item.id) + '">' +
    '<label class="product-check"><input type="checkbox" data-check="' + escapeHTML(item.id) + '" ' + (item.checked ? 'checked' : '') + ' aria-label="Marcar ' + escapeHTML(item.name) + ' como comprado"></label>' +
    '<button class="product-main" type="button" data-open-calculator="' + escapeHTML(item.id) + '" title="' + escapeHTML(item.name) + '"><span class="product-name">' + escapeHTML(item.name) + '</span>' + priceHint + '</button>' +
    '<div class="product-actions">' +
    '<button class="tag-button priority" type="button" data-priority="' + escapeHTML(item.id) + '" aria-pressed="' + String(!!item.priority) + '" aria-label="Prioridad: ' + escapeHTML(item.name) + '" title="Prioridad">' + ICON_FLAG + '<span class="tag-label">Prioridad</span></button>' +
    '<button class="tag-button preferred" type="button" data-preferred="' + escapeHTML(item.id) + '" aria-pressed="' + String(!!item.preferred) + '" aria-label="Preferido: ' + escapeHTML(item.name) + '" title="Preferido">' + ICON_STAR + '<span class="tag-label">Preferido</span></button>' +
    '<button class="icon-action item-crud-action" type="button" data-edit-item="' + escapeHTML(item.id) + '" aria-label="Editar ' + escapeHTML(item.name) + '" title="Editar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4z"></path></svg></button>' +
    '<button class="icon-action item-crud-action danger-action" type="button" data-delete-item="' + escapeHTML(item.id) + '" aria-label="Eliminar ' + escapeHTML(item.name) + '" title="Eliminar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"></path></svg></button></div></article>';
};
const renderList = function () {
  const container = $('listContainer'); if (!container) return;
  const query = normalize($('searchInput').value);
  const filtered = state.items.filter(function (item) {
    const matchesText = !query || normalize(item.name + ' ' + item.group).includes(query);
    const matchesFilter = activeFilter === 'all' || (activeFilter === 'pending' && !item.checked) || (activeFilter === 'done' && item.checked) || (activeFilter === 'priority' && item.priority);
    return matchesText && matchesFilter;
  });
  const checkedTotal = state.items.filter(function (item) { return item.checked; }).length, total = state.items.length, pending = total - checkedTotal;
  $('progressNumber').textContent = checkedTotal + '/' + total;
  $('progressText').textContent = pending === 0 ? 'Lista completa' : countLabel(pending, 'pendiente', 'pendientes');
  $('progressBar').style.width = (total ? checkedTotal / total * 100 : 0) + '%';
  let resultLabel = countLabel(filtered.length, 'producto', 'productos');
  if (query) resultLabel = countLabel(filtered.length, 'resultado', 'resultados');
  else if (activeFilter === 'pending') resultLabel = countLabel(filtered.length, 'pendiente', 'pendientes');
  else if (activeFilter === 'priority') resultLabel = filtered.length + ' con prioridad';
  else if (activeFilter === 'done') resultLabel = countLabel(filtered.length, 'comprado', 'comprados');
  $('resultCount').textContent = resultLabel;
  const groups = Array.from(new Set((state.groups || []).concat(state.items.map(function (item) { return item.group; }))));
  if (!listInitialized) { listInitialized = true; if (window.matchMedia('(min-width: 700px)').matches) groups.forEach(function (name) { openGroupNames.add(name); }); }
  const forceOpen = !!query || activeFilter !== 'all';
  container.innerHTML = groups.map(function (groupName) {
    const allItems = state.items.filter(function (item) { return item.group === groupName; }), items = filtered.filter(function (item) { return item.group === groupName; });
    if (!items.length && (query || activeFilter !== 'all')) return '';
    const doneCount = allItems.filter(function (item) { return item.checked; }).length;
    const isOpen = forceOpen || openGroupNames.has(groupName), complete = allItems.length > 0 && doneCount === allItems.length;
    return '<details class="postit-group' + (complete ? ' is-complete' : '') + '" data-group="' + escapeHTML(groupName) + '"' + (isOpen ? ' open' : '') + '>' +
      '<summary class="postit-head"><span class="postit-title-wrap"><h2>' + escapeHTML(shortGroup(groupName)) + '</h2></span><span class="postit-progress">' + doneCount + '/' + allItems.length + '</span></summary>' +
      '<div class="postit-controls" aria-label="Acciones del grupo">' +
      '<button class="icon-action" type="button" data-add-item="' + escapeHTML(groupName) + '" aria-label="Agregar producto" title="Agregar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg></button>' +
      '<button class="icon-action" type="button" data-edit-group="' + escapeHTML(groupName) + '" aria-label="Editar grupo" title="Editar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5 4 4M4 20l4-.8L19 8a2.1 2.1 0 0 0-3-3L5 16l-1 4z"></path></svg></button>' +
      '<button class="icon-action danger-action" type="button" data-delete-group="' + escapeHTML(groupName) + '" aria-label="Eliminar grupo" title="Eliminar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"></path></svg></button></div>' +
      '<div class="postit-items">' + (items.length ? items.map(renderItem).join('') : '<p class="empty-group">Grupo vacío. Agregá un producto con +.</p>') + '</div></details>';
  }).join('') || '<div class="empty-state">No hay productos que coincidan.</div>';
  const productOptions = $('shoppingProductOptions');
  if (productOptions) productOptions.innerHTML = state.items.map(function (item) { return '<option value="' + escapeHTML(item.name) + '"></option>'; }).join('');
  $('historyCount').textContent = state.priceHistory.length + (state.priceHistory.length === 1 ? ' registro' : ' registros');
  $('listFooter').hidden = checkedTotal === 0; setSyncStatus(session ? 'account' : 'local');
};
const touchState = function () {
  state.updatedAt = Math.max(Date.now(), (Number(state.updatedAt) || 0) + 1);
  persistLocal();
  renderList();
  if (!$('calculatorView').hidden) renderCalculator();
  scheduleCloudSync();
};
const updateItem = function (id, patch) {
  const item = state.items.find(function (entry) { return entry.id === id; });
  if (!item) return;
  Object.assign(item, patch, { updatedAt: Date.now() });
  touchState();
};
let crudIntent = null;
const openCrudDialog = function (type, groupName, itemId) {
  const item = itemId ? state.items.find(function (entry) { return entry.id === itemId; }) : null;
  crudIntent = { type: type, groupName: groupName || '', itemId: itemId || '' };
  const titles = { 'group-add': 'Nuevo grupo', 'group-edit': 'Editar grupo', 'item-add': 'Nuevo producto', 'item-edit': 'Editar producto' };
  $('crudTitle').textContent = titles[type] || 'Editar';
  $('crudLabel').textContent = type.indexOf('group-') === 0 ? 'Nombre del grupo' : 'Nombre del producto';
  $('crudInput').value = type === 'group-edit' ? groupName : type === 'item-edit' ? item && item.name || '' : '';
  $('crudHint').textContent = type === 'item-add' ? 'Se agregará dentro de «' + groupName + '».' : '';
  $('crudDialog').showModal(); window.setTimeout(function () { $('crudInput').focus(); $('crudInput').select(); }, 0);
};
const closeCrudDialog = function () { crudIntent = null; $('crudDialog').close(); };
$('addGroupButton').addEventListener('click', function () { openCrudDialog('group-add'); });
$('crudClose').addEventListener('click', closeCrudDialog);
$('crudCancel').addEventListener('click', closeCrudDialog);
$('crudDialog').addEventListener('click', function (event) { if (event.target === $('crudDialog')) closeCrudDialog(); });
$('crudForm').addEventListener('submit', function (event) {
  event.preventDefault(); if (!crudIntent) return;
  const value = $('crudInput').value.trim(); if (!value) { $('crudInput').focus(); return; }
  const now = Date.now();
  if (crudIntent.type === 'group-add') {
    if (state.groups.some(function (name) { return normalize(name) === normalize(value); })) { $('crudHint').textContent = 'Ya existe un grupo con ese nombre.'; return; }
    state.groups.push(value); state.deletedGroupNames = state.deletedGroupNames.filter(function (name) { return name !== value; });
    openGroupNames.add(value); closeCrudDialog(); touchState(); showToast('Grupo agregado'); return;
  }
  if (crudIntent.type === 'group-edit') {
    const previous = crudIntent.groupName;
    if (normalize(previous) !== normalize(value) && state.groups.some(function (name) { return normalize(name) === normalize(value); })) { $('crudHint').textContent = 'Ya existe un grupo con ese nombre.'; return; }
    state.groups = state.groups.map(function (name) { return name === previous ? value : name; });
    state.items.forEach(function (item) { if (item.group === previous) { item.group = value; item.updatedAt = now; } });
    state.deletedGroupNames = Array.from(new Set(state.deletedGroupNames.concat([previous]))).filter(function (name) { return name !== value; });
    openGroupNames.delete(previous); openGroupNames.add(value); closeCrudDialog(); touchState(); showToast('Grupo actualizado'); return;
  }
  if (crudIntent.type === 'item-add') {
    const groupName = crudIntent.groupName;
    if (!state.groups.includes(groupName)) return;
    if (state.items.some(function (item) { return item.group === groupName && normalize(item.name) === normalize(value); })) { $('crudHint').textContent = 'Ese producto ya existe en el grupo.'; return; }
    state.items.push({ id: 'item-' + makeId(), name: value, group: groupName, checked: false, priority: false, preferred: false, preferredStore: '', updatedAt: now });
    openGroupNames.add(groupName); closeCrudDialog(); touchState(); showToast('Producto agregado'); return;
  }
  if (crudIntent.type === 'item-edit') {
    const item = state.items.find(function (entry) { return entry.id === crudIntent.itemId; }); if (!item) return;
    if (state.items.some(function (entry) { return entry.id !== item.id && entry.group === item.group && normalize(entry.name) === normalize(value); })) { $('crudHint').textContent = 'Ya existe un producto con ese nombre en este grupo.'; return; }
    item.name = value; item.updatedAt = now;
    state.calculatorLines.forEach(function (line) { if (line.itemId === item.id) line.product = value; });
    closeCrudDialog(); touchState(); showToast('Producto actualizado');
  }
});

$('listContainer').addEventListener('click', function (event) {
  const addItem = event.target.closest('[data-add-item]');
  if (addItem) { openCrudDialog('item-add', addItem.dataset.addItem); return; }
  const editGroup = event.target.closest('[data-edit-group]');
  if (editGroup) { openCrudDialog('group-edit', editGroup.dataset.editGroup); return; }
  const deleteGroup = event.target.closest('[data-delete-group]');
  if (deleteGroup) {
    const name = deleteGroup.dataset.deleteGroup, members = state.items.filter(function (item) { return item.group === name; });
    if (!window.confirm('Eliminar el grupo «' + name + '» y sus ' + members.length + ' productos? El historial se conservará.')) return;
    state.deletedGroupNames = Array.from(new Set(state.deletedGroupNames.concat([name])));
    members.forEach(function (item) { state.deletedItemIds = Array.from(new Set(state.deletedItemIds.concat([item.id]))); });
    state.items = state.items.filter(function (item) { return item.group !== name; });
    state.calculatorLines.forEach(function (line) { if (members.some(function (item) { return item.id === line.itemId; })) line.itemId = ''; });
    state.groups = state.groups.filter(function (group) { return group !== name; });
    openGroupNames.delete(name); touchState(); showToast('Grupo eliminado'); return;
  }
  const editItem = event.target.closest('[data-edit-item]');
  if (editItem) { const item = state.items.find(function (entry) { return entry.id === editItem.dataset.editItem; }); if (item) openCrudDialog('item-edit', item.group, item.id); return; }
  const deleteItem = event.target.closest('[data-delete-item]');
  if (deleteItem) {
    const id = deleteItem.dataset.deleteItem, item = state.items.find(function (entry) { return entry.id === id; });
    if (!item || !window.confirm('Eliminar «' + item.name + '» de la lista?')) return;
    state.deletedItemIds = Array.from(new Set(state.deletedItemIds.concat([id])));
    state.items = state.items.filter(function (entry) { return entry.id !== id; });
    state.calculatorLines.forEach(function (line) { if (line.itemId === id) line.itemId = ''; });
    touchState(); showToast('Producto eliminado'); return;
  }
  const priority = event.target.closest('[data-priority]');
  if (priority) {
    const id = priority.dataset.priority;
    const item = state.items.find(function (entry) { return entry.id === id; });
    if (item) updateItem(id, { priority: !item.priority });
    return;
  }
  const preferred = event.target.closest('[data-preferred]');
  if (preferred) {
    const id = preferred.dataset.preferred;
    const item = state.items.find(function (entry) { return entry.id === id; });
    if (item) updateItem(id, { preferred: !item.preferred, preferredStore: item.preferred ? '' : item.preferredStore });
    return;
  }
  const openCalc = event.target.closest('[data-open-calculator]');
  if (openCalc) openCalculatorForItem(openCalc.dataset.openCalculator);
});
$('listContainer').addEventListener('change', function (event) {
  const checkbox = event.target.closest('[data-check]');
  if (!checkbox) return;
  updateItem(checkbox.dataset.check, { checked: checkbox.checked });
});
$('searchInput').addEventListener('input', renderList);
$('filterButtons').addEventListener('click', function (event) {
  const button = event.target.closest('[data-filter]');
  if (!button) return;
  activeFilter = button.dataset.filter;
  $('filterButtons').querySelectorAll('[data-filter]').forEach(function (filter) {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  renderList();
});
$('clearDone').addEventListener('click', function () {
  const now = Date.now();
  state.items.forEach(function (item) {
    if (item.checked) Object.assign(item, { checked: false, updatedAt: now });
  });
  touchState();
  showToast('Comprados desmarcados');
});
$('listContainer').addEventListener('toggle', function (event) {
  const group = event.target.closest('details.postit-group');
  if (!group) return;
  if (group.open) openGroupNames.add(group.dataset.group);
  else openGroupNames.delete(group.dataset.group);
}, true);

/* ---------------------------------------------------------
   Navegación y tema
   --------------------------------------------------------- */
let activeView = 'list';
const viewScroll = { list: 0, calculator: 0, profile: 0 };
const scrollToCalculator = function () {
  window.requestAnimationFrame(function () {
    const calculator = $('calculatorView');
    const topbar = document.querySelector('.topbar');
    const offset = topbar ? topbar.offsetHeight : 0;
    const top = calculator.getBoundingClientRect().top + window.scrollY - offset - 8;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  });
};
const setView = function (name) {
  const view = ['list', 'calculator', 'profile'].includes(name) ? name : 'list';
  if (view === activeView) {
    if (view === 'calculator') scrollToCalculator();
    else window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  viewScroll[activeView] = window.scrollY;
  activeView = view;
  if (view !== 'calculator') returnToListAfterAdd = false;
  $('listView').hidden = view !== 'list';
  $('profileView').hidden = view !== 'profile';
  $('calculatorView').hidden = view !== 'calculator';
  $('listView').classList.toggle('active', view === 'list');
  $('profileView').classList.toggle('active', view === 'profile');
  $('calculatorView').classList.toggle('active', view === 'calculator');
  $('bottomNav').hidden = false;
  document.querySelectorAll('.nav-item').forEach(function (button) {
    const active = button.dataset.view === view;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  if (view === 'calculator') {
    renderCalculator();
    scrollToCalculator();
  } else {
    window.scrollTo({ top: viewScroll[view] || 0, behavior: 'smooth' });
  }
};
const openCalculatorForItem = function (itemId) {
  const item = state.items.find(function (entry) { return entry.id === itemId; });
  if (!item) return;
  returnToListAfterAdd = true;
  viewScroll.calculator = 0;
  selectedItemId = itemId;
  const previous = state.calculatorLines.find(function (line) { return line.itemId === itemId; });
  const last = getLastPrice(itemId);
  $('calcProductName').value = item.name;
  $('calcProductGroup').textContent = shortGroup(item.group);
  $('calcProductGroup').hidden = false;
  $('calcUnitPrice').value = previous ? String(previous.unitPrice) : last ? String(last.unitPrice || '') : '';
  $('calcQuantity').value = previous ? String(previous.quantity || 1) : last ? String(last.quantity || 1) : '1';
  $('calcLastPrice').textContent = last
    ? 'Último: ' + formatMoney(last.finalUnitPrice || last.total) + (last.supermarket ? ' · ' + last.supermarket : '')
    : '';
  $('addCalcItem').textContent = previous ? 'Actualizar' : 'Agregar';
  if (item.preferredStore) {
    $('storeSelect').value = item.preferredStore;
    if (state.calculatorStore !== item.preferredStore) {
      state.calculatorStore = item.preferredStore;
      stateLineChanged();
    }
    populateDiscountSelect(true);
  }
  setView('calculator');
  setTimeout(function () { $('calcUnitPrice').focus(); }, 40);
};
document.querySelectorAll('[data-view]').forEach(function (button) {
  button.addEventListener('click', function () { setView(button.dataset.view); });
});
const applyTheme = function () {
  const theme = state.theme === 'light' ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme === 'light' ? '#f1ecfa' : '#130f1c');
  document.querySelectorAll('[data-theme-choice]').forEach(function (button) {
    const active = button.dataset.themeChoice === state.theme;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
};
document.querySelectorAll('[data-theme-choice]').forEach(function (button) {
  button.addEventListener('click', function () {
    state.theme = button.dataset.themeChoice === 'light' ? 'light' : 'dark';
    state.themeUpdatedAt = Date.now();
    touchState();
    applyTheme();
  });
});

/* ---------------------------------------------------------
   Calculadora original preservada + promociones de supermercados
   --------------------------------------------------------- */
let promotions = [];
let promoLoadedAt = 0;
let selectedItemId = '';
let returnToListAfterAdd = false;
const stateLineChanged = function () {
  state.updatedAt = Math.max(Date.now(), (Number(state.updatedAt) || 0) + 1);
  persistLocal();
  scheduleCloudSync();
};
const formatNumber = function (number) {
  return Math.round(Number(number) || 0).toLocaleString('es-PY');
};
const normalizePromoCap = function (promo) {
  const direct = Number(promo && (promo.discount_cap || promo.max_discount || promo.maxDiscount || promo.top || promo.cap));
  if (Number.isFinite(direct) && direct > 0) return direct;
  const text = String((promo && promo.desc) || '') + ' ' + String((promo && promo.title) || '');
  const match = text.match(/(?:tope|maximo|máximo)\D{0,35}(?:gs\.?|guaran[ií]es|₲)?\s*([\d.]{3,})/i);
  if (!match) return 0;
  const value = Number(match[1].replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(value) ? value : 0;
};
const promotionDiscount = function (promo) {
  const direct = Number(promo && promo.discount_percent);
  if (Number.isFinite(direct) && direct > 0 && direct <= 100) return direct;
  const text = [promo && promo.title, promo && promo.desc].concat(Array.isArray(promo && promo.cards) ? promo.cards : []).join(' ');
  const match = text.match(/(\d{1,2}(?:[.,]\d+)?)\s*%\s*(?:off|descuento|dto|reintegro|cashback|dscto)?/i);
  const value = match ? Number(match[1].replace(',', '.')) : 0;
  return value > 0 && value <= 100 ? value : 0;
};
const isSupermarketPromo = function (promo) {
  const category = normalize(promo && promo.category);
  return category.includes('supermercado') ||
    normalize([promo && promo.title, promo && promo.desc].join(' ')).includes('mayorista');
};
const promotionStore = function (promo) {
  const explicit = String(promo && (promo.supermarket || promo.commerce || promo.store) || '').trim();
  if (explicit) return explicit;
  let title = String(promo && promo.title || '').trim();
  title = title.replace(/\s*[-–—]\s*(?:lunes|martes|mi[eé]rcoles|jueves|viernes|s[aá]bado|domingo)[^-–—]*$/i, '');
  title = title.replace(/\s+desde\s+el\s+\w+$/i, '');
  title = title.replace(/^\s*\d{1,2}(?:[.,]\d+)?\s*%\s*/i, '');
  title = title.replace(/reintegro|descuento|dto|off|cashback|dscto/gi, ' ');
  title = title.replace(/\s+/g, ' ').trim();
  if (!title || /^supermercados?$/i.test(title)) return 'Supermercado';
  return title;
};
const promotionBankLabel = function (promo) {
  return String(promo && (promo.bankShort || promo.bankId || 'Banco'));
};
const promotionLabel = function (promo) {
  const percent = promotionDiscount(promo);
  const cards = Array.isArray(promo.cards) && promo.cards.length ? ' · ' + promo.cards.join(', ') : '';
  const days = Array.isArray(promo.days) && promo.days.length ? ' · ' + promo.days.join(', ') : promo.when ? ' · ' + promo.when : '';
  return promotionBankLabel(promo) + ' · ' + (percent ? percent + '%' : 'beneficio') + cards + days;
};
const getPromoSearchText = function (promo) {
  return normalize([
    promotionStore(promo), promo && promo.title, promo && promo.desc, promo && promo.group,
    promo && promo.category, promo && promo.bankShort, promo && promo.bankId,
    Array.isArray(promo && promo.cards) ? promo.cards.join(' ') : '',
    Array.isArray(promo && promo.days) ? promo.days.join(' ') : '', promo && promo.when, promo && promo.validity
  ].join(' '));
};
const promoSearchScore = function (promo, query) {
  const store = normalize(promotionStore(promo)), title = normalize(promo && promo.title), full = getPromoSearchText(promo);
  if (!query) return 0;
  if (store === query || title === query) return 1000;
  if (store.startsWith(query) || title.startsWith(query)) return 900;
  if (store.includes(query) || title.includes(query)) return 800;
  const tokens = query.split(' ').filter(Boolean);
  const matched = tokens.filter(function (token) { return full.includes(token); }).length;
  return tokens.length && matched === tokens.length ? 600 : matched ? 300 + matched : 0;
};
const getStorePromotions = function () {
  const query = normalize($('storeSelect').value);
  return promotions.map(function (promo, index) {
    return { promo: promo, index: index, supermarket: isSupermarketPromo(promo), score: promoSearchScore(promo, query) };
  }).filter(function (entry) {
    return promotionDiscount(entry.promo) > 0 && (query ? entry.score > 0 : entry.supermarket);
  }).sort(function (a, b) {
    return Number(b.supermarket) - Number(a.supermarket) || b.score - a.score ||
      promotionDiscount(b.promo) - promotionDiscount(a.promo) ||
      promotionBankLabel(a.promo).localeCompare(promotionBankLabel(b.promo));
  });
};
const updatePromoStatus = function (mode) {
  const element = $('promoStatus');
  element.classList.remove('good');
  if (mode === 'live') {
    element.textContent = 'Ofertas al día';
    element.classList.add('good');
  } else if (mode === 'cached') {
    element.textContent = promotions.length ? 'Ofertas guardadas' : 'Sin ofertas';
    element.classList.add('good');
  } else {
    element.textContent = 'Sin ofertas';
  }
};
const populateStoreSelect = function () {
  const current = state.calculatorStore || $('storeSelect').value || '';
  const byStore = new Map();
  promotions.forEach(function (promo) {
    const store = promotionStore(promo); if (!store) return;
    const key = normalize(store), candidate = { store: store, promo: promo, supermarket: isSupermarketPromo(promo), percent: promotionDiscount(promo) };
    const previous = byStore.get(key);
    if (!previous || Number(candidate.supermarket) > Number(previous.supermarket) ||
        (candidate.supermarket === previous.supermarket && candidate.percent > previous.percent)) byStore.set(key, candidate);
  });
  const options = Array.from(byStore.values()).sort(function (a, b) {
    return Number(b.supermarket) - Number(a.supermarket) || a.store.localeCompare(b.store);
  });
  $('storeOptions').innerHTML = options.map(function (entry) {
    const cards = Array.isArray(entry.promo.cards) && entry.promo.cards.length ? ' · ' + entry.promo.cards.join(', ') : '';
    const detail = (entry.supermarket ? 'Supermercado' : String(entry.promo.category || 'Comercio')) +
      ' · ' + promotionBankLabel(entry.promo) + (entry.percent ? ' · ' + entry.percent + '%' : '') + cards;
    return '<option value="' + escapeHTML(entry.store) + '" label="' + escapeHTML(detail) + '"></option>';
  }).join('');
  $('storeSelect').value = current; state.calculatorStore = current;
  populateDiscountSelect(false);
};
const loadPromotions = async function () {
  const cached = storage.get('compra.promos.v2', null);
  if (cached && Array.isArray(cached.data)) {
    promotions = cached.data; promoLoadedAt = Number(cached.at) || 0; updatePromoStatus('cached'); populateStoreSelect();
  }
  try {
    const response = await fetch(PROMOS_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Formato de promociones no válido');
    storage.set('compra.promos.v2', { at: Date.now(), data: data });
    promotions = data; promoLoadedAt = Date.now(); updatePromoStatus('live');
    populateStoreSelect(); populateDiscountSelect(true); renderCalculator();
  } catch (error) {
    updatePromoStatus(promotions.length ? 'cached' : 'error');
    $('promoDescription').textContent = promotions.length ? 'No se pudieron actualizar las promociones. Se usa la copia local.' : 'No se pudieron cargar las promociones. Usá el descuento manual.';
    renderDiscountTable();
  }
};
const populateDiscountSelect = function (autoSuggest) {
  const current = $('levelSelect').value || '';
  const hasStore = !!normalize($('storeSelect').value);
  const offers = getStorePromotions(), groups = {};
  offers.forEach(function (entry) { const bank = promotionBankLabel(entry.promo); (groups[bank] ||= []).push(entry); });

  let html = '<option value="">Seleccioná un beneficio</option><option value="all">Comparar ofertas encontradas</option>';
  if (offers.length) {
    html += '<optgroup label="' + (hasStore ? 'Coincidencias de PromoScraper PY' : 'Supermercados disponibles') + '">';
    const bankOrder = Array.from(new Set(offers.map(function (entry) { return promotionBankLabel(entry.promo); })));
    bankOrder.forEach(function (bank) {
      groups[bank].forEach(function (entry) {
        const promo = entry.promo, cards = Array.isArray(promo.cards) && promo.cards.length ? ' · ' + promo.cards.join(', ') : '';
        html += '<option value="promo:' + entry.index + '">' + escapeHTML(bank + ' · ' + promotionDiscount(promo) + '%' + cards + ' · ' + promotionStore(promo)) + '</option>';
      });
    });
    html += '</optgroup>';
  }
  html += '<optgroup label="Porcentaje de descuento">';
  for (let percent = 5; percent <= 90; percent += 5) {
    html += '<option value="percent:' + percent + '">' + percent + '% de descuento</option>';
  }
  html += '</optgroup><option value="manual">Descuento manual</option>';
  $('levelSelect').innerHTML = html;

  let preferred = current;
  const isIndependentDiscount = current === 'manual' || current.indexOf('percent:') === 0;
  if (!hasStore && !isIndependentDiscount) preferred = '';
  if (autoSuggest && hasStore && !preferred && offers.length) preferred = 'promo:' + offers[0].index;
  const valid = Array.from($('levelSelect').options).some(function (option) { return option.value === preferred; });
  $('levelSelect').value = valid ? preferred : '';
  renderDiscountTable();
};
const calculatePromoDiscount = function (total, promo, usedCap) {
  const percent = promotionDiscount(promo);
  const cap = normalizePromoCap(promo);
  let saving = total * percent / 100;
  if (cap > 0) saving = Math.min(saving, Math.max(cap - usedCap, 0));
  saving = Math.min(total, saving);
  return { percent: percent, cap: cap, saving: saving, final: Math.max(0, total - saving) };
};
const getCartTotal = function () {
  return state.calculatorLines.reduce(function (sum, line) {
    return sum + Math.max(0, Number(line.unitPrice) || 0) * Math.max(0, Number(line.quantity) || 0);
  }, 0);
};
const parseEquation = function (equation) {
  const source = String(equation || '').replace(/,/g, '.').replace(/[^0-9+*.\s]/g, '');
  if (!source.trim()) return [];
  const previous = state.calculatorLines.slice();
  return source.split('+').map(function (raw, index) {
    const term = raw.trim();
    const match = term.match(/^(\d+(?:\.\d+)?)(?:\*(\d+(?:\.\d+)?))?$/);
    if (!match) return null;
    const old = previous[index] || {};
    return {
      id: old.id || makeId(),
      itemId: old.itemId || '',
      product: old.product || ('Producto libre ' + (index + 1)),
      unitPrice: Number(match[1]),
      quantity: match[2] == null ? 1 : Number(match[2]),
      updatedAt: Date.now()
    };
  }).filter(function (line) { return line && line.unitPrice >= 0 && line.quantity > 0; });
};
const generateEquation = function () {
  return state.calculatorLines.map(function (line) {
    const price = String(Number(line.unitPrice) || 0);
    const quantity = Number(line.quantity) || 1;
    return quantity === 1 ? price : price + '*' + quantity;
  }).join('+');
};
const renderCartTable = function () {
  const lines = state.calculatorLines;
  const empty = lines.length === 0;
  $('calcLineCount').textContent = countLabel(lines.length, 'producto', 'productos');
  $('calcLinesBody').innerHTML = lines.length ? lines.map(function (line) {
    const subtotal = (Number(line.unitPrice) || 0) * (Number(line.quantity) || 1);
    return '<div class="cart-line" data-line-id="' + escapeHTML(line.id) + '">' +
      '<div class="cart-line-title"><span class="cart-product-name" title="' + escapeHTML(line.product || 'Producto libre') + '">' + escapeHTML(line.product || 'Producto libre') + '</span></div>' +
      '<input class="table-input" type="number" min="0" step="1" inputmode="numeric" data-edit-price="' + escapeHTML(line.id) + '" value="' + escapeHTML(String(line.unitPrice)) + '" aria-label="Precio unitario de ' + escapeHTML(line.product) + '">' +
      '<input class="table-input" type="number" min="0.01" step="any" inputmode="decimal" data-edit-quantity="' + escapeHTML(line.id) + '" value="' + escapeHTML(String(line.quantity)) + '" aria-label="Cantidad de ' + escapeHTML(line.product) + '">' +
      '<div class="cart-line-total"><strong>' + escapeHTML(formatMoney(subtotal)) + '</strong></div>' +
      '<button class="remove-line" type="button" data-remove-line="' + escapeHTML(line.id) + '" aria-label="Quitar ' + escapeHTML(line.product) + '">×</button>' +
    '</div>';
  }).join('') : '<p class="cart-empty">Sin productos.</p>';
  $('saveCalcPrices').disabled = empty;
  $('exportCalcCsv').disabled = empty;
  $('clearCalculator').disabled = empty;
  $('calcFinalRow').hidden = empty;
  $('calcCartFooter').hidden = empty;
  $('totalAmount').textContent = formatMoney(getCartTotal());
};
const getDiscountRows = function () {
  const selected = $('levelSelect').value || '';
  const used = Math.max(0, parseAmount($('topeUsadoInput').value));
  const total = getCartTotal();

  if (selected === 'manual') {
    const percent = Math.max(0, Math.min(100, parseAmount($('manualDiscountInput').value)));
    const saving = total * percent / 100;
    return [{
      key: 'manual', type: 'manual', name: 'Descuento manual',
      bank: 'Manual', percent: percent, cap: 0,
      saving: saving, final: Math.max(0, total - saving)
    }];
  }

  if (selected.indexOf('percent:') === 0) {
    const percent = Math.max(5, Math.min(90, Number(selected.slice(8)) || 0));
    const saving = total * percent / 100;
    return [{
      key: selected, type: 'percentage', name: 'Descuento ' + percent + '%',
      bank: 'Porcentaje', percent: percent, cap: 0,
      saving: saving, final: Math.max(0, total - saving)
    }];
  }

  if (selected.indexOf('promo:') === 0) {
    const index = Number(selected.slice(6));
    const promo = promotions[index];
    return promo ? [Object.assign({ key: selected, type: 'promo', promo: promo, index: index, name: promotionStore(promo), bank: promotionBankLabel(promo) },
      calculatePromoDiscount(total, promo, used))] : [];
  }

  return getStorePromotions().map(function (entry) {
    return Object.assign({
      key: 'promo:' + entry.index, type: 'promo', promo: entry.promo,
      index: entry.index, name: promotionStore(entry.promo), bank: promotionBankLabel(entry.promo)
    }, calculatePromoDiscount(total, entry.promo, used));
  });
};
const bestDiscount = function (rows) {
  return rows.slice().sort(function (a, b) { return b.saving - a.saving; })[0] || null;
};
const updateSummaryDiscount = function (rows) {
  const selected = $('levelSelect').value || 'all';
  let active = selected === 'all' ? bestDiscount(rows) : rows[0] || null;
  if (!active) active = { saving: 0, final: getCartTotal() };
  if (selected === 'manual') {
    const percent = Math.max(0, Math.min(100, parseAmount($('manualDiscountInput').value)));
    active.saving = getCartTotal() * percent / 100;
    active.final = getCartTotal() - active.saving;
  }
  $('discountAmount').textContent = formatMoney(active.saving || 0);
  const final = active.final == null ? getCartTotal() : active.final;
  $('finalAmount').textContent = formatMoney(final);
};
const renderDiscountTable = function () {
  if (!$('totalTable')) return;
  const rows = getDiscountRows();
  const selected = $('levelSelect').value || 'all';
  const compareAll = selected === 'all';
  const bestKey = (bestDiscount(rows) || {}).key;
  const isChosen = function (row) { return selected === row.key || (compareAll && row.key === bestKey); };
  const secondary = function (row) {
    if (row.type === 'promo') {
      const cards = (row.promo.cards || []).join(', ');
      const days = (row.promo.days || []).join(', ');
      return [row.bank, cards, days].filter(Boolean).join(' · ');
    }
    if (row.type === 'manual') return '';
    return [row.bank, row.level && row.level.category].filter(Boolean).join(' · ');
  };
  const capText = function (row) { return row.cap ? formatMoney(row.cap) : 'Sin tope'; };

  $('totalTable').querySelector('tbody').innerHTML = rows.length ? rows.map(function (row) {
    const action = row.key === 'manual' ? '' : '<button class="use-offer" type="button" data-use-discount="' + escapeHTML(row.key) + '">' + (isChosen(row) ? 'En uso' : 'Usar') + '</button>';
    return '<tr class="' + (isChosen(row) ? 'offer-selected' : '') + '">' +
      '<td><strong>' + escapeHTML(row.name) + '</strong><small>' + escapeHTML(secondary(row)) + '</small></td>' +
      '<td>' + escapeHTML(row.bank || '') + '</td>' +
      '<td><strong>' + formatNumber(row.percent) + '%</strong></td>' +
      '<td>' + escapeHTML(formatMoney(row.final)) + '</td>' +
      '<td class="saving-value">' + escapeHTML(formatMoney(row.saving)) + '</td>' +
      '<td>' + escapeHTML(capText(row)) + '</td><td>' + action + '</td></tr>';
  }).join('') : '<tr><td colspan="7" class="table-empty">Sin descuentos para esta selección.</td></tr>';

  $('discountCards').innerHTML = rows.length ? rows.map(function (row) {
    const action = row.key === 'manual' ? '' : '<button class="use-offer" type="button" data-use-discount="' + escapeHTML(row.key) + '">' + (isChosen(row) ? 'En uso' : 'Usar') + '</button>';
    return '<article class="offer-card' + (isChosen(row) ? ' is-selected' : '') + '">' +
      '<div class="offer-top"><div class="offer-name"><strong>' + escapeHTML(row.name) + '</strong><small>' + escapeHTML(secondary(row)) + '</small></div>' +
        '<span class="offer-percent">' + formatNumber(row.percent) + '%</span></div>' +
      '<div class="offer-math"><span>Costo neto <strong>' + escapeHTML(formatMoney(row.final)) + '</strong></span>' +
        '<span class="saving-value">Reintegro <strong>' + escapeHTML(formatMoney(row.saving)) + '</strong></span></div>' +
      '<div class="offer-foot"><small>Tope ' + escapeHTML(capText(row)) + '</small>' + action + '</div>' +
    '</article>';
  }).join('') : '<p class="offer-empty">Sin descuentos para esta selección.</p>';
  $('discountSummaryCount').textContent = rows.length ? countLabel(rows.length, 'oferta', 'ofertas') : 'Sin ofertas';

  const store = $('storeSelect').value;
  const offers = getStorePromotions();
  if (store) {
    $('promoDescription').textContent = offers.length
      ? countLabel(offers.length, 'beneficio', 'beneficios') + ' encontrados. La primera opción prioriza supermercados; podés cambiar la tarjeta.'
      : 'No encontramos beneficios con porcentaje para «' + store + '». Probá otro término o usá el descuento manual.';
  } else {
    $('promoDescription').textContent = 'Mostrando primero supermercados. Escribí un comercio para buscar en todo PromoScraper PY.';
  }
  updateSummaryDiscount(rows);
};
const renderCalculator = function () {
  if (!$('calculatorView') || $('calculatorView').hidden) return;
  renderCartTable();
  renderDiscountTable();
};
const updateEquation = function () {
  $('calculatorInput').value = generateEquation();
};
const addPurchaseLine = function () {
  const name = $('calcProductName').value.trim() || ('Producto libre ' + (state.calculatorLines.length + 1));
  const unitPrice = parseAmount($('calcUnitPrice').value);
  const quantity = parseAmount($('calcQuantity').value);
  if (!(unitPrice > 0)) { $('calcUnitPrice').focus(); showToast('Ingresá un precio válido'); return; }
  if (!(quantity > 0)) { $('calcQuantity').focus(); showToast('Ingresá una cantidad válida'); return; }
  const fromList = returnToListAfterAdd;
  returnToListAfterAdd = false;
  const chosenBenefit = $('levelSelect').value || 'all';
  const selectedPromo = chosenBenefit.indexOf('promo:') === 0 ? promotions[Number(chosenBenefit.slice(6))] : null;
  const selectedStore = selectedPromo ? promotionStore(selectedPromo) : $('storeSelect').value;
  let linkedItem = state.items.find(function (item) { return item.id === selectedItemId; }) || null;
  if (!linkedItem) {
    linkedItem = state.items.find(function (item) { return normalize(item.name) === normalize(name); }) || null;
  }
  const itemId = linkedItem ? linkedItem.id : '';
  const existing = itemId ? state.calculatorLines.find(function (line) { return line.itemId === itemId; }) : null;
  if (existing) {
    Object.assign(existing, { product: name, unitPrice: unitPrice, quantity: quantity, updatedAt: Date.now() });
  } else {
    state.calculatorLines.push({
      id: makeId(), itemId: itemId, product: name,
      unitPrice: unitPrice, quantity: quantity, updatedAt: Date.now()
    });
  }
  if (linkedItem) {
    linkedItem.checked = true;
    linkedItem.updatedAt = Date.now();
    if (selectedStore && !linkedItem.preferredStore) {
      linkedItem.preferredStore = selectedStore;
      linkedItem.preferred = true;
    }
  }
  selectedItemId = '';
  $('calcProductName').value = '';
  $('calcProductGroup').textContent = 'Libre';
  $('calcProductGroup').hidden = true;
  $('calcUnitPrice').value = '';
  $('calcQuantity').value = '1';
  $('calcLastPrice').textContent = '';
  $('addCalcItem').textContent = 'Agregar';
  state.calculatorStore = $('storeSelect').value;
  stateLineChanged();
  updateEquation();
  renderCalculator();
  if (linkedItem) renderList();
  if (fromList) setView('list');
  showToast(itemId ? 'Agregado a la compra' : 'Producto libre agregado');
};
$('addCalcItem').addEventListener('click', addPurchaseLine);
$('calcProductName').addEventListener('input', function () {
  const item = state.items.find(function (entry) { return entry.id === selectedItemId; });
  if (item && normalize(item.name) !== normalize(this.value)) {
    selectedItemId = '';
    $('calcProductGroup').textContent = 'Libre';
    $('calcProductGroup').hidden = true;
    $('addCalcItem').textContent = 'Agregar';
  }
});
const refreshStoreSearch = function () {
  state.calculatorStore = $('storeSelect').value.trim();
  stateLineChanged();
  populateDiscountSelect(true);
};
$('storeSelect').addEventListener('input', refreshStoreSearch);
$('storeSelect').addEventListener('change', refreshStoreSearch);
$('levelSelect').addEventListener('change', function () {
  const selected = this.value || '';
  if (selected.indexOf('percent:') === 0) $('manualDiscountInput').value = selected.slice(8);
  renderDiscountTable();
});
$('topeUsadoInput').addEventListener('input', renderDiscountTable);
$('manualDiscountInput').addEventListener('input', function () {
  if (($('levelSelect').value || '').indexOf('percent:') === 0) $('levelSelect').value = 'manual';
  renderDiscountTable();
});
$('discountCompare').addEventListener('click', function (event) {
  const button = event.target.closest('[data-use-discount]');
  if (!button) return;
  const key = button.dataset.useDiscount;
  $('levelSelect').value = key;
  if (key.indexOf('promo:') === 0) {
    const promo = promotions[Number(key.slice(6))];
    if (promo) {
      $('storeSelect').value = promotionStore(promo);
      state.calculatorStore = $('storeSelect').value;
      stateLineChanged();
      populateDiscountSelect();
      $('levelSelect').value = key;
    }
  }
  renderDiscountTable();
});
$('calcLinesBody').addEventListener('change', function (event) {
  const priceInput = event.target.closest('[data-edit-price]');
  const quantityInput = event.target.closest('[data-edit-quantity]');
  const id = priceInput ? priceInput.dataset.editPrice : quantityInput ? quantityInput.dataset.editQuantity : '';
  if (!id) return;
  const line = state.calculatorLines.find(function (entry) { return entry.id === id; });
  if (!line) return;
  if (priceInput) line.unitPrice = Math.max(0, parseAmount(priceInput.value));
  if (quantityInput) line.quantity = Math.max(.01, parseAmount(quantityInput.value));
  line.updatedAt = Date.now();
  stateLineChanged();
  updateEquation();
  renderCalculator();
});
$('calcLinesBody').addEventListener('click', function (event) {
  const remove = event.target.closest('[data-remove-line]');
  if (!remove) return;
  state.calculatorLines = state.calculatorLines.filter(function (line) { return line.id !== remove.dataset.removeLine; });
  stateLineChanged();
  updateEquation();
  renderCalculator();
});
$('calculatorInput').addEventListener('input', function () {
  state.calculatorLines = parseEquation(this.value);
  stateLineChanged();
  renderCartTable();
  renderDiscountTable();
});
$('calculatorKeys').addEventListener('click', function (event) {
  const button = event.target.closest('[data-key]');
  if (!button) return;
  const key = button.dataset.key;
  let equation = $('calculatorInput').value;
  if (key === 'C') equation = equation.slice(0, -1);
  else if (key === 'CE') equation = '';
  else equation += key;
  $('calculatorInput').value = equation;
  $('calculatorInput').dispatchEvent(new Event('input', { bubbles: true }));
});
$('toggleCalculator').addEventListener('click', function () {
  const showRule = $('reglaTresCalculator').hidden;
  $('reglaTresCalculator').hidden = !showRule;
  $('mainCalculator').hidden = showRule;
  this.textContent = showRule ? 'Volver a calculadora' : 'Regla de tres';
});
const calculateRuleOfThree = function () {
  const a = parseAmount($('reglatres_a').value);
  const b = parseAmount($('reglatres_b').value);
  const c = parseAmount($('reglatres_c').value);
  $('reglatres_result').value = a ? formatNumber((b * c) / a) : '';
};
['reglatres_a', 'reglatres_b', 'reglatres_c'].forEach(function (id) {
  $(id).addEventListener('input', calculateRuleOfThree);
});
$('clearCalculator').addEventListener('click', function () {
  if (!state.calculatorLines.length) return;
  state.calculatorLines = [];
  stateLineChanged();
  updateEquation();
  renderCalculator();
  showToast('Compra vaciada');
});
const currentDiscountForSaving = function () {
  const rows = getDiscountRows();
  const selected = $('levelSelect').value || 'all';
  if (selected === 'manual') return { result: bestDiscount(rows), promo: null, percent: Math.max(0, Math.min(100, parseAmount($('manualDiscountInput').value))) };
  let row = rows.find(function (entry) { return entry.key === selected; });
  if (!row) row = bestDiscount(rows);
  return {
    result: row,
    promo: row && row.type === 'promo' ? row.promo : null,
    percent: row ? row.percent : 0
  };
};
$('saveCalcPrices').addEventListener('click', function () {
  if (!state.calculatorLines.length) { showToast('No hay productos para guardar'); return; }
  const chosen = currentDiscountForSaving();
  const subtotal = getCartTotal();
  const saving = chosen.result ? chosen.result.saving : 0;
  const store = chosen.promo ? promotionStore(chosen.promo) : $('storeSelect').value;
  const date = localDate();
  state.calculatorLines.forEach(function (line) {
    const lineSubtotal = Number(line.unitPrice) * Number(line.quantity);
    const part = subtotal > 0 ? saving * lineSubtotal / subtotal : 0;
    const final = Math.max(0, lineSubtotal - part);
    const promo = chosen.promo;
    state.priceHistory.push({
      id: makeId(), itemId: line.itemId || '', product: line.product,
      unitPrice: Number(line.unitPrice), quantity: Number(line.quantity),
      subtotal: lineSubtotal, discountPercent: chosen.percent,
      discountCap: chosen.result && chosen.result.cap || null,
      discountAmount: part, total: final,
      finalUnitPrice: final / Math.max(.000001, Number(line.quantity)),
      supermarket: store,
      bank: promo ? promotionBankLabel(promo) : '',
      cards: promo && Array.isArray(promo.cards) ? promo.cards.slice() : [],
      promotionTitle: promo ? String(promo.group || promo.title || '') : chosen.result ? chosen.result.name : '',
      promotionDays: promo && Array.isArray(promo.days) ? promo.days.slice() : [],
      promotionValidity: promo ? String(promo.validity || '') : '',
      date: date, savedAt: new Date().toISOString()
    });
    if (line.itemId) {
      const item = state.items.find(function (entry) { return entry.id === line.itemId; });
      if (item) {
        item.updatedAt = Date.now();
        if (store) item.preferredStore = store;
      }
    }
  });
  if (state.priceHistory.length > 5000) state.priceHistory = state.priceHistory.slice(-5000);
  stateLineChanged();
  renderList();
  renderCalculator();
  showToast(state.calculatorLines.length + ' precios guardados');
});
const exportCalculatorCSV = function () {
  const chosen = currentDiscountForSaving();
  const rows = [
    ['Producto', 'Precio unitario', 'Cantidad', 'Subtotal', 'Supermercado', 'Banco', 'Promoción', 'Descuento %', 'Descuento aplicado', 'Total final', 'Fecha']
  ];
  state.calculatorLines.forEach(function (line) {
    const subtotal = Number(line.unitPrice) * Number(line.quantity);
    const saving = getCartTotal() > 0 && chosen.result ? chosen.result.saving * subtotal / getCartTotal() : 0;
    rows.push([
      line.product, line.unitPrice, line.quantity, subtotal, chosen.promo ? promotionStore(chosen.promo) : $('storeSelect').value,
      chosen.promo ? promotionBankLabel(chosen.promo) : '',
      chosen.promo ? chosen.promo.title : chosen.result ? chosen.result.name : '',
      chosen.percent, saving, subtotal - saving, localDate()
    ]);
  });
  const csv = '\uFEFF' + rows.map(function (row) { return row.map(csvCell).join(';'); }).join('\r\n');
  downloadFile('sumatoria-compra-' + localDate() + '.csv', csv, 'text/csv;charset=utf-8');
};
$('exportCalcCsv').addEventListener('click', exportCalculatorCSV);
/* ---------------------------------------------------------
   Exportación e importación
   --------------------------------------------------------- */
const downloadFile = function (name, content, type) {
  const blob = new Blob([content], { type: type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
};
const exportJSON = function () {
  const backup = {
    application: 'Compra · Lista y descuentos',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    shoppingList: state
  };
  downloadFile('compra-respaldo-' + localDate() + '.json', JSON.stringify(backup, null, 2), 'application/json;charset=utf-8');
  $('backupMessage').textContent = 'Respaldo exportado.';
};
const csvCell = function (value) {
  const text = String(value == null ? '' : value);
  return '"' + text.replace(/"/g, '""') + '"';
};
const exportCSV = function () {
  const rows = [
    ['Fecha', 'Producto', 'Precio unitario', 'Cantidad', 'Subtotal', 'Descuento %', 'Descuento aplicado', 'Total', 'Precio unitario final', 'Supermercado', 'Banco', 'Tarjetas', 'Promocion', 'Vigencia']
  ];
  state.priceHistory.slice().sort(function (a, b) {
    return String(a.date || '').localeCompare(String(b.date || ''));
  }).forEach(function (entry) {
    rows.push([
      entry.date, entry.product, entry.unitPrice, entry.quantity, entry.subtotal,
      entry.discountPercent, entry.discountAmount, entry.total, entry.finalUnitPrice,
      entry.supermarket, entry.bank, (entry.cards || []).join(' / '),
      entry.promotionTitle, entry.promotionValidity
    ]);
  });
  const csv = '\uFEFF' + rows.map(function (row) { return row.map(csvCell).join(';'); }).join('\r\n');
  downloadFile('historial-precios-' + localDate() + '.csv', csv, 'text/csv;charset=utf-8');
  $('backupMessage').textContent = 'Historial exportado.';
};
$('exportJson').addEventListener('click', exportJSON);
$('exportCsv').addEventListener('click', exportCSV);
$('importButton').addEventListener('click', function () { $('importFile').click(); });
$('importFile').addEventListener('change', async function () {
  const file = this.files && this.files[0];
  if (!file) return;
  try {
    if (file.size > 10 * 1024 * 1024) throw new Error('El respaldo supera los 10 MB.');
    const parsed = JSON.parse(await file.text());
    const imported = parsed.shoppingList || parsed.state || parsed;
    if (!Array.isArray(imported.items)) throw new Error('El archivo no contiene una lista compatible.');
    if (!window.confirm('Se restaurará el respaldo y se fusionarán los precios con tu historial. ¿Continuar?')) return;
    state = normalizeState(imported);
    const now = Date.now();
    state.items.forEach(function (item) { item.updatedAt = now; });
    state.updatedAt = now;
    state.themeUpdatedAt = now;
    localBelongsToAccount = activeUserId === 'guest' || !!session;
    persistLocal();
    applyTheme();
    renderList();
    scheduleCloudSync();
    $('backupMessage').textContent = 'Respaldo importado.';
    showToast('Respaldo importado');
  } catch (error) {
    $('backupMessage').textContent = 'No se pudo importar: ' + String(error.message || error);
  } finally {
    this.value = '';
  }
});

/* ---------------------------------------------------------
   Supabase Auth + sincronización por perfil
   Reutiliza panel_profiles.data.shoppingList del panel.
   --------------------------------------------------------- */
const supabaseRequest = async function (path, options, accessToken) {
  const opts = options || {};
  const headers = Object.assign({
    apikey: SUPABASE_KEY,
    'Content-Type': 'application/json'
  }, accessToken ? { Authorization: 'Bearer ' + accessToken } : {}, opts.headers || {});
  const response = await fetch(SUPABASE_URL + path, Object.assign({}, opts, { headers: headers }));
  const data = response.status === 204 ? null : await response.json().catch(function () { return null; });
  if (!response.ok) {
    const detail = data && (data.msg || data.message || data.error_description || data.error) || response.status;
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
  }
  return data;
};
const persistSession = function (data) {
  session = {
    token: data.access_token,
    refresh: data.refresh_token,
    until: Date.now() + (Number(data.expires_in || 3600) - 60) * 1000,
    email: data.user && data.user.email || session && session.email || '',
    userId: data.user && data.user.id || session && session.userId || ''
  };
  storage.set('panel.sess', session);
};
const switchUser = function (userId) {
  activeUserId = userId || 'guest';
  const saved = activeUserId === 'guest' ? storage.get(GUEST_KEY, null) : storage.get(STATE_KEY + '.' + activeUserId, null);
  localBelongsToAccount = activeUserId === 'guest' || !!saved;
  state = normalizeState(saved || storage.get(GUEST_KEY, null) || defaultState());
  applyTheme();
  persistLocal();
  renderList();
};
const getAccessToken = async function () {
  if (!session) return null;
  if (!session.token || !session.refresh || Date.now() >= Number(session.until || 0)) {
    try {
      const refreshed = await supabaseRequest('/auth/v1/token?grant_type=refresh_token', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: session.refresh })
      });
      persistSession(refreshed);
    } catch (error) {
      session = null;
      storage.set('panel.sess', null);
      switchUser('guest');
      renderAccount();
      setSyncStatus('local');
      throw error;
    }
  }
  return session.token;
};
const readCloudProfile = async function (token) {
  const rows = await supabaseRequest('/rest/v1/panel_profiles?select=data&limit=1', {}, token);
  return rows && rows[0] && rows[0].data && typeof rows[0].data === 'object' ? rows[0].data : null;
};
const mergeStates = function (local, remote) {
  const left = normalizeState(local), right = normalizeState(remote);
  const deletedItemIds = Array.from(new Set(left.deletedItemIds.concat(right.deletedItemIds)));
  const deletedGroupNames = Array.from(new Set(left.deletedGroupNames.concat(right.deletedGroupNames)));
  const deletedItems = new Set(deletedItemIds), deletedGroups = new Set(deletedGroupNames), items = new Map();
  right.items.forEach(function (item) { items.set(item.id, item); });
  left.items.forEach(function (item) {
    const old = items.get(item.id);
    if (!old || Number(item.updatedAt || 0) >= Number(old.updatedAt || 0)) items.set(item.id, item);
  });
  const ordered = Array.from(items.values()).filter(function (item) { return !deletedItems.has(item.id) && !deletedGroups.has(item.group); });
  const groups = Array.from(new Set(left.groups.concat(right.groups))).filter(function (name) { return !deletedGroups.has(name); });
  ordered.forEach(function (item) { if (!groups.includes(item.group)) groups.push(item.group); });
  const calculatorLines = Number(left.updatedAt || 0) >= Number(right.updatedAt || 0) ? left.calculatorLines : right.calculatorLines;
  const history = new Map();
  right.priceHistory.forEach(function (entry) { history.set(entry.id || [entry.itemId, entry.date, entry.savedAt].join('|'), entry); });
  left.priceHistory.forEach(function (entry) { history.set(entry.id || [entry.itemId, entry.date, entry.savedAt].join('|'), entry); });
  return {
    version: 1, theme: Number(left.themeUpdatedAt || 0) >= Number(right.themeUpdatedAt || 0) ? left.theme : right.theme,
    themeUpdatedAt: Math.max(Number(left.themeUpdatedAt) || 0, Number(right.themeUpdatedAt) || 0),
    updatedAt: Math.max(Number(left.updatedAt) || 0, Number(right.updatedAt) || 0),
    groups: groups, deletedGroupNames: deletedGroupNames, deletedItemIds: deletedItemIds,
    items: ordered, calculatorLines: calculatorLines,
    calculatorStore: Number(left.updatedAt || 0) >= Number(right.updatedAt || 0) ? left.calculatorStore : right.calculatorStore,
    priceHistory: Array.from(history.values()).sort(function (a, b) {
      return String(a.date || a.savedAt || '').localeCompare(String(b.date || b.savedAt || ''));
    }).slice(-5000)
  };
};
const sameState = function (a, b) {
  const pick = function (value) {
    const normalized = normalizeState(value);
    return JSON.stringify({
      theme: normalized.theme,
      themeUpdatedAt: normalized.themeUpdatedAt,
      groups: normalized.groups,
      deletedGroupNames: normalized.deletedGroupNames.slice().sort(),
      deletedItemIds: normalized.deletedItemIds.slice().sort(),
      items: normalized.items.map(function (item) {
        return [item.id, item.name, item.group, !!item.checked, !!item.priority, !!item.preferred, item.preferredStore || '', Number(item.updatedAt) || 0];
      }),
      calculatorStore: normalized.calculatorStore,
      calculatorLines: normalized.calculatorLines.map(function (line) { return [line.id, line.itemId, line.product, line.unitPrice, line.quantity, line.updatedAt]; }),
      history: normalized.priceHistory.map(function (entry) { return entry.id || [entry.itemId, entry.date, entry.savedAt].join('|'); }).sort()
    });
  };
  return pick(a) === pick(b);
};
const writeCloudList = async function (token, listState, profileData) {
  const data = Object.assign({}, profileData || {}, { shoppingList: listState });
  await supabaseRequest('/rest/v1/panel_profiles?on_conflict=user_id', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ data: data, updated_at: new Date().toISOString() })
  }, token);
};
const syncWithCloud = async function (quiet) {
  if (!session) { setSyncStatus('local'); return false; }
  if (syncPromise) return syncPromise;
  syncPromise = (async function () {
    setSyncStatus('syncing');
    const token = await getAccessToken();
    if (!token) return false;
    if (!session.userId) {
      const user = await supabaseRequest('/auth/v1/user', {}, token);
      session = Object.assign({}, session, { userId: user.id, email: user.email || session.email });
      storage.set('panel.sess', session);
    }
    if (activeUserId !== session.userId) switchUser(session.userId);
    const profileData = await readCloudProfile(token);
    const remote = profileData && profileData.shoppingList;
    if (remote && Array.isArray(remote.items)) {
      if (localBelongsToAccount) {
        state = mergeStates(state, remote);
      } else {
        state = normalizeState(remote);
      }
      localBelongsToAccount = true;
      persistLocal();
      if (!sameState(state, remote)) await writeCloudList(token, state, profileData);
    } else {
      localBelongsToAccount = true;
      persistLocal();
      await writeCloudList(token, state, profileData);
    }
    applyTheme();
    renderList();
    setSyncStatus('synced');
    if (!quiet) $('accountMessage').textContent = 'Lista e historial sincronizados con tu cuenta.';
    return true;
  })();
  try { return await syncPromise; }
  catch (error) {
    setSyncStatus('error');
    if (!quiet) $('accountMessage').textContent = 'La sesión está activa, pero no se pudo sincronizar: ' + String(error.message || error);
    throw error;
  } finally {
    syncPromise = null;
  }
};
const scheduleCloudSync = function () {
  if (!session || activeUserId === 'guest') return;
  clearTimeout(syncTimer);
  syncTimer = setTimeout(function () {
    syncWithCloud(true).catch(function () {});
  }, 750);
};
const validateEmail = function (value) {
  const email = String(value || '').trim();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u.test(email) ? '' : 'Ingresá un correo válido.';
};
const authError = function (error, mode) {
  const raw = String(error && (error.message || error.error_description) || error || '').toLowerCase();
  if (/invalid login credentials|invalid_grant/.test(raw)) return 'Correo o contraseña incorrectos.';
  if (/already registered|user already exists|email_exists/.test(raw)) return 'Ese correo ya tiene una cuenta. Iniciá sesión.';
  if (/email not confirmed|email_not_confirmed/.test(raw)) return 'Primero confirmá tu correo desde el enlace que te enviamos.';
  if (/weak_password|password.*(weak|short|characters)/.test(raw)) return 'Usá una contraseña de al menos 8 caracteres, con letras y números.';
  if (/rate limit|too many requests|429/.test(raw)) return 'Demasiados intentos. Esperá un momento y probá de nuevo.';
  if (/captcha/.test(raw)) return 'No se pudo validar el CAPTCHA. Intentá nuevamente.';
  if (/fetch|network|load failed/.test(raw)) return 'No se pudo conectar. Revisá tu conexión.';
  return mode === 'signup' ? 'No se pudo crear la cuenta. Revisá los datos.' : 'No se pudo iniciar sesión. Revisá los datos.';
};
const renderAccount = function () {
  const logged = !!session;
  $('loginPanel').hidden = logged;
  $('loggedPanel').hidden = !logged;
  $('loggedEmail').textContent = session ? session.email || 'Cuenta activa' : '';
  $('accountState').textContent = logged ? 'Conectada' : 'Local';
  $('accountState').classList.toggle('online', logged);
  if (logged) setSyncStatus('account');
  else setSyncStatus('local');
};
const authenticate = async function (mode) {
  const email = $('loginEmail').value.trim().toLowerCase();
  const password = $('loginPassword').value;
  const invalid = validateEmail(email);
  if (invalid) { $('accountMessage').textContent = invalid; return; }
  if (!password || password.length < 6) { $('accountMessage').textContent = 'Ingresá una contraseña de al menos 6 caracteres.'; return; }
  if (mode === 'signup' && (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password))) {
    $('accountMessage').textContent = 'Para crear la cuenta, usá al menos 8 caracteres, con letras y números.';
    return;
  }
  const buttons = Array.from($('loginForm').querySelectorAll('button'));
  buttons.forEach(function (button) { button.disabled = true; });
  $('accountMessage').textContent = mode === 'signup' ? 'Creando cuenta...' : 'Iniciando sesión...';
  try {
    const path = mode === 'signup'
      ? '/auth/v1/signup?redirect_to=' + encodeURIComponent(AUTH_REDIRECT)
      : '/auth/v1/token?grant_type=password';
    const result = await supabaseRequest(path, {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password })
    });
    if (mode === 'signup' && !result.access_token) {
      $('accountMessage').textContent = 'Cuenta creada. Confirmá el enlace que llegó a tu correo y luego iniciá sesión.';
      return;
    }
    persistSession(result);
    if (!session.userId) {
      const user = await supabaseRequest('/auth/v1/user', {}, session.token);
      persistSession(Object.assign({}, result, { user: user }));
    }
    switchUser(session.userId);
    renderAccount();
    await syncWithCloud(false);
    $('loginPassword').value = '';
    $('accountMessage').textContent = 'Sesión iniciada. Tu lista está sincronizada.';
    showToast('Cuenta conectada');
  } catch (error) {
    $('accountMessage').textContent = authError(error, mode);
  } finally {
    buttons.forEach(function (button) { button.disabled = false; });
    renderAccount();
  }
};
$('loginForm').addEventListener('submit', function (event) {
  event.preventDefault();
  authenticate('login');
});
$('signupButton').addEventListener('click', function () { authenticate('signup'); });
$('forgotButton').addEventListener('click', async function () {
  const email = $('loginEmail').value.trim().toLowerCase();
  const invalid = validateEmail(email);
  if (invalid) { $('accountMessage').textContent = invalid; return; }
  try {
    await supabaseRequest('/auth/v1/recover?redirect_to=' + encodeURIComponent(AUTH_REDIRECT), {
      method: 'POST',
      body: JSON.stringify({ email: email })
    });
    $('accountMessage').textContent = 'Enviamos un enlace para restablecer la contraseña. Revisá también spam.';
  } catch (error) {
    $('accountMessage').textContent = authError(error, 'recovery');
  }
});
$('logoutButton').addEventListener('click', function () {
  session = null;
  storage.set('panel.sess', null);
  switchUser('guest');
  renderAccount();
  $('accountMessage').textContent = 'Sesión cerrada. La lista local de este navegador sigue disponible.';
  showToast('Sesión cerrada');
});
$('syncButton').addEventListener('click', function () {
  syncWithCloud(false).catch(function () {});
});
document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible' && session) syncWithCloud(true).catch(function () {});
});
window.addEventListener('online', function () {
  if (session) syncWithCloud(true).catch(function () {});
});
window.setInterval(function () {
  if (document.visibilityState === 'visible' && session) syncWithCloud(true).catch(function () {});
}, 45000);

/* ---------------------------------------------------------
   Inicio
   --------------------------------------------------------- */
applyTheme();
renderList();
$('discountCompare').open = false;
$('keypadPanel').open = true;
renderAccount();
if (session && session.userId && activeUserId !== String(session.userId)) switchUser(session.userId);
if (session) {
  syncWithCloud(true).catch(function () {});
}
loadPromotions();
document.addEventListener('keydown', function (event) {
  if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey) {
    const target = event.target;
    if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName)) return;
    event.preventDefault();
    $('searchInput').focus();
  }
  if (event.key === 'Escape' && !$('calculatorView').hidden) setView('list');
});
