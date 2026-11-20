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
  return { version: 1, theme: 'dark', themeUpdatedAt: 0, updatedAt: 0, items: DEFAULT_ITEMS.map(function (item) { return Object.assign({}, item); }), calculatorLines: [], calculatorStore: '', priceHistory: [] };
};
const normalizeState = function (raw) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const incoming = Array.isArray(source.items) ? source.items : [];
  const valid = incoming.filter(function (item) {
    return item && typeof item === 'object' && typeof item.name === 'string' && item.name.trim();
  });
  const byId = new Map();
  valid.forEach(function (item) {
    const group = String(item.group || 'Otros');
    const name = String(item.name).trim();
    const id = String(item.id || idFor(group, name));
    byId.set(id, Object.assign({}, item, { id: id, group: group, name: name }));
  });
  const items = DEFAULT_ITEMS.map(function (base) {
    return Object.assign({}, base, byId.get(base.id) || {});
  });
  const defaultIds = new Set(DEFAULT_ITEMS.map(function (item) { return item.id; }));
  valid.forEach(function (item) {
    const group = String(item.group || 'Otros');
    const name = String(item.name).trim();
    const id = String(item.id || idFor(group, name));
    if (!defaultIds.has(id)) {
      items.push(Object.assign({
        checked: false, priority: false, preferred: false, preferredStore: '', updatedAt: 0
      }, item, { id: id, group: group, name: name }));
    }
  });
  return {
    version: 1,
    theme: source.theme === 'light' ? 'light' : 'dark',
    themeUpdatedAt: Number(source.themeUpdatedAt) || 0,
    updatedAt: Number(source.updatedAt) || 0,
    items: items,
    calculatorLines: Array.isArray(source.calculatorLines) ? source.calculatorLines.filter(function (line) { return line && typeof line === 'object' && typeof line.product === 'string'; }).map(function (line, index) { return Object.assign({}, line, { id: String(line.id || ('calc-' + index + '-' + slug(line.product))), itemId: String(line.itemId || ''), unitPrice: Number(line.unitPrice) || 0, quantity: Number(line.quantity) || 1, updatedAt: Number(line.updatedAt) || 0 }); }) : [],
    calculatorStore: String(source.calculatorStore || ''),
    priceHistory: Array.isArray(source.priceHistory) ? source.priceHistory.filter(function (entry) {
      return entry && typeof entry === 'object' && typeof entry.itemId === 'string';
    }) : []
  };
};

let session = storage.get('panel.sess', null);
let activeUserId = session && session.userId ? String(session.userId) : 'guest';
const initialAccountState = activeUserId === 'guest' ? null : storage.get(STATE_KEY + '.' + activeUserId, null);
let localBelongsToAccount = activeUserId === 'guest' || !!initialAccountState;
let state = normalizeState(initialAccountState || storage.get(GUEST_KEY, null) || defaultState());
let promotions = [];
let promoLoadedAt = 0;
let selectedItemId = '';
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
  element.classList.remove('synced', 'syncing');
  if (mode === 'synced') {
    element.textContent = 'Sincronizado';
    element.classList.add('synced');
  } else if (mode === 'syncing') {
    element.textContent = 'Sincronizando';
    element.classList.add('syncing');
  } else if (mode === 'error') {
    element.textContent = 'Error de nube';
  } else if (mode === 'account') {
    element.textContent = 'Cuenta activa';
    element.classList.add('synced');
  } else {
    element.textContent = 'Este dispositivo';
  }
};
const getLastPrice = function (itemId) {
  return state.priceHistory.filter(function (entry) { return entry.itemId === itemId; })
    .sort(function (a, b) { return String(b.date || b.savedAt || '').localeCompare(String(a.date || a.savedAt || '')); })[0] || null;
};

/* ---------------------------------------------------------
   Lista: cada post-it es un grupo completo de productos
   --------------------------------------------------------- */
const renderItem = function (item) {
  const last = getLastPrice(item.id);
  const priceHint = last
    ? '<span class="product-price-hint">Último: <strong>' + escapeHTML(formatMoney(last.finalUnitPrice || last.total)) + '</strong>' + (last.supermarket ? ' · ' + escapeHTML(last.supermarket) : '') + '</span>'
    : '<span class="product-price-hint">Sin precio registrado</span>';
  return '<article class="product-row' + (item.checked ? ' is-done' : '') + '" data-item-id="' + escapeHTML(item.id) + '">' +
    '<label class="product-check"><input type="checkbox" data-check="' + escapeHTML(item.id) + '" ' + (item.checked ? 'checked' : '') + ' aria-label="Marcar ' + escapeHTML(item.name) + ' como comprado"></label>' +
    '<button class="product-main" type="button" data-open-calculator="' + escapeHTML(item.id) + '">' +
      '<span class="product-name">' + escapeHTML(item.name) + '</span>' + priceHint +
    '</button>' +
    '<div class="product-actions">' +
      '<button class="tag-button" type="button" data-priority="' + escapeHTML(item.id) + '" aria-pressed="' + String(!!item.priority) + '">Prioridad</button>' +
      '<button class="tag-button preferred" type="button" data-preferred="' + escapeHTML(item.id) + '" aria-pressed="' + String(!!item.preferred) + '">Super preferido</button>' +
    '</div></article>';
};
const renderList = function () {
  const container = $('listContainer');
  if (!container) return;
  const query = normalize($('searchInput').value);
  const filtered = state.items.filter(function (item) {
    const matchesText = !query || normalize(item.name + ' ' + item.group).includes(query);
    const matchesFilter = activeFilter === 'all' ||
      (activeFilter === 'pending' && !item.checked) ||
      (activeFilter === 'done' && item.checked) ||
      (activeFilter === 'priority' && item.priority);
    return matchesText && matchesFilter;
  });
  const complete = state.items.filter(function (item) { return item.checked; }).length;
  const total = state.items.length;
  $('progressNumber').textContent = complete + '/' + total;
  $('progressText').textContent = complete === total ? 'Lista completa' : (total - complete) + ' productos pendientes';
  $('progressBar').style.width = (total ? (complete / total) * 100 : 0) + '%';
  $('resultCount').textContent = filtered.length + ' productos';
  $('summaryHint').textContent = query ? 'Resultados para «' + $('searchInput').value.trim() + '»' : 'Tocá un producto para abrir la calculadora';
  const groups = DEFAULT_GROUPS.map(function (group) { return group.name; });
  state.items.forEach(function (item) { if (!groups.includes(item.group)) groups.push(item.group); });
  const html = groups.map(function (groupName, groupIndex) {
    const items = filtered.filter(function (item) { return item.group === groupName; });
    if (!items.length) return '';
    const doneCount = items.filter(function (item) { return item.checked; }).length;
    const priorityCount = items.filter(function (item) { return item.priority; }).length;
    return '<article class="postit-group postit-tone-' + (groupIndex % 4) + '" data-group="' + escapeHTML(groupName) + '">' +
      '<header class="postit-head"><div class="postit-title-wrap"><h2>' + escapeHTML(groupName) + '</h2><span class="postit-count">' + items.length + '</span></div>' +
      '<span class="postit-progress">' + doneCount + '/' + items.length + ' listos</span></header>' +
      '<div class="postit-items">' + items.map(renderItem).join('') + '</div>' +
      (priorityCount ? '<footer class="postit-foot">' + priorityCount + ' con prioridad</footer>' : '') +
    '</article>';
  }).join('');
  container.innerHTML = html || '<div class="empty-state">No hay productos que coincidan con la búsqueda o el filtro.</div>';
  $('historyCount').textContent = state.priceHistory.length + (state.priceHistory.length === 1 ? ' registro' : ' registros');
  $('clearDone').hidden = complete === 0;
  setSyncStatus(session ? 'account' : 'local');
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
$('listContainer').addEventListener('click', function (event) {
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
  showToast('Productos desmarcados');
});

/* ---------------------------------------------------------
   Navegación y tema
   --------------------------------------------------------- */
const setView = function (name) {
  const profile = name === 'profile';
  $('listView').classList.toggle('active', !profile);
  $('listView').hidden = profile;
  $('profileView').classList.toggle('active', profile);
  $('profileView').hidden = !profile;
  $('calculatorView').classList.remove('active');
  $('calculatorView').hidden = true;
  $('bottomNav').hidden = false;
  document.querySelectorAll('.nav-item').forEach(function (button) {
    const active = button.dataset.view === name;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
const openCalculatorForItem = function (itemId) {
  const item = state.items.find(function (entry) { return entry.id === itemId; });
  if (!item) return;
  selectedItemId = itemId;
  $('listView').hidden = true;
  $('profileView').hidden = true;
  $('calculatorView').hidden = false;
  $('calculatorView').classList.add('active');
  $('bottomNav').hidden = true;
  const last = getLastPrice(itemId);
  const existing = state.calculatorLines.find(function (line) { return line.itemId === itemId; });
  $('selectedProductTitle').textContent = item.name;
  $('calcProductGroup').textContent = item.group;
  $('calcUnitPrice').value = existing ? String(existing.unitPrice) : last ? String(last.unitPrice || '') : '';
  $('calcQuantity').value = existing ? String(existing.quantity) : last ? String(last.quantity || 1) : '1';
  $('calcStore').value = item.preferredStore || state.calculatorStore || (last && last.supermarket) || '';
  $('calcLastPrice').textContent = last
    ? 'Último registro: ' + formatMoney(last.finalUnitPrice || last.total) + ' · ' + (last.supermarket || 'supermercado no indicado') + ' · ' + (last.date || '')
    : 'Todavía no hay precios guardados para este producto.';
  $('addCalcItem').textContent = existing ? 'Actualizar en la sumatoria' : 'Agregar a la sumatoria';
  renderCalculator();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(function () { $('calcUnitPrice').focus(); }, 50);
};
$('backToList').addEventListener('click', function () { setView('list'); });
document.querySelectorAll('[data-view]').forEach(function (button) {
  button.addEventListener('click', function () { setView(button.dataset.view); });
});
const applyTheme = function () {
  document.documentElement.dataset.theme = state.theme === 'light' ? 'light' : 'dark';
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
   PromoScraper PY: descuentos de supermercados + calculadora original
   --------------------------------------------------------- */
const isSupermarketPromo = function (promo) {
  const category = normalize(promo && promo.category);
  const sourceText = normalize([promo && promo.title, promo && promo.desc, promo && promo.group].join(' '));
  return category.includes('supermercado') || category.includes('mayorista') ||
    sourceText.includes('supermercado') || sourceText.includes('mayorista');
};
const promotionTitle = function (promo) {
  return String(promo && (promo.supermarket || promo.commerce || promo.store || promo.title) || 'Supermercado');
};
const promotionDiscount = function (promo) {
  const direct = Number(promo && promo.discount_percent);
  if (Number.isFinite(direct) && direct > 0 && direct <= 100) return direct;
  const text = String((promo && promo.title) || '') + ' ' + String((promo && promo.desc) || '');
  const match = text.match(/(\d{1,2}(?:[.,]\d+)?)\s*%\s*(?:off|descuento|dto|reintegro|cashback|dscto)?/i);
  const value = match ? Number(match[1].replace(',', '.')) : 0;
  return value > 0 && value <= 100 ? value : 0;
};
const promotionCap = function (promo) {
  const direct = Number(promo && (promo.discount_cap || promo.max_discount || promo.maxDiscount || promo.top || promo.cap));
  if (Number.isFinite(direct) && direct > 0) return direct;
  const text = String((promo && promo.desc) || '') + ' ' + String((promo && promo.title) || '');
  const match = text.match(/(?:tope|maximo|máximo)\D{0,28}(?:gs\.?|guaran[ií]es|₲)?\s*([\d.]{3,})/i);
  if (!match) return 0;
  const parsed = Number(match[1].replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};
const promotionLabel = function (promo) {
  const bank = promo.bankShort || promo.bankId || 'Banco';
  const cards = Array.isArray(promo.cards) && promo.cards.length ? ' · ' + promo.cards.join(', ') : '';
  const days = Array.isArray(promo.days) && promo.days.length ? ' · ' + promo.days.join(', ') : promo.when ? ' · ' + promo.when : '';
  const campaign = promo.group && normalize(promo.group) !== normalize(promotionTitle(promo)) ? ' · ' + promo.group : '';
  return promotionTitle(promo) + ' · ' + bank + ' · ' + promotionDiscount(promo) + '%' + cards + days + campaign;
};
const updatePromoSourceStatus = function (mode) {
  const element = $('promoStatus');
  element.classList.remove('good');
  if (mode === 'live') {
    element.textContent = promotions.length + ' ofertas · PromoScraper PY';
    element.classList.add('good');
  } else if (mode === 'cached') {
    element.textContent = promotions.length + ' ofertas · copia local';
    element.classList.add('good');
  } else {
    element.textContent = 'Promociones no disponibles';
  }
};
const populateSupermarketOptions = function () {
  const values = new Map();
  promotions.forEach(function (promo) {
    const name = promotionTitle(promo).trim();
    if (name && !values.has(normalize(name))) values.set(normalize(name), name);
  });
  $('supermarketOptions').innerHTML = Array.from(values.values()).sort().map(function (name) {
    return '<option value="' + escapeHTML(name) + '"></option>';
  }).join('');
  renderDiscountComparison();
};
const loadPromotions = async function () {
  const cached = storage.get('compra.supermarket-promos.v1', null);
  if (cached && Array.isArray(cached.data)) {
    promotions = cached.data.filter(isSupermarketPromo);
    promoLoadedAt = Number(cached.at) || 0;
    updatePromoSourceStatus('cached');
    populateSupermarketOptions();
  }
  try {
    const response = await fetch(PROMOS_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error('HTTP ' + response.status);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Formato de promociones inválido');
    storage.set('compra.supermarket-promos.v1', { at: Date.now(), data: data });
    promotions = data.filter(isSupermarketPromo);
    promoLoadedAt = Date.now();
    updatePromoSourceStatus('live');
    populateSupermarketOptions();
    renderDiscountComparison();
  } catch (error) {
    updatePromoSourceStatus(promotions.length ? 'cached' : 'error');
    $('promoDescription').textContent = promotions.length
      ? 'No se pudo actualizar PromoScraper PY. Se muestran las promociones guardadas en este dispositivo.'
      : 'No se pudo leer PromoScraper PY. La calculadora sigue funcionando y podés ingresar un descuento manual.';
    renderDiscountComparison();
  }
};
const getPromoCandidates = function () {
  const query = normalize($('calcStore').value || state.calculatorStore);
  return promotions.map(function (promo, index) { return { promo: promo, index: index }; })
    .filter(function (entry) {
      if (!isSupermarketPromo(entry.promo) || !promotionDiscount(entry.promo)) return false;
      if (!query) return true;
      const haystack = normalize([
        promotionTitle(entry.promo), entry.promo.desc, entry.promo.group,
        entry.promo.bankShort, entry.promo.bankId
      ].join(' '));
      return haystack.includes(query);
    })
    .sort(function (a, b) {
      return promotionDiscount(b.promo) - promotionDiscount(a.promo) ||
        promotionTitle(a.promo).localeCompare(promotionTitle(b.promo));
    });
};
const calculateDiscount = function (subtotal, promo, usedCap, manualPercent) {
  const percent = promo ? promotionDiscount(promo) : Math.max(0, Math.min(100, Number(manualPercent) || 0));
  const cap = promo ? promotionCap(promo) : 0;
  let discount = subtotal * percent / 100;
  if (cap > 0) discount = Math.min(discount, Math.max(0, cap - usedCap));
  return { percent: percent, cap: cap, discount: Math.min(subtotal, discount), total: Math.max(0, subtotal - discount) };
};
const getCalcSubtotal = function () {
  return state.calculatorLines.reduce(function (total, line) {
    return total + Math.max(0, Number(line.unitPrice) || 0) * Math.max(0, Number(line.quantity) || 0);
  }, 0);
};
const updateEquation = function () {
  $('calculatorInput').value = state.calculatorLines.map(function (line) {
    return Number(line.unitPrice || 0) + (Number(line.quantity || 1) === 1 ? '' : '*' + Number(line.quantity || 1));
  }).join('+');
};
const renderCalcLines = function () {
  const lines = state.calculatorLines;
  $('calcLineCount').textContent = lines.length + (lines.length === 1 ? ' producto' : ' productos');
  $('calcLinesBody').innerHTML = lines.length ? lines.map(function (line) {
    const subtotal = Number(line.unitPrice || 0) * Number(line.quantity || 1);
    return '<tr><td><button class="line-product" type="button" data-edit-line="' + escapeHTML(line.id) + '">' + escapeHTML(line.product || 'Producto manual') + '</button></td>' +
      '<td>' + escapeHTML(formatMoney(line.unitPrice)) + '</td><td>' + escapeHTML(String(line.quantity)) + '</td><td><strong>' + escapeHTML(formatMoney(subtotal)) + '</strong></td>' +
      '<td><button class="remove-line" type="button" data-remove-line="' + escapeHTML(line.id) + '" aria-label="Quitar ' + escapeHTML(line.product) + '">×</button></td></tr>';
  }).join('') : '<tr><td colspan="5" class="table-empty">Todavía no agregaste productos. Volvé a la lista y tocá uno para comenzar.</td></tr>';
  $('totalAmount').textContent = formatMoney(getCalcSubtotal());
};
const renderDiscountComparison = function () {
  if (!$('levelSelect')) return;
  const candidates = getPromoCandidates();
  const selected = $('levelSelect').value;
  const selectedStillExists = candidates.some(function (entry) { return String(entry.index) === selected; });
  if (selected && selected !== 'manual' && !selectedStillExists) $('levelSelect').value = '';
  const current = $('levelSelect').value;
  const options = ['<option value="">Elegir una promoción para aplicar</option>'].concat(
    candidates.map(function (entry) {
      return '<option value="' + entry.index + '">' + escapeHTML(promotionLabel(entry.promo)) + '</option>';
    })
  );
  options.push('<option value="manual">Descuento manual</option>');
  $('levelSelect').innerHTML = options.join('');
  $('levelSelect').value = options.some(function (option) { return option.indexOf('value="' + current + '"') >= 0; }) ? current : '';
  const total = getCalcSubtotal();
  const used = Math.max(0, parseAmount($('topeUsadoInput').value));
  const rows = candidates.map(function (entry) {
    const promo = entry.promo;
    const values = calculateDiscount(total, promo, used, 0);
    const isSelected = String(entry.index) === $('levelSelect').value;
    const capLabel = values.cap ? formatMoney(values.cap) : 'Sin tope publicado';
    const bank = [promo.bankShort || promo.bankId || 'Banco', (promo.cards || []).join(', ')].filter(Boolean).join(' · ');
    return '<tr class="' + (isSelected ? 'offer-selected' : '') + '">' +
      '<td><strong>' + escapeHTML(promotionTitle(promo)) + '</strong><small>' + escapeHTML(promo.group || promo.title || '') + '</small></td>' +
      '<td>' + escapeHTML(bank) + '<small>' + escapeHTML((promo.days || []).join(', ') || promo.when || 'Consultar vigencia') + '</small></td>' +
      '<td><strong>' + values.percent + '%</strong></td><td>' + escapeHTML(capLabel) + '</td>' +
      '<td class="saving-value">' + escapeHTML(formatMoney(values.discount)) + '</td><td>' + escapeHTML(formatMoney(values.total)) + '</td>' +
      '<td><button class="use-offer" type="button" data-use-promo="' + entry.index + '">' + (isSelected ? 'Elegida' : 'Usar') + '</button></td></tr>';
  });
  $('totalTable').querySelector('tbody').innerHTML = rows.join('') ||
    '<tr><td colspan="7" class="table-empty">' + (candidates.length ? 'No hay descuentos porcentuales en estas promociones.' : 'No se encontraron descuentos para este supermercado. Podés cambiarlo o ingresar uno manual.') + '</td></tr>';
  if ($('levelSelect').value && $('levelSelect').value !== 'manual') {
    const promo = promotions[Number($('levelSelect').value)];
    if (promo) $('promoDescription').textContent = [promo.desc || '', promotionLabel(promo), promo.validity || ''].filter(Boolean).join(' — ').slice(0, 650);
  } else if ($('levelSelect').value === 'manual') {
    $('promoDescription').textContent = 'Se aplicará el porcentaje manual indicado. No se atribuye a un banco ni a una promoción oficial.';
  } else {
    $('promoDescription').textContent = candidates.length + ' descuentos disponibles para ' + ($('calcStore').value.trim() || 'supermercados').toLowerCase() + '. Elegí una oferta para calcular el ahorro.';
  }
  updateCalculatorTotals();
};
const updateCalculatorTotals = function () {
  const subtotal = getCalcSubtotal();
  const value = $('levelSelect').value;
  const promo = value && value !== 'manual' ? promotions[Number(value)] || null : null;
  const manual = value === 'manual' ? parseAmount($('manualDiscountInput').value) : 0;
  const used = Math.max(0, parseAmount($('topeUsadoInput').value));
  const values = calculateDiscount(subtotal, promo, used, manual);
  $('discountAmount').textContent = '− ' + formatMoney(values.discount);
  $('finalAmount').textContent = formatMoney(values.total);
};
const renderCalculator = function () {
  if (!$('calculatorView') || $('calculatorView').hidden) return;
  renderCalcLines();
  renderDiscountComparison();
};
const parseEquation = function (equation) {
  const cleaned = String(equation || '').replace(/[^0-9+*.,]/g, '').replace(/,/g, '.');
  const terms = cleaned.split('+').filter(Boolean);
  return terms.map(function (term, index) {
    const match = term.match(/^(\d+(?:\.\d+)?)(?:\*(\d+(?:\.\d+)?))?$/);
    if (!match) return null;
    const previous = state.calculatorLines[index] || {};
    return Object.assign({}, previous, {
      id: previous.id || 'manual-' + Date.now() + '-' + index,
      itemId: previous.itemId || '',
      product: previous.product || 'Producto manual',
      unitPrice: Number(match[1]),
      quantity: match[2] == null ? 1 : Number(match[2]),
      updatedAt: Date.now()
    });
  }).filter(Boolean);
};
$('addCalcItem').addEventListener('click', function () {
  const item = state.items.find(function (entry) { return entry.id === selectedItemId; });
  if (!item) { showToast('Volvé a la lista y elegí un producto'); return; }
  const unitPrice = parseAmount($('calcUnitPrice').value);
  const quantity = parseAmount($('calcQuantity').value);
  if (!(unitPrice > 0)) { $('calcUnitPrice').focus(); showToast('Ingresá un precio válido'); return; }
  if (!(quantity > 0)) { $('calcQuantity').focus(); showToast('Ingresá una cantidad válida'); return; }
  const store = $('calcStore').value.trim();
  state.calculatorStore = store;
  const existing = state.calculatorLines.find(function (line) { return line.itemId === item.id; });
  if (existing) {
    Object.assign(existing, { product: item.name, unitPrice: unitPrice, quantity: quantity, updatedAt: Date.now() });
  } else {
    state.calculatorLines.push({ id: makeId(), itemId: item.id, product: item.name, unitPrice: unitPrice, quantity: quantity, updatedAt: Date.now() });
  }
  selectedItemId = '';
  $('selectedProductTitle').textContent = 'Producto agregado · elegí otro desde la lista';
  $('calcProductGroup').textContent = 'En la sumatoria';
  $('calcUnitPrice').value = '';
  $('calcQuantity').value = '1';
  $('addCalcItem').textContent = 'Agregar a la sumatoria';
  state.updatedAt = Date.now();
  persistLocal();
  updateEquation();
  renderCalculator();
  scheduleCloudSync();
  showToast('Producto agregado a la sumatoria');
});
$('calcStore').addEventListener('input', function () {
  state.calculatorStore = this.value;
  state.updatedAt = Date.now();
  persistLocal();
  renderDiscountComparison();
  scheduleCloudSync();
});
$('calcLinesBody').addEventListener('click', function (event) {
  const remove = event.target.closest('[data-remove-line]');
  if (remove) {
    state.calculatorLines = state.calculatorLines.filter(function (line) { return line.id !== remove.dataset.removeLine; });
    state.updatedAt = Date.now();
    persistLocal();
    updateEquation();
    renderCalculator();
    scheduleCloudSync();
    return;
  }
  const edit = event.target.closest('[data-edit-line]');
  if (edit) {
    const line = state.calculatorLines.find(function (entry) { return entry.id === edit.dataset.editLine; });
    if (!line) return;
    selectedItemId = line.itemId || '';
    $('selectedProductTitle').textContent = line.product;
    $('calcProductGroup').textContent = selectedItemId ? (state.items.find(function (item) { return item.id === selectedItemId; }) || {}).group || 'Producto guardado' : 'Producto manual';
    $('calcUnitPrice').value = String(line.unitPrice);
    $('calcQuantity').value = String(line.quantity);
    $('calcLastPrice').textContent = 'Editando un producto de la sumatoria.';
    $('addCalcItem').textContent = 'Actualizar en la sumatoria';
    $('calcUnitPrice').focus();
  }
});
$('levelSelect').addEventListener('change', function () {
  if (this.value === 'manual') $('manualDiscountInput').focus();
  renderDiscountComparison();
});
['topeUsadoInput', 'manualDiscountInput'].forEach(function (id) {
  $(id).addEventListener('input', updateCalculatorTotals);
});
$('calcStore').addEventListener('change', renderDiscountComparison);
$('totalTable').addEventListener('click', function (event) {
  const button = event.target.closest('[data-use-promo]');
  if (!button) return;
  $('levelSelect').value = button.dataset.usePromo;
  if (!$('calcStore').value.trim()) $('calcStore').value = promotionTitle(promotions[Number(button.dataset.usePromo)]);
  state.calculatorStore = $('calcStore').value;
  persistLocal();
  renderDiscountComparison();
});
$('calculatorInput').addEventListener('input', function () {
  const lines = parseEquation(this.value);
  state.calculatorLines = lines;
  state.updatedAt = Date.now();
  persistLocal();
  renderCalcLines();
  renderDiscountComparison();
  scheduleCloudSync();
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
  $('calculatorKeys').hidden = showRule;
  $('calculatorInput').hidden = showRule;
  this.textContent = showRule ? 'Volver a calculadora' : 'Regla de tres';
});
const calculateRuleOfThree = function () {
  const a = parseAmount($('reglatres_a').value);
  const b = parseAmount($('reglatres_b').value);
  const c = parseAmount($('reglatres_c').value);
  $('reglatres_result').value = a ? formatMoney((b * c) / a) : '';
};
['reglatres_a', 'reglatres_b', 'reglatres_c'].forEach(function (id) {
  $(id).addEventListener('input', calculateRuleOfThree);
});
$('clearCalculator').addEventListener('click', function () {
  if (!state.calculatorLines.length) return;
  state.calculatorLines = [];
  state.updatedAt = Date.now();
  persistLocal();
  updateEquation();
  renderCalculator();
  scheduleCloudSync();
  showToast('Sumatoria vaciada');
});
const selectedCalculation = function () {
  const value = $('levelSelect').value;
  const promo = value && value !== 'manual' ? promotions[Number(value)] || null : null;
  const manual = value === 'manual' ? parseAmount($('manualDiscountInput').value) : 0;
  return { promo: promo, values: calculateDiscount(getCalcSubtotal(), promo, parseAmount($('topeUsadoInput').value), manual) };
};
$('saveCalcPrices').addEventListener('click', function () {
  if (!state.calculatorLines.length) { showToast('Agregá productos antes de guardar'); return; }
  const selected = selectedCalculation();
  const store = $('calcStore').value.trim() || (selected.promo ? promotionTitle(selected.promo) : '');
  const subtotal = getCalcSubtotal();
  const appliedDiscount = selected.values.discount;
  const date = localDate();
  state.calculatorLines.forEach(function (line) {
    const lineSubtotal = Number(line.unitPrice) * Number(line.quantity);
    const portion = subtotal > 0 ? appliedDiscount * (lineSubtotal / subtotal) : 0;
    const finalTotal = Math.max(0, lineSubtotal - portion);
    const promo = selected.promo;
    state.priceHistory.push({
      id: makeId(), itemId: line.itemId || '', product: line.product,
      unitPrice: Number(line.unitPrice), quantity: Number(line.quantity),
      subtotal: lineSubtotal, discountPercent: selected.values.percent,
      discountCap: selected.values.cap || null, discountAmount: portion,
      total: finalTotal, finalUnitPrice: finalTotal / Math.max(.000001, Number(line.quantity)),
      supermarket: store,
      bank: promo ? String(promo.bankShort || promo.bankId || '') : '',
      cards: promo && Array.isArray(promo.cards) ? promo.cards.slice() : [],
      promotionTitle: promo ? String(promo.group || promo.title || promotionTitle(promo)) : '',
      promotionDays: promo && Array.isArray(promo.days) ? promo.days.slice() : [],
      promotionValidity: promo ? String(promo.validity || '') : '',
      date: date, savedAt: new Date().toISOString()
    });
    if (line.itemId) {
      const item = state.items.find(function (entry) { return entry.id === line.itemId; });
      if (item && store && !item.preferredStore) item.preferredStore = store;
    }
  });
  if (state.priceHistory.length > 5000) state.priceHistory = state.priceHistory.slice(-5000);
  state.updatedAt = Date.now();
  persistLocal();
  renderList();
  renderCalculator();
  scheduleCloudSync();
  showToast(state.calculatorLines.length + ' precios guardados en el historial');
});
$('exportCalcCsv').addEventListener('click', function () {
  const headers = ['Producto', 'Precio unitario', 'Cantidad', 'Subtotal', 'Supermercado', 'Promoción elegida', 'Banco', 'Descuento %', 'Tope', 'Ahorro estimado', 'Total estimado', 'Fecha'];
  const chosen = selectedCalculation();
  const store = $('calcStore').value.trim();
  const rows = [headers].concat(state.calculatorLines.map(function (line) {
    const total = Number(line.unitPrice) * Number(line.quantity);
    const share = getCalcSubtotal() > 0 ? chosen.values.discount * (total / getCalcSubtotal()) : 0;
    return [line.product, line.unitPrice, line.quantity, total, store,
      chosen.promo ? (chosen.promo.group || chosen.promo.title || '') : 'Descuento manual/sin promo',
      chosen.promo ? (chosen.promo.bankShort || chosen.promo.bankId || '') : '',
      chosen.values.percent, chosen.values.cap || '', share, total - share, localDate()];
  }));
  const csv = '\uFEFF' + rows.map(function (row) { return row.map(csvCell).join(';'); }).join('\r\n');
  downloadFile('sumatoria-compra-' + localDate() + '.csv', csv, 'text/csv;charset=utf-8');
});
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
  $('backupMessage').textContent = 'Respaldo JSON generado. Incluye lista, preferencias e historial de precios.';
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
  $('backupMessage').textContent = state.priceHistory.length + ' registros exportados a CSV.';
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
    if (!window.confirm('Se restaurará el respaldo y se fusionarán sus precios con el historial de la cuenta. ¿Continuar?')) return;
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
    $('backupMessage').textContent = 'Respaldo importado. Se guardó en este dispositivo' + (session ? ' y se sincronizará con tu cuenta.' : '.');
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
  const left = normalizeState(local);
  const right = normalizeState(remote);
  const items = new Map();
  right.items.forEach(function (item) { items.set(item.id, item); });
  left.items.forEach(function (item) {
    const previous = items.get(item.id);
    if (!previous || Number(item.updatedAt || 0) >= Number(previous.updatedAt || 0)) items.set(item.id, item);
  });
  const ordered = DEFAULT_ITEMS.map(function (item) { return items.get(item.id) || item; });
  items.forEach(function (item, id) {
    if (!DEFAULT_ITEMS.some(function (base) { return base.id === id; })) ordered.push(item);
  });
  const calculatorLines = Number(left.updatedAt || 0) >= Number(right.updatedAt || 0) ? left.calculatorLines : right.calculatorLines;
  const history = new Map();
  right.priceHistory.forEach(function (entry) { history.set(entry.id || [entry.itemId, entry.date, entry.savedAt].join('|'), entry); });
  left.priceHistory.forEach(function (entry) { history.set(entry.id || [entry.itemId, entry.date, entry.savedAt].join('|'), entry); });
  return {
    version: 1,
    theme: Number(left.themeUpdatedAt || 0) >= Number(right.themeUpdatedAt || 0) ? left.theme : right.theme,
    themeUpdatedAt: Math.max(Number(left.themeUpdatedAt) || 0, Number(right.themeUpdatedAt) || 0),
    updatedAt: Math.max(Number(left.updatedAt) || 0, Number(right.updatedAt) || 0),
    items: ordered,
    calculatorLines: calculatorLines,
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
      items: normalized.items.map(function (item) {
        return [item.id, !!item.checked, !!item.priority, !!item.preferred, item.preferredStore || '', Number(item.updatedAt) || 0];
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
