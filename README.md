# PagareApp

Sistema de gestión de pagarés y expedientes para despachos jurídicos. Incluye backend con Node.js + Express + MongoDB y frontend con React + Vite + Tailwind CSS.

---

## Requisitos previos

Asegúrate de tener instalado lo siguiente antes de continuar:

- [Node.js](https://nodejs.org/) v18 o superior
- [npm](https://www.npmjs.com/) v9 o superior (viene incluido con Node.js)
- [MongoDB](https://www.mongodb.com/try/download/community) (local) o una URI de MongoDB Atlas

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ivanArco/PagareApp.git
cd PagareApp
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crea el archivo `.env` dentro de la carpeta `backend/` con el siguiente contenido:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/despachoApp
JWT_SECRET=clave_super_secreta_cambiar_en_produccion

# Opcional (para envío de correos con Nodemailer)
EMAIL_USER=tuemail@gmail.com
EMAIL_PASS=tu_contraseña_app
```

> **Nota:** Si usas MongoDB Atlas, reemplaza el valor de `MONGODB_URI` con tu cadena de conexión.

### 3. Configurar el Frontend

Abre una nueva terminal y desde la raíz del proyecto ejecuta:

```bash
cd frontend
npm install
```

---

## Ejecución

### Backend

```bash
cd backend
npm run dev
```

El servidor quedará corriendo en `http://localhost:5000`

### Frontend

```bash
cd frontend
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`

---

## Scripts disponibles

### Backend (`/backend`)

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor en modo desarrollo con nodemon |
| `npm start` | Inicia el servidor en modo producción |
| `npm run seed` | Carga usuarios iniciales a la base de datos |
| `npm run seed:nuevos` | Carga usuarios adicionales |
| `npm run seed:all` | Ejecuta todos los seeds |

### Frontend (`/frontend`)

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo Vite |
| `npm run build` | Genera la build de producción |
| `npm run preview` | Previsualiza la build de producción |

---

## Tecnologías utilizadas

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Nodemailer

**Frontend**
- React 19
- React Router DOM
- Axios
- Tailwind CSS v4
- Vite
