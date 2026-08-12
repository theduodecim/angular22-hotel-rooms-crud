# Prompt 0 — Upgrade de entorno (Node + TypeScript)

**Objetivo:** dejar la máquina lista para Angular 22 antes de tocar código.

## Prompt para el agente

```
Verificar la versión actual de Node.js y TypeScript instaladas en el sistema.
Angular 22 requiere Node.js 22 o superior (Node 20 quedó sin soporte) y TypeScript 6 o superior (5.9 y anteriores no son compatibles).

Pasos:
1. Correr `node -v` y `tsc -v` (o `npx tsc -v`) y reportar las versiones actuales.
2. Si Node es menor a 22:
   - Si hay nvm instalado, usar `nvm install 22 && nvm use 22`.
   - Si no hay nvm, indicar el comando de instalación correspondiente al sistema operativo (o instalar nvm primero).
3. Si TypeScript es menor a 6, no hace falta instalarlo global: el `ng new` del paso siguiente va a instalar la versión correcta como dependencia del proyecto. Solo advertir si hay una instalación global vieja que pueda generar conflictos.
4. Verificar también la versión de Angular CLI global (`ng version`). Si es menor a 22, actualizar con `npm install -g @angular/cli@latest`.
5. Confirmar al final: versión de Node activa, versión de Angular CLI, y que el entorno está listo para crear un proyecto Angular 22.
```

## Por qué este paso va primero

Angular 22 rompe si el entorno no cumple los mínimos. Correrlo antes del scaffold evita perder tiempo mañana con errores de instalación a mitad del Prompt 1.


# Manualmente
(tsc -v no instalado globalmente)

nvm --version


nvm install 24
nvm use 24


node -v


sino instalalo
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

nvm install 24
nvm use 24
node -v

npm install -g @angular/cli@latest

ng version

ng serve