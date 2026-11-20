# Compra · Lista y descuentos

Aplicación web estática para organizar una lista de supermercado, registrar precios reales y compararlos con las promociones bancarias publicadas por PromoScraper PY.

## Funciones

- Lista agrupada por categorías, con tarjetas checkeables.
- Búsqueda y filtros por pendientes, comprados y prioridad.
- Etiquetas por producto: **Prioridad** y **Super preferido**.
- Calculadora asociada a cada producto: precio, cantidad, supermercado, promoción, descuento y tope.
- Consulta de promociones de supermercados desde:
  `https://yosoymitxel.github.io/promociones-tarjetas-bancos-paraguay-py/promos.json`
- Historial exportable a CSV y respaldo JSON importable.
- Tema claro y oscuro.
- Inicio de sesión y sincronización por usuario mediante el proyecto Supabase usado por el panel Web-scrapping. Sin sesión, se conserva una lista local por navegador.

## Desarrollo local

No requiere build ni dependencias de Node. Se puede abrir `index.html` o servir la carpeta con:

```bash
python3 -m http.server 8080
```

Abrí `http://localhost:8080`.

## Datos y cuentas

La lista y el historial se guardan en `localStorage` y, al iniciar sesión, se sincronizan en `panel_profiles.data.shoppingList` con las políticas RLS de Supabase. La aplicación no necesita claves privadas: usa la clave pública de cliente ya utilizada por el panel.

Las promociones son datos externos de solo lectura. Si no se puede acceder al JSON, se utiliza la última copia local disponible; el registro manual de precios sigue funcionando.
