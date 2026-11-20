# Compra · Lista, calculadora y descuentos

Aplicación web para organizar compras en Paraguay y calcular el total de la compra con descuentos bancarios.

## Flujo principal

La navegación inferior tiene tres entradas permanentes: **Lista**, **Calculadora** (al centro) y **Perfil**.

1. **Lista:** los post-its representan grupos completos de productos; los artículos se marcan como comprados o pendientes. Cada artículo puede llevar las etiquetas Prioridad y Super preferido.
2. **Calculadora:** tocar un producto de la lista abre la calculadora con ese producto asociado. Desde la calculadora también se pueden agregar productos libres que no estén en la lista. Cada línea tiene precio unitario y cantidad, y aparece en la tabla de lo que se va comprando.
3. **Perfil:** cuenta, sincronización, tema claro/oscuro y herramientas de respaldo.

## Calculadora original conservada

La calculadora conserva sus elementos originales: selector de niveles, tope usado, tabla comparativa de descuentos, tabla de productos y cantidades, total, ecuación editable, teclado numérico, exportación CSV y calculadora de regla de tres.

La adaptación agrega el selector de supermercado/lugar de compra. Sus descuentos bancarios se consultan desde `promos.json` de PromoScraper PY; se filtran por la categoría de supermercados y se comparan por banco, porcentaje, tarjetas y vigencia. Los niveles originales (General, Contimarket y Tienda Naranja) siguen disponibles. También se puede aplicar un porcentaje manual.

## Historial y cuentas

Al guardar los precios se conserva producto, asociación con la lista (cuando existe), precio unitario, cantidad, supermercado, banco, promoción, descuento estimado y fecha. La sumatoria se puede exportar a CSV; el historial tiene su propia exportación y respaldo JSON importable.

Sin iniciar sesión, la app funciona en el navegador. Con sesión, sincroniza por usuario la lista, la sumatoria y el historial usando `panel_profiles.data.shoppingList` del proyecto Supabase del panel Web-scrapping.

## Fuente de promociones

`https://yosoymitxel.github.io/promociones-tarjetas-bancos-paraguay-py/promos.json`

Se guarda una copia local para seguir usando la aplicación cuando la fuente no responda. El porcentaje y los topes se muestran como estimaciones; siempre hay que revisar las condiciones oficiales de cada banco.

## Desarrollo local

No requiere build ni dependencias de Node:

```bash
python3 -m http.server 8080
```

Abrí `http://localhost:8080`.


## Gestión de listas y promociones
Los grupos y productos de cada post-it se pueden crear, renombrar y eliminar desde iconos compactos integrados en las tarjetas. Las eliminaciones se conservan al sincronizar la lista entre dispositivos.

El buscador de comercio consulta el catálogo completo de PromoScraper PY y ordena primero las coincidencias de supermercados. Al encontrar un comercio, propone automáticamente la tarjeta/beneficio con mejor porcentaje; el selector contiguo permite elegir otro beneficio manualmente. El total a pagar en caja se destaca por encima del reintegro estimado, que puede acreditarse posteriormente.


## Catálogo inicial por usuario

El catálogo inicial vigente contiene 23 grupos y se aplica mediante la versión 2. Las listas guardadas de versiones anteriores se migran una sola vez cuando cada usuario abre la aplicación o sincroniza su cuenta. La migración sustituye los productos base anteriores, conserva grupos y productos personalizados, el historial y la calculadora. La versión queda almacenada en la lista local y en el perfil de Supabase: los cambios futuros al catálogo predeterminado no sobrescriben listas que ya fueron migradas. No incrementar DEFAULT_CATALOG_VERSION sin una nueva solicitud explícita de actualización global.
