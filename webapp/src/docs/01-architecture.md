# 🏗️ Arquitectura General del Frontend

## Visión General

El frontend de **Typing Battle Royale** está construido con una arquitectura modular y escalable basada en React con
TypeScript. Sigue los principios de Clean Architecture y Separation of Concerns.

## Diagrama de Arquitectura de Alto Nivel

```mermaid
graph TB
    subgraph "Presentation Layer"
        A[Components] --> B[UI Components]
        A --> C[Layout Components]
        A --> D[Feature Components]
    end

    subgraph "Business Logic Layer"
        E[Custom Hooks] --> F[useTyping]
        E --> G[useGame]
        E --> H[useWebSocket]
        I[Context API] --> J[GameContext]
        I --> K[WebSocketContext]
        I --> L[UserContext]
    end

    subgraph "Data Layer"
        M[Services] --> N[WebSocket Service]
        M --> O[API Service]
        M --> P[Game Service]
        Q[Utils] --> R[Calculations]
        Q --> S[Validations]
        Q --> T[Formatters]
    end

    subgraph "Type System"
        U[Types] --> V[Player Types]
        U --> W[Game Types]
        U --> X[WebSocket Types]
    end

    A --> E
    E --> I
    I --> M
    M --> U
    E --> Q
```

## Capas de la Arquitectura

### 1️⃣ **Presentation Layer (Capa de Presentación)**

Responsable de la UI y la interacción del usuario.

```mermaid
graph LR
    A[User] --> B[Components]
    B --> C[UI Basic]
    B --> D[Layout]
    B --> E[Features]
    C --> F[Button, Input, Modal]
    D --> G[Header, Container, Grid]
    E --> H[Game, Lobby, Room]
```

**Responsabilidades:**

- Renderizar la interfaz de usuario
- Capturar eventos del usuario
- Mostrar feedback visual
- Responsive design

**Componentes principales:**

- `components/UI/` - Componentes básicos reutilizables
- `components/Layout/` - Estructura y layouts
- `components/Game/` - Componentes del juego
- `components/Lobby/` - Componentes del lobby

---

### 2️⃣ **Business Logic Layer (Capa de Lógica de Negocio)**

Contiene toda la lógica de negocio y gestión de estado.

```mermaid
graph TB
    A[Business Logic] --> B[Custom Hooks]
    A --> C[Context Providers]
    B --> D[useTyping<br/>Lógica de mecanografía]
    B --> E[useGame<br/>Lógica del juego]
    B --> F[useWebSocket<br/>Comunicación real-time]
    C --> G[GameContext<br/>Estado del juego]
    C --> H[WebSocketContext<br/>Conexión WS]
    C --> I[UserContext<br/>Usuario actual]
```

#### Custom Hooks

| Hook              | Propósito                                             |
|-------------------|-------------------------------------------------------|
| `useTyping`       | Maneja la captura de teclas, cálculo de WPM, accuracy |
| `useGame`         | Estado del juego, jugadores, eliminaciones            |
| `useWebSocket`    | Conexión y mensajería WebSocket                       |
| `useCountdown`    | Cuenta regresiva antes de empezar                     |
| `useLocalStorage` | Persistencia de datos locales                         |

#### Context API

```mermaid
graph TD
    A[App] --> B[WebSocketProvider]
    B --> C[UserProvider]
    C --> D[GameProvider]
    D --> E[Component Tree]
    style B fill: #6366f1
    style C fill: #ec4899
    style D fill: #10b981
```

**Jerarquía de Providers:**

1. `WebSocketProvider` - Conexión global WebSocket
2. `UserProvider` - Información del usuario
3. `GameProvider` - Estado del juego actual

---

### 3️⃣ **Data Layer (Capa de Datos)**

Maneja la comunicación con el backend y transformación de datos.

```mermaid
graph LR
    A[Components] --> B[Services]
    B --> C[API Service<br/>REST endpoints]
    B --> D[WebSocket Service<br/>Real-time comm]
    B --> E[Game Service<br/>Game operations]
    C --> F[HTTP]
    D --> G[WebSocket]
    E --> G
    F --> H[Backend Go]
    G --> H
```

#### Services

**API Service** (`services/api.ts`)

```typescript
// REST API calls
getRooms()
getRoom(roomId)
createRoom(data)
```

**WebSocket Service** (`services/websocket.ts`)

```typescript
// WebSocket management
connect()
disconnect()
send(type, payload)
on(type, handler)
```

**Game Service** (`services/gameService.ts`)

```typescript
// Game-specific operations
joinRoom(roomId, username)
startGame(roomId)
sendTypingUpdate(data)
```

---

### 4️⃣ **Type System (Sistema de Tipos)**

TypeScript types para type safety en toda la aplicación.

```mermaid
graph TB
    A[Types] --> B[Player Types]
    A --> C[Game Types]
    A --> D[Room Types]
    A --> E[WebSocket Types]
    A --> F[Typing Types]
    B --> G[Player<br/>PlayerStats<br/>PlayerInput]
    C --> H[Game<br/>GameState<br/>GameSettings]
    D --> I[Room<br/>RoomListItem<br/>CreateRoomRequest]
    E --> J[WebSocketMessage<br/>Payloads<br/>ConnectionStatus]
    F --> K[TypingMetrics<br/>CharacterStatus<br/>TypingSession]
```

---

## Flujo de Datos Principal

```mermaid
sequenceDiagram
    participant U as User
    participant C as Component
    participant H as Hook
    participant Ctx as Context
    participant S as Service
    participant B as Backend
    U ->> C: Interacción (ej: tecla)
    C ->> H: handleKeyPress()
    H ->> H: Calcular WPM/Accuracy
    H ->> Ctx: Update local state
    Ctx ->> S: sendTypingUpdate()
    S ->> B: WebSocket message
    B ->> S: Broadcast to all
    S ->> Ctx: Update game state
    Ctx ->> C: Re-render
    C ->> U: Visual feedback
```

---

## Patrones de Diseño Utilizados

### 1. **Container/Presentational Pattern**

```typescript
// Container (lógica)
const GameContainer = () => {
    const {game, players} = useGameContext();
    const {handleKeyPress, metrics} = useTyping();

    return <GameView game = {game}
    players = {players}
    onKeyPress = {handleKeyPress}
    />;
};

// Presentational (UI pura)
const GameView = ({game, players, onKeyPress}) => {
    return <div>
...
    </div>;
};
```

### 2. **Custom Hooks Pattern**

Encapsula lógica reutilizable:

```typescript
const useTyping = (options) => {
    const [state, setState] = useState();

    // Lógica compleja aquí

    return {state, actions};
};
```

### 3. **Context + Provider Pattern**

Estado global accesible desde cualquier componente:

```
typescript
const GameContext = createContext();

export const GameProvider = ({children}) => {
    const [state, setState] = useState();
    return <GameContext.Provider value = {state} > {children} < /GameContext.Provider>;
};
```

### 4. **Service Layer Pattern**

Abstracción de la comunicación externa:

```typescript
class WebSocketService {
    connect() {
    }

    send() {
    }

    on() {
    }
}
```

---

## Decisiones Arquitectónicas Clave

### ✅ ¿Por qué Context API en lugar de Redux?

| Aspecto        | Context API     | Redux               |
|----------------|-----------------|---------------------|
| Complejidad    | Baja            | Alta                |
| Boilerplate    | Mínimo          | Mucho               |
| Learning curve | Suave           | Pronunciada         |
| Use case       | Estado moderado | Estado muy complejo |

**Decisión:** Context API es suficiente para este proyecto.

### ✅ ¿Por qué CSS Modules?

- ✅ Scope local automático
- ✅ No requiere dependencias adicionales
- ✅ Mejor performance que CSS-in-JS
- ✅ Fácil de debuggear

### ✅ ¿Por qué WebSocket nativo en lugar de Socket.io?

- ✅ Menor overhead
- ✅ Compatibilidad con backend Go
- ✅ Control total sobre el protocolo
- ✅ Más ligero

---

## Escalabilidad

### Horizontal Scaling

```mermaid
graph LR
    A[Load Balancer] --> B[Frontend Instance 1]
    A --> C[Frontend Instance 2]
    A --> D[Frontend Instance 3]
    B --> E[WebSocket Server]
    C --> E
    D --> E
```

### Vertical Scaling

- Code splitting con React.lazy()
- Memoización con React.memo()
- Virtual scrolling para listas largas
- Debouncing de eventos frecuentes

---

## Performance Considerations

### Optimizaciones Implementadas

```typescript
// 1. Memoización de componentes
export const PlayerList = React.memo(({players}) => {
});

// 2. useCallback para funciones
const handleKeyPress = useCallback((key) => {
}, [deps]);

// 3. useMemo para cálculos costosos
const sortedPlayers = useMemo(() =>
        players.sort((a, b) => b.wpm - a.wpm),
    [players]
);

// 4. Lazy loading de rutas
const Game = lazy(() => import('./components/Game'));
```

---

## Seguridad

### Medidas Implementadas

1. **Validación de Inputs**
    - Username: 3-20 caracteres, alfanuméricos
    - Room name: No empty, max 50 chars

2. **Sanitización de Datos**
    - Escape de HTML en mensajes
    - Validación de tipos en WebSocket

3. **CORS Configuration**
    - Whitelist de orígenes permitidos
    - Credentials handling

---

## Próximos Pasos

Ver los siguientes documentos para profundizar:

- [Estructura del Proyecto](./02-project-structure.md)
- [Flujo de Datos](./03-data-flow.md)
- [Sistema de Types](./04-types-system.md)