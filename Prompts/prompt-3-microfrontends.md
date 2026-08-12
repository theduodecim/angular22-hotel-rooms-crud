# Prompt 3 — Microfrontends (Native Federation)

**Objetivo:** demostrar arquitectura de microfrontends real, aunque sea a escala mínima. Es el punto más propenso a romperse — dejarle margen de tiempo y no postergarlo para el final.

## Prompt para el agente

```

Configurar arquitectura de microfrontends usando @angular-architects/native-federation,
verificando que la versión instalada de la librería sea compatible con Angular 22.

1. Configurar el proyecto actual ("hotel-crud-shell") como "shell" (host) de native-federation,
   SIN reescribir ni eliminar el RoomsListComponent, RoomsService ni el CRUD local que ya
   funciona: solo agregar la capacidad de host federado (instalar la librería, configurar
   federation.config.js con el puerto del shell y el remote a consumir). El proyecto debe
   seguir siendo usable exactamente igual que hoy.
2. Crear una segunda aplicación Angular 22 standalone llamada "rooms-remote" DENTRO DEL MISMO
   WORKSPACE de Angular (usar `ng generate application rooms-remote`, workspace multi-proyecto),
   no como carpeta o repo separado. Debe quedar versionada junto con el shell en el mismo git repo,
   compartiendo node_modules y package.json del workspace.
3. El remote ("rooms-remote") debe exponer el feature de rooms (RoomsListComponent y lo que
   dependa de él, incluyendo RoomsService) como remote module.
4. El shell debe cargar el remote de forma dinámica vía una ruta lazy (loadRemoteModule o el
   helper equivalente de native-federation).
5. Agregar en el shell una ruta de fallback: si el remote no carga (timeout o error), mostrar
   el RoomsListComponent local que ya existe en el shell (el mismo del Prompt 2) en vez de
   pantalla en blanco o error sin manejar. Esto es para que la demo nunca se quede sin CRUD
   visible aunque la federación falle en el momento.
6. Configurar los puertos de cada app (ej: shell en 4200, remote en 4201) y dejar los scripts
   de npm para levantar ambos con un solo comando si es posible (ej. concurrently).
7. Documentar en el README los comandos exactos para correr shell + remote juntos, y la ubicación
   de cada proyecto dentro del workspace.

Si en algún punto la configuración de federation da errores de resolución de dependencias
compartidas (Angular, RxJS, etc.), priorizar dejar el remote funcionando de forma standalone
(accesible por su cuenta) y el shell cargándolo, aunque la configuración final de shared deps
quede simplificada — es más valioso tener algo funcionando y explicable que algo roto por
sobre-optimizar.

Al terminar: confirmar que el CRUD original (Prompt 2) sigue funcionando igual que antes
dentro del shell federado — mismo comportamiento de crear/editar/eliminar/persistencia en
localStorage — antes de dar el paso por cerrado.
```

## Plan B si se traba

Si esto consume demasiado tiempo: dejar el remote como una app Angular standalone separada dentro del mismo workspace (sin llegar a federarla en runtime) y preparar una explicación clara con diagrama/README de cómo se estructuraría la federación — mejor eso que quemar todo el tiempo disponible acá. El checkpoint del paso 1 permite volver al CRUD monolítico funcionando sin pérdidas si hace falta abandonar este prompt.