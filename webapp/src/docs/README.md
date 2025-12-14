# 📖 Documentación Técnica - Keystream Frontend

Bienvenido a la documentación técnica completa del frontend del proyecto **Typing Battle Royale**.

## 📑 Índice de Documentación

### 🏗️ Arquitectura y Diseño
- [**Arquitectura General**](./01-architecture.md) - Visión general de la arquitectura del sistema
- [**Estructura del Proyecto**](./02-project-structure.md) - Organización de carpetas y archivos
- [**Flujo de Datos**](./03-data-flow.md) - Cómo fluye la información en la aplicación

### 🔧 Componentes Técnicos
- [**Sistema de Types**](./04-types-system.md) - TypeScript types y interfaces
- [**Utilities y Helpers**](./05-utilities.md) - Funciones auxiliares y cálculos
- [**Services Layer**](./06-services.md) - Comunicación con el backend

### ⚛️ React y Estado
- [**Custom Hooks**](./07-hooks.md) - Hooks personalizados y su uso
- [**Context API**](./08-context.md) - Gestión de estado global
- [**Componentes UI**](./09-ui-components.md) - Componentes reutilizables

### 🎮 Funcionalidades del Juego
- [**Sistema de Mecanografía**](./10-typing-system.md) - Lógica de captura y validación
- [**WebSocket y Tiempo Real**](./11-websocket.md) - Comunicación en tiempo real
- [**Game Logic**](./12-game-logic.md) - Mecánicas del battle royale

### 🎨 UI/UX y Estilos
- [**Sistema de Diseño**](./13-design-system.md) - Variables, colores y estilos
- [**Componentes de Layout**](./14-layout.md) - Estructura visual
- [**Responsive Design**](./15-responsive.md) - Adaptación a diferentes pantallas

### 🚀 Guías de Desarrollo
- [**Guía de Desarrollo**](./16-development-guide.md) - Cómo empezar a desarrollar
- [**Guía de Testing**](./17-testing-guide.md) - Cómo testear componentes
- [**Guía de Deployment**](./18-deployment.md) - Cómo desplegar la aplicación

---

## 🎯 Inicio Rápido

### Prerequisitos
- Node.js 16+
- npm o yarn
- Backend corriendo en `localhost:8080`

### Instalación

```bash
cd webapp
npm install
npm start
```

### Variables de Entorno

```env
REACT_APP_WS_URL=ws://localhost:8080/ws
REACT_APP_API_URL=http://localhost:8080/api
```

---

## 🏆 Características Principales

- ✅ **Battle Royale de Mecanografía** - Competencia multijugador en tiempo real
- ✅ **WebSocket** - Comunicación bidireccional instantánea
- ✅ **TypeScript** - Type safety en todo el proyecto
- ✅ **Responsive Design** - Funciona en desktop, tablet y móvil
- ✅ **Sistema de Salas** - Crear y unirse a salas privadas/públicas
- ✅ **Estadísticas en Tiempo Real** - WPM, precisión, progreso
- ✅ **Eliminación Progresiva** - Los jugadores más lentos son eliminados

---

## 📊 Stack Tecnológico

| Categoría      | Tecnología           |
|----------------|----------------------|
| **Framework**  | React 18             |
| **Lenguaje**   | TypeScript           |
| **Routing**    | React Router v6      |
| **WebSocket**  | Native WebSocket API |
| **Estilos**    | CSS Modules          |
| **Build Tool** | Create React App     |

---

## 🤝 Contribuir

Para contribuir al proyecto, lee la [Guía de Desarrollo](./16-development-guide.md).

---

## 📄 Licencia

Este proyecto es parte de un sistema de aprendizaje y demostración.