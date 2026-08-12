# Prompt 1 — Scaffold + base del proyecto

**Objetivo:** proyecto Angular 22 standalone, con Tailwind y `angular-in-memory-web-api` pre-cargado con datos semilla, sin lógica de negocio todavía.

> **Nota:** se vuelve a `angular-in-memory-web-api` (decisión del usuario) solo para el **set de datos semilla inicial**. La persistencia real entre sesiones se resuelve en el Prompt 2 con localStorage (el service guarda ahí cada create/update/delete), así que el flujo completo queda: in-memory-web-api entrega los datos la primera vez que no hay nada en localStorage, y de ahí en adelante localStorage es la fuente de verdad.

## Prompt para el agente

```
Crear un proyecto Angular 22 standalone llamado "hotel-crud-shell" (sin NgModules).
Confirmar antes de arrancar que el entorno tiene Node 22+ y TypeScript 6+ (si el Prompt 0 ya se corrió, esto debería estar OK).

Configuración:
1. Configurar Tailwind CSS desde el inicio (instalación y configuración de postcss/tailwind.config).
2. Estructura de carpetas por features:
   - src/app/core (servicios transversales, interceptors)
   - src/app/shared (componentes reutilizables)
   - src/app/features/rooms (el CRUD de habitaciones de hotel)
3. Usar la nueva sintaxis de control de flujo (@if, @for, @switch) en todos los templates, nunca *ngIf/*ngFor.
4. Configurar un interceptor HTTP simple para logging de requests y manejo centralizado de errores.
5. Instalar y configurar angular-in-memory-web-api, con un InMemoryDataService que expone el endpoint /api/rooms.
   En el método createDb(), pre-cargar al menos 5 registros de ejemplo (no vacío):

   Ejemplo de estructura por registro:
   { id: 1, name: 'Habitación 101', type: 'double', price: 85, capacity: 2, available: false }

   Variar los 5+ registros entre los 3 tipos (single/double/suite), con algunos "available: true" y otros "available: false" (simulando habitaciones ya reservadas), para que el listado no arranque vacío ni homogéneo.

Entidad "Room": id, name, type (single/double/suite), price, capacity, available (boolean).

Restricciones:
- No agregar ninguna librería de UI (nada de PrimeNG/Material) — la UI se resuelve con Tailwind en un paso posterior.
- No implementar todavía los componentes de rooms, solo la base del proyecto y el backend con datos semilla.

Al terminar, correr `ng serve` y confirmar que GET a /api/rooms devuelve los registros semilla sin necesidad de crear nada manualmente.
```

## Qué revisar antes de pasar al siguiente prompt

- El proyecto compila y levanta con `ng serve`.
- Tailwind está aplicando estilos (probar con una clase de prueba en el `app.component.html`).
- GET /api/rooms devuelve los datos semilla del createDb() (no un array vacío) — esto es lo que hace que la app "ya consuma algunas reservas al inicializarse".
