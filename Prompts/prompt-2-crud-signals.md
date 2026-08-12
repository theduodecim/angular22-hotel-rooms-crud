# Prompt 2 — CRUD con Signal Forms + httpResource

**Objetivo:** el corazón del CRUD, usando las APIs de Signals estables en Angular 22 (no los patrones clásicos de RxJS/Reactive Forms), consumiendo desde el arranque los datos semilla del Prompt 1.

## Prompt para el agente

```
En src/app/features/rooms, implementar el CRUD completo de "Room" usando las APIs de Signals estables en Angular 22:

1. RoomsService:
   - Usar httpResource (o rxResource si la lógica de fetch necesita más control) contra el endpoint /api/rooms para el listado.
     httpResource dispara la petición automáticamente al inicializarse, así que apenas arranca la app el listado ya debe mostrar los registros semilla del createDb() del Prompt 1 (las "reservas" precargadas) sin ninguna acción del usuario.
   - Persistencia real con localStorage (clave, por ejemplo, "rooms"):
     - Al inicializar el service, revisar si ya existe la clave "rooms" en localStorage.
       - Si existe, usar ese array como fuente de verdad (no depender del in-memory-web-api en ese caso).
       - Si no existe, tomar el resultado del httpResource contra /api/rooms (los datos semilla), marcar cada uno de esos registros con un flag `isSeed: true`, y guardar el array en localStorage bajo esa clave.
     - Las habitaciones creadas por el usuario (createRoom) nunca llevan `isSeed` (o lo tienen en `false`), para poder distinguirlas visualmente de las semilla en el Prompt 5.
     - Cualquier create, update o delete debe: aplicarse sobre el array en memoria, guardar el array actualizado completo en localStorage, y reflejarse en el signal/resource que consume el componente (no hace falta seguir llamando al in-memory-web-api después del create inicial, localStorage pasa a ser la fuente de verdad de la sesión).
     - Al crear una habitación nueva, insertarla al **principio** del array (unshift), no al final — debe aparecer primera en el listado, no al fondo.
   - Exponer métodos createRoom, updateRoom, deleteRoom con esta lógica.

2. RoomsListComponent (standalone):
   - Consumir el resource directamente en el template: value(), isLoading(), error() del resource, usando @if/@for.
   - Verificar que al cargar la app por primera vez (antes de cualquier interacción) ya se ven las habitaciones/reservas semilla — esto es clave para la demo.
   - Usar computed() para derivar: cantidad de habitaciones disponibles y precio promedio, a partir del valor del resource. Mostrar ambos en el listado.

3. RoomFormComponent (standalone, reutilizable para crear y editar):
   - Usar Signal Forms (no Reactive Forms clásico) para el formulario.
   - Validaciones: name required, price > 0, capacity > 0, type requerido (single/double/suite).
   - Emitir el room creado/editado al componente padre.

4. Conectar todo: RoomsListComponent debe poder abrir RoomFormComponent para crear o editar, y llamar a delete con confirmación simple. Cualquier create/update/delete debe persistirse en localStorage (según la lógica descrita en el punto 1), no en un backend externo — no usar json-server ni ninguna otra dependencia de persistencia adicional.

Al terminar, probar el flujo completo: crear una habitación y confirmar que aparece primera en el listado; recargar la página y confirmar que tanto los datos semilla como lo creado/editado siguen ahí (persistencia real vía localStorage); listar, editar, eliminar, y verificar que los computed (disponibles / precio promedio) se actualizan solos al cambiar los datos.
```

## Por qué así y no con el patrón clásico

El posteo de la búsqueda pide explícitamente "las últimas versiones de Angular, incluyendo Signals". En Angular 22, Signal Forms y httpResource/rxResource ya son estables (dejaron de ser experimentales), así que usarlos en vez de Reactive Forms + BehaviorSubject demuestra que seguiste el release actual, no un tutorial viejo. El in-memory-web-api sigue sirviendo para el set semilla inicial, y localStorage resuelve la persistencia real entre sesiones sin necesitar un backend aparte.
