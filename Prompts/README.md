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
| `05-ui-tailwind.md` | Pulido de UI con Tailwind CSS |

Cada archivo contiene el prompt final tal como se le mandó al agente para esa etapa — no el historial completo de idas y vueltas de la conversación previa a llegar a ese texto.
