# Hotel CRUD Shell + rooms-remote

Workspace Angular 22 multi-proyecto para el CRUD de habitaciones del hotel y una configuración inicial de microfrontends con `@angular-architects/native-federation`.

## Proyectos del workspace

- **Shell / host:** `hotel-crud-shell`
  - Código fuente: `src/`
  - Puerto de desarrollo: `4200`
  - Configuración Native Federation: `federation.config.js`
  - Manifest de remotes: `public/federation.manifest.json`
- **Remote:** `rooms-remote`
  - Código fuente: `projects/rooms-remote/src/`
  - Puerto de desarrollo: `4201`
  - Configuración Native Federation: `projects/rooms-remote/federation.config.js`
  - Exposición federada: `./RoomsRoutes` desde `projects/rooms-remote/src/app/remote-entry/entry.routes.ts`

## Compatibilidad de Native Federation con Angular 22

La configuración apunta a `@angular-architects/native-federation` `^22.1.0`, alineada con Angular `^22.1.x`. El paquete npm público indica que desde Angular 22 la librería migra a la línea v4 y publica versiones `22.x`, por lo que esta rama es la compatible con Angular 22.

> Nota de entorno: durante esta implementación el proxy local devolvió `403 Forbidden` al intentar consultar/instalar paquetes desde `registry.npmjs.org`. Por eso se dejó declarada la dependencia compatible en `package.json`; en un entorno con acceso al registry, ejecutar `npm install` actualizará `package-lock.json` e instalará la librería.

## Comandos de desarrollo

Instalar dependencias compartidas del workspace:

```bash
npm install
```

Levantar shell y remote juntos:

```bash
npm run start:mf
```

Levantar cada app por separado:

```bash
npm run start:shell
npm run start:remote
```

URLs locales:

- Shell: <http://localhost:4200/>
- Remote standalone: <http://localhost:4201/>
- Ruta lazy federada en el shell: <http://localhost:4200/rooms-remote>

## Fallback del shell

El shell mantiene el CRUD local original en `/`. Además, la ruta `/rooms-remote` intenta cargar dinámicamente el remote `rooms-remote` con timeout. Si el remote no responde, falla la federación o todavía no está levantado, la ruta renderiza el `RoomsListComponent` local del shell como fallback para que la demo nunca quede en blanco.

## Validación del CRUD original

El `RoomsListComponent` y `RoomsService` del shell no fueron reescritos ni eliminados. La pantalla principal `/` sigue usando el CRUD local existente con el mismo comportamiento de crear, editar, eliminar y persistir habitaciones en `localStorage`.

## Build

Compilar shell:

```bash
npm run build:shell
```

Compilar remote:

```bash
npm run build:remote
```
