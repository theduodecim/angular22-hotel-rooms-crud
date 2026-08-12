# Hotel CRUD — Microfrontends con Angular 22

CRUD de habitaciones de hotel construido como banco de pruebas para un stack Angular 22 "signal-first" completo: `httpResource`, Signal Forms, arquitectura de microfrontends con Native Federation, y un flujo de desarrollo asistido por agentes de IA con verificación humana en cada paso.

No es una demo de un tutorial: es la implementación real de un stack que en muchos casos todavía no tiene mucha documentación madura (Angular 22 salió en junio de 2026), construida iterando con un agente de codificación y validando cada entrega contra el código real antes de darla por buena.

## Qué demuestra este proyecto

- **CRUD completo** de habitaciones (alta, baja, modificación, listado) con persistencia en `localStorage` y semilla de datos vía `angular-in-memory-web-api`.
- **Arquitectura de microfrontends real** con [`@angular-architects/native-federation`](https://github.com/angular-architects/native-federation): un shell (`hotel-crud-shell`, puerto 4200) que carga en runtime un feature completo (`rooms-remote`, puerto 4201) vía HTTP, no una simulación.
- **APIs signal-first de Angular 22 recién estabilizadas**: `httpResource()` para estado async y Signal Forms (`@angular/forms/signals`) para el formulario, en vez de los patrones clásicos de RxJS state y Reactive Forms.
- **32 tests unitarios reales** (16 en shell + 16 en remote) con Vitest, que ejercitan lógica real: persistencia, recomputación de signals, validaciones de formulario y flujos HTTP de éxito/error — no tests vacíos de "el componente se crea sin errores".
- **UI con Tailwind CSS puro**, sin librerías de componentes.

## Requisitos

- **Node.js ≥ 22.22.3** (Angular 22.1 lo exige explícitamente; versiones anteriores del `22.x` fallan el check de engine).
- **npm** (el workspace usa `npm@11.17.0` como package manager declarado).

## Cómo correr el proyecto

```bash
npm install

# Levantar shell + remote juntos (recomendado)
npm run start:mf

# O por separado
npm run start:shell   # http://localhost:4200
npm run start:remote  # http://localhost:4201
```

- Shell: <http://localhost:4200> — CRUD local, funciona standalone.
- Ruta federada: <http://localhost:4200/rooms-remote> — carga en runtime el `RoomsListComponent` que vive físicamente en el proyecto `rooms-remote`. Si el remote no está levantado o no responde, cae automáticamente al `RoomsListComponent` local del shell (ver [Resiliencia del shell](#resiliencia-del-shell-fallback)).
- Remote standalone: <http://localhost:4201> — el mismo feature corriendo solo, útil para desarrollarlo de forma aislada.

### Tests

```bash
npx ng test hotel-crud-shell --watch=false   # 16 tests
npx ng test rooms-remote --watch=false       # 16 tests
```

Runner: **Vitest** (vía `@angular/build:unit-test`), el default de Angular desde la v21/22 — no Karma/Jasmine.

## Arquitectura

### Estructura de carpetas (por proyecto)

```
src/app/                       projects/rooms-remote/src/app/
├── core/                      ├── core/
│   ├── interceptors/          │   ├── interceptors/     (logging HTTP)
│   ├── models/                │   ├── models/           (Room)
│   └── services/               │   └── services/        (InMemoryDataService, seed data)
├── features/                  ├── features/
│   └── rooms/                  │   └── rooms/            (feature completo: service, list, form)
│       ├── rooms.service.ts   ├── remote-entry/          (rutas expuestas vía federation)
│       ├── rooms-list.component.ts
│       └── room-form.component.ts
├── shared/                    (vacío por ahora — placeholder para componentes cruzados)
└── app.routes.ts / app.config.ts
```

`core/` concentra infraestructura transversal (interceptores, modelos, servicios de datos); `features/rooms` es el feature de negocio, autocontenido; `shared/` queda reservado para lo que en algún momento se comparta entre features sin pertenecer a ninguno en particular.

**Detalle importante:** el `RoomsService` con toda la lógica de `localStorage` vive **dentro de `rooms-remote`**, no en el shell. Toda la lógica de negocio viaja junto con el componente cuando se descarga en runtime — el shell no sabe nada de esa lógica, solo sabe "en esta ruta, cargá lo que me manda el remote".

### Microfrontends con Native Federation

**Qué es el shell:** la app contenedora — punto de entrada, layout general, router principal — que monta adentro suyo features propios o federados desde otras apps.

**Cómo carga en runtime** (nada de esto toca el backend, sigue siendo 100% frontend):

1. Al entrar a `/rooms-remote`, el shell hace un fetch HTTP a `remoteEntry.json` del remote (mapa de qué módulos ofrece y dónde están).
2. Con esa info, descarga los `.js` reales del componente (`RoomsListComponent`, `RoomsService`, etc.) desde el origin del remote.
3. Ese código se ejecuta **dentro de la misma pestaña** que ya tenía abierta el shell — por eso, aunque venga de otro puerto, corre en el mismo contexto de JS y comparte DOM y `localStorage`.

Se puede confirmar que es federación real (no el mismo bundle) filtrando `remoteEntry` en la pestaña Network del navegador: se ve el fetch trayendo el manifest y los chunks desde el origin `4201`, aunque la URL del navegador siga en `4200`.

#### Resiliencia del shell (fallback)

Si el remote no está levantado o el fetch falla, la ruta `/rooms-remote` no queda en blanco: renderiza el `RoomsListComponent` local del shell como fallback. El CRUD original del shell (`/`) tampoco fue tocado ni eliminado — sigue funcionando de forma independiente con el mismo comportamiento de siempre.

#### Aislamiento de datos

El aislamiento real es por **origin** (protocolo + dominio + puerto), no por "quién escribió el código":

- El CRUD local del shell y el CRUD cargado desde `rooms-remote` corren **dentro de la misma página** (origin `4200`) → comparten el mismo `localStorage['rooms']`.
- El remote standalone en `4201` es un origin distinto → `localStorage` completamente aislado, con su propia semilla de datos.

No se separó el `STORAGE_KEY` entre shell y remote (decisión consciente); es una simplificación válida para este alcance, documentada acá para que quede explícita.

#### ¿Por qué microfrontends? (y por qué no es "por seguridad")

La razón real es organizacional, no de seguridad: en una app grande con varios equipos, un monolito frontend obliga a recompilar y redesplegar todo junto ante cualquier cambio. Con microfrontends, cada equipo tiene su propio repo y pipeline, y puede iterar su feature sin coordinar con el resto — el shell simplemente va a buscar la última versión la próxima vez que alguien entra a esa ruta. Misma lógica que microservicios, aplicada al frontend.

Sobre seguridad, la respuesta honesta: **no es una ganancia automática**. El shell ejecuta el código del remote en el mismo contexto de la página (mismo DOM, mismo `localStorage`, mismas cookies) — no hay aislamiento tipo iframe/sandbox. Si un remote se compromete, corre con los mismos permisos que el shell. Por eso, en producción, los equipos que federan entre sí necesitan ser de la misma organización y confiar mutuamente, cuidando el pipeline de CI/CD de cada remote.

## Decisiones de diseño

**`httpResource()` y Signal Forms en vez de RxJS state / Reactive Forms clásicos.** Ambas APIs graduaron de experimental (Angular 21) a **estables** en Angular 22 — no son un experimento ni una apuesta a una API que puede cambiar. `httpResource` reemplaza el patrón `switchMap` + `async` pipe con un signal que expone `.value()`, `.isLoading()` y `.error()` directamente; Signal Forms reemplaza `FormGroup`/`FormControl`/`ControlValueAccessor` con un modelo tipado donde el estado del form es un signal más, sin suscripciones manuales.

**Vitest en vez de Jasmine/Karma.** Angular movió el test runner por default a Vitest a partir de la v21 (builder `@angular/build:unit-test`); Karma sigue siendo soportado pero ya no es el camino recomendado para proyectos nuevos. No se migró nada — el workspace ya venía scaffoldeado para Vitest (`tsconfig.spec.json` con `"types": ["vitest/globals"]`) y solo faltaba completar la configuración del target `test`.

**Tailwind CSS sin librería de componentes.** Control total sobre el markup para los estados de loading/error del `httpResource` y los badges de datos semilla, sin la sobrecarga ni las restricciones de theming de una librería tipo PrimeNG/Material para un scope de este tamaño.

## Testing

| Proyecto | Archivos | Tests | Qué cubren |
|---|---|---|---|
| `hotel-crud-shell` | `rooms.service.spec.ts`, `rooms-list.component.spec.ts`, `room-form.component.spec.ts` | 16 | Persistencia en `localStorage`, recomputación de `availableRooms()`/`averagePrice()`, estados de loading/error, validaciones de Signal Forms, flujo HTTP de la carga semilla (éxito y error 500) |
| `rooms-remote` | mismos tres archivos | 16 | Idéntica cobertura sobre la copia del feature que vive en el remote |

`RoomsService.createRoom/updateRoom/deleteRoom` no hacen llamadas HTTP — persisten directo en `localStorage` y actualizan el resource con `.set()`. El único llamado HTTP real es el `GET /api/rooms` inicial (semilla), y es el que se testea contra `HttpTestingController`, incluyendo el caso de error. Los tests reflejan ese comportamiento real en vez de asumir un patrón CRUD-sobre-HTTP genérico que este servicio no implementa.

## Desafíos técnicos resueltos

Documentado acá porque son los que más enseñan sobre trabajar con agentes de IA en un stack nuevo — cada uno se encontró recién al *ejecutar*, nunca leyendo el diff:

**1. Native Federation nunca estaba realmente conectado.** El `angular.json` inicial usaba los builders estándar de Angular (`@angular/build:application`/`dev-server`), que no generan `remoteEntry.json` ni import map — un wrapper (`new Function('specifier', 'return import(specifier)')(...)`) tapaba el síntoma sin resolver la causa. Se regeneró la config con el schematic oficial (`ng g @angular-architects/native-federation:init`), separando los builders de federación (`build`/`serve`) de los builders reales de aplicación (`esbuild`/`serve-original`).

**2. Esa misma separación de targets rompió el target `test`.** El builder `@angular/build:unit-test` necesita un `buildTarget` explícito; sin especificarlo, su default (`::development`) resuelve al target llamado `build` — que en este workspace es el de Native Federation, no el de aplicación. Hubo que apuntarlo explícitamente a `esbuild:development` en ambos proyectos.

**3. Timing en tests de `httpResource`.** Los dos tests que verifican el `GET /api/rooms` inicial fallaban porque `http.expectOne()` se llamaba antes de que el `effect()` interno de `httpResource` tuviera oportunidad de correr y disparar el request. Solución: un `await TestBed.tick()` explícito antes de esperar el request, y un segundo ciclo después del `flush()` para permitir que corra el `effect()` que persiste el resultado a `localStorage` — dos niveles de reactividad encadenados, no uno.

## Roadmap / no incluido en este alcance

- Backend real (hoy es 100% `angular-in-memory-web-api` + `localStorage`).
- Autenticación / control de acceso.
- Separar `STORAGE_KEY` por origin si en algún momento shell y remote necesitan datos independientes.
- CI/CD para los dos proyectos del workspace.



# Prompts utilizados

Este proyecto se construyó iterando con un agente de codificación (Codex), en etapas — no con un único prompt que generara todo de una. Cada etapa se cerraba recién después de verificarla de forma independiente: ejecutando el código real, no confiando en el resumen que devolvía el agente.

## Metodología

1. Se le pasaba al agente un prompt acotado a una sola responsabilidad (arquitectura de datos, testing, UI, etc.).
2. El agente entregaba un resumen de lo que hizo + el resultado de los comandos que corrió de su lado.
3. Antes de dar por buena la etapa, se corría el código de forma independiente (`npm install`, `ng test`, revisión de diffs archivo por archivo) para confirmar que el resumen coincidía con la realidad.
4. Si aparecía una discrepancia entre lo reportado y lo verificado, se corregía con un prompt puntual antes de avanzar a la siguiente etapa — nunca acumulando deuda de verificación.

Esta carpeta documenta el primer punto (los prompts). El resultado del tercer y cuarto punto —qué se encontró al verificar, qué se corrigió y por qué— está en la sección **"Desafíos técnicos resueltos"** del [README principal](../README.md).

## Etapas

| Archivo | Etapa |
|---|---|
| `01-scaffolding.md` | Estructura inicial del workspace, modelo de datos, CRUD base |
| `02-signal-forms-httpresource.md` | Migración a `httpResource` y Signal Forms (Angular 22) |
| `03-native-federation.md` | Arquitectura de microfrontends: shell + remote |
| `04-testing-vitest.md` | Setup de testing (Vitest) y tests unitarios |

Cada archivo contiene el prompt final tal como se le mandó al agente para esa etapa — no el historial completo de idas y vueltas de la conversación previa a llegar a ese texto.
