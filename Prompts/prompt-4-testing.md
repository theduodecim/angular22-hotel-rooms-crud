# Prompt 3.5 — Setup de testing (Vitest)

**Por qué va antes del Prompt 4:** el workspace no tiene ningún runner de tests instalado ni configurado. `tsconfig.spec.json` (en `hotel-crud-shell` y en `rooms-remote`) ya declara `"types": ["vitest/globals"]`, lo cual indica que el scaffolding fue pensado para **Vitest** — el test runner que Angular 22 adoptó como reemplazo de Karma vía `@angular/build:unit-test`. No hay que migrar nada: hay que completar un setup que quedó a medio hacer.

## Prompt para el agente

```
El workspace Angular 22 (proyectos hotel-crud-shell y rooms-remote) no tiene test runner configurado.
No hay target "test" en angular.json, no hay Karma ni Vitest en package.json, y no hay node_modules instalado.

tsconfig.spec.json en ambos proyectos ya declara "types": ["vitest/globals"], así que el runner a usar es Vitest
(el builder @angular/build:unit-test), no Karma/Jasmine.

Tareas:
1. Agregar las dependencias necesarias en devDependencies (vitest y lo que requiera @angular/build:unit-test para
   este workspace) y correr npm install.
2. Agregar el target "test" en angular.json para ambos proyectos (hotel-crud-shell y rooms-remote), usando
   @angular/build:unit-test apuntando a sus respectivos tsconfig.spec.json.
3. Verificar que `ng test` (y `ng test rooms-remote`) levanta el runner correctamente aunque todavía no haya
   ningún archivo .spec.ts — confirmar que corre "0 tests, 0 failures" sin errores de configuración.
4. No tocar código de la aplicación en este paso. Si encontrás un conflicto de versiones o un paquete que no
   resuelve por el registry, documentarlo en el mensaje final en vez de forzar un workaround.

Al terminar, confirmar con el output de `ng test` que el runner está operativo.

```

## Prompt para el agente

```
El target "test" en angular.json para hotel-crud-shell y rooms-remote no tiene "buildTarget" configurado.
Sin ese valor, el default "::development" resuelve al target "build", que en este workspace es el builder de
native-federation (@angular-architects/native-federation:build), no el builder de aplicación estándar.

Agregar explícitamente:
- hotel-crud-shell → "buildTarget": "hotel-crud-shell:esbuild:development"
- rooms-remote → "buildTarget": "rooms-remote:esbuild:development"

Agregar también "runner": "vitest" explícito en options de ambos targets.

Después de este cambio, reintentar npm install y `ng test --watch=false` en ambos proyectos, y confirmar
"0 tests, 0 failures" antes de continuar.
```

---

# Prompt 4 — Testing unitario (Vitest)

**Objetivo:** tests que prueben lógica real, no tests vacíos. El proyecto usa Vitest como runner (ver Prompt 3.5), no Jasmine/Karma.

**Alcance:** aplicar esto sobre `hotel-crud-shell` (`src/app/features/rooms`). `rooms-remote` tiene una copia casi idéntica de estos tres archivos (`RoomsService`, `RoomsListComponent`, `RoomFormComponent`) — no testearla en este prompt; se hace aparte si hace falta, reusando el mismo enfoque.

## Prompt para el agente

Escribir tests unitarios con Vitest para src/app/features/rooms/ (proyecto hotel-crud-shell):

1. RoomsService:
   - IMPORTANTE: createRoom, updateRoom y deleteRoom NO hacen llamadas HTTP. Persisten directamente en
     localStorage y actualizan el resource con roomsResource.set(...). Testear estos tres métodos verificando:
     a) el contenido de localStorage después de cada operación (usar spies sobre localStorage.setItem/getItem
        o localStorage real en el entorno de test, lo que sea más simple con el setup existente),
     b) que roomsResource.value() refleja el nuevo estado inmediatamente después de cada llamada,
     c) en updateRoom, que se preserva el flag isSeed del room original cuando el payload no lo trae.
   - El único llamado HTTP real es el GET inicial a /api/rooms (vía httpResource, gateado por hasStoredRooms()).
     Testear ese flujo por separado contra HttpTestingController: caso éxito (rooms sembradas y persistidas en
     localStorage tras el primer load) y caso error (respuesta 500 → roomsResource.error() queda seteado).
   - No testear reload()/refresh(): el servicio no los usa, no hace falta simular ese comportamiento.

2. RoomsListComponent:
   - Testear que renderiza la lista según el valor del resource (roomsResource.value()).
   - Testear que availableRooms() y averagePrice() se recalculan cuando cambia roomsResource.value() (por
     ejemplo, tras invocar el service con roomsResource.set(nuevosRooms) desde el test).
   - Testear el estado de loading: cuando roomsResource.isLoading() es true, el template debe mostrar el mensaje
     "Cargando habitaciones semilla…" (ver rooms-list.component.html) y ocultar la lista.
   - Testear el estado de error: cuando roomsResource.error() tiene valor, se debe mostrar el mensaje de error
     en vez de la lista.

3. RoomFormComponent:
   - Testear las validaciones del Signal Form (name required, type required, price con min(1), capacity con
     min(1)) — que roomForm().invalid() sea true cuando falta un campo o price/capacity es menor a 1, y false
     con datos válidos.
   - Testear que submitForm() no emite `saved` cuando el form es inválido, y que sí emite el payload esperado
     (con los campos trimeados/convertidos) cuando es válido.

No hace falta cobertura al 100%. Priorizar tests que efectivamente ejerciten la lógica (cambios de estado,
validaciones, llamadas HTTP reales) por sobre tests triviales de "el componente se crea sin errores".

Al terminar, correr `ng test` y confirmar que todos los tests pasan.