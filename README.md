# Aplicación de Autenticación en React

Una aplicación de página única (SPA) desarrollada con React que incluye autenticación por roles, gestión de sesiones y administración de datos de usuario.

## Características

- Autenticación de usuarios con roles (Administrador y Usuario Regular)
- Gestión de sesiones usando sessionStorage
- Diseño responsive con Tailwind CSS
- Rutas protegidas según autenticación y roles
- Gestión de datos de usuario (estudios y direcciones)
- Panel de administrador para gestionar usuarios
- Panel de usuario para gestionar datos personales
- Componentes modulares y reutilizables
- Validación de formularios

## Tecnologías

- React
- React Router DOM
- Context API
- Hooks personalizados para gestión de formularios
- Tailwind CSS para estilos
- Lucide React para iconos

## Instalación

### Requisitos previos

- Node.js (v14 o superior)
- npm (v6 o superior)

### Pasos para instalar

1. Clona el repositorio:

```bash
git clone <url-repositorio>
```

2. Instala las dependencias:

```bash
npm install
```

3. Inicia el servidor de desarrollo:

```bash
npm run dev
```

4. Abre tu navegador y ve a `http://localhost:8080`

## Uso

### Credenciales de acceso

- Usuario Administrador:

  - Email: admin@example.com
  - Contraseña: admin123

- Usuario Regular:
  - Email: user@example.com
  - Contraseña: user123

### Funcionalidades por rol

#### Administrador

- Ver todos los usuarios
- Gestionar datos de cualquier usuario (estudios y direcciones)
- Crear nuevos usuarios
- Eliminar usuarios existentes

#### Usuario Regular

- Ver y gestionar información personal
- Añadir y editar sus propios estudios
- Añadir y editar sus propias direcciones

## Estructura del proyecto

```
src/
  ├── api/               # Mock API para simular backend
  ├── components/        # Componentes reutilizables
  │   ├── dashboard/     # Componentes del panel de control
  │   └── profile/       # Componentes del perfil de usuario
  ├── context/           # Proveedores de contexto
  ├── hooks/             # Hooks personalizados
  ├── pages/             # Componentes de página
  ├── App.jsx            # Componente principal de la aplicación
  └── main.jsx           # Punto de entrada de la aplicación
```

