# Compra · Lista y descuentos

Aplicación web para organizar compras de supermercado en Paraguay y contrastar precios con promociones bancarias.

## Interfaz

- Menú inferior con dos secciones: **Lista** y **Perfil**.
- Los post-its representan grupos completos (carnes, pastas, panificados, frutas, limpieza, etc.). Los productos son filas checkeables dentro de cada grupo.
- Buscador y filtros por pendientes, prioridad y comprados.
- Etiquetas por producto: **Prioridad** y **Super preferido**.
- Temas oscuro y claro.

## Calculadora

Al tocar un producto desde la lista se abre la pantalla de calculadora con ese producto seleccionado. Se puede cargar precio y cantidad, sumar más productos, actualizar líneas, editar la ecuación, quitar productos y volver a la lista sin perder la sumatoria.

Se conserva el teclado numérico y la calculadora de regla de tres de la versión original. Los descuentos se consultan desde `promos.json` del proyecto PromoScraper PY; se filtran promociones de supermercados, se comparan porcentajes, topes detectables y bancos, y se puede seleccionar una promoción o ingresar un descuento manual.

## Historial y respaldo

- **Guardar precios e historial** crea un registro por producto con precio unitario, cantidad, total, supermercado, banco, tarjetas, promoción, descuento y fecha.
- Exportación de la sumatoria a CSV.
- Exportación del historial a CSV.
- Exportación e importación de respaldo JSON (lista, sumatoria, preferencias e historial).

## Cuentas y almacenamiento

Sin sesión, la aplicación funciona con almacenamiento local. Al iniciar sesión, sincroniza lista, preferencias, sumatoria e historial por usuario en `panel_profiles.data.shoppingList` del proyecto Supabase que ya utiliza el panel Web-scrapping.

Las promociones son de solo lectura y proceden de:

`https://yosoymitxel.github.io/promociones-tarjetas-bancos-paraguay-py/promos.json`

Se mantiene una copia local para poder seguir usando la lista y la calculadora cuando el origen no esté disponible.

## Desarrollo local

No necesita build ni dependencias de Node:

```bash
python3 -m http.server 8080
```

Abrí `http://localhost:8080`.
