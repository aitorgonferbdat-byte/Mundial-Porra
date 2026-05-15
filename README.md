# Mundial Porra 2026 - Sistema de Bracket Automatizado

Sistema de porra del Mundial con bracket dinámico y automatizado para 104 partidos (48 selecciones, 12 grupos).

## Características Principales

### Fase de Grupos
- 12 grupos (A-L) con 4 equipos cada uno
- 72 partidos en total
- Cálculo automático de puntos (Victoria=3, Empate=1, Derrota=0)
- Cálculo en tiempo real de diferencia de goles
- Tablas de clasificación dinámicas que se actualizan al introducir resultados

### Fase de Eliminatorias (Automatizada)
- **Dieciseisavos**: Se llenan automáticamente con los 1º y 2º de cada grupo
- **Avance automático**: Los ganadores avanzan a la siguiente ronda
- **Desempate por penaltis**: Opción manual cuando hay empate
- **Bracket visual**: Árbol interactivo con líneas de conexión

### UI/UX Premium
- Tema oscuro premium (Azul noche #0F152A)
- Acentos en azul celeste (#82D1F5) y dorado (#BCA164)
- Tipografía Montserrat (títulos) y Poppins (textos)
- Diseño responsive

## Instalación

```bash
# Instalar dependencias del servidor
npm install

# Instalar dependencias del cliente
cd client
npm install
cd ..

# Ejecutar en modo desarrollo
npm run dev
```

El servidor corre en http://localhost:3001
El cliente corre en http://localhost:5173

## Estructura del Proyecto

```
mundial-porra/
├── server.js                 # Backend Express + SQLite
├── package.json              # Dependencias del servidor
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Registration.jsx    # Registro de usuario
│   │   │   ├── GroupPhase.jsx     # Fase de grupos
│   │   │   ├── Bracket.jsx        # Bracket de eliminatorias
│   │   │   └── Submission.jsx     # Confirmación y envío
│   │   ├── data/
│   │   │   └── teams.js           # Datos de equipos y partidos
│   │   ├── utils/
│   │   │   ├── groupLogic.js      # Lógica de clasificaciones
│   │   │   ├── bracketLogic.js    # Lógica de bracket
│   │   │   └── api.js             # Cliente API
│   │   ├── App.jsx                # Componente principal
│   │   ├── main.jsx               # Punto de entrada
│   │   └── index.css              # Estilos globales
│   ├── package.json              # Dependencias del cliente
│   ├── vite.config.js            # Configuración de Vite
│   └── tailwind.config.js        # Configuración de Tailwind
└── mundial_porra.db             # Base de datos SQLite (se crea automáticamente)
```

## API Endpoints

### POST /api/users/register
Registra un nuevo usuario.
```json
{
  "name": "Juan Pérez",
  "nickname": "juanp",
  "email": "juan@email.com"
}
```

### POST /api/predictions/submit
Envía una predicción completa.
```json
{
  "userId": 1,
  "matchResults": {
    "groups": {...},
    "knockout": {...}
  },
  "champion": "Argentina",
  "runnerUp": "Brazil"
}
```

### GET /api/predictions/summary
Obtiene el resumen de todas las predicciones.

### GET /api/predictions/user/:userId
Obtiene la predicción de un usuario específico.

## Base de Datos

### Tabla: users
- id (INTEGER PRIMARY KEY)
- name (TEXT)
- nickname (TEXT UNIQUE)
- email (TEXT)
- created_at (DATETIME)

### Tabla: predictions
- id (INTEGER PRIMARY KEY)
- user_id (INTEGER FOREIGN KEY)
- match_results (TEXT - JSON)
- champion (TEXT)
- runner_up (TEXT)
- created_at (DATETIME)

## Lógica del Sistema

### Cálculo de Clasificaciones
1. Puntos: 3 por victoria, 1 por empate, 0 por derrota
2. Orden de clasificación: Puntos > Diferencia de goles > Goles a favor
3. Los 2 primeros de cada grupo clasifican a Dieciseisavos

### Automatización del Bracket
1. Dieciseisavos: 1ºA vs 2ºB, 1ºC vs 2ºD, etc.
2. Al introducir resultado, el ganador avanza automáticamente
3. En caso de empate, se selecciona ganador por penaltis
4. El proceso se repite hasta la final

## Tecnologías

- **Frontend**: React 18, Vite, TailwindCSS, Lucide Icons
- **Backend**: Node.js, Express
- **Base de datos**: SQLite (better-sqlite3)
- **Tipografía**: Google Fonts (Montserrat, Poppins)

## Licencia

MIT
