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

  - Email: admin@admin.com
  - Contraseña: admin123

- Usuario Regular:
  - Email: user@user.com
  - Contraseña: user123
 
  - Email: user2@user.com
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

## Funcionamiento

- Panel de control de admin, donde se puede crear un usuario nuevo o modificar uno existente
  
![image](https://github.com/user-attachments/assets/7dabdebf-fb39-4bf7-aaa0-d8182e1dfc53)

- Modal con validaciones para crear un usuario
  
![image](https://github.com/user-attachments/assets/698684d6-0511-4ac6-a709-d684e8828f62)


- Mensaje de éxito al crear/eliminar un usuario
- Estado de carga para evitar multiples envios
- Validaciones para evitar emails duplicados
  
![image](https://github.com/user-attachments/assets/d386e9bd-b38e-4cdb-8ebf-3e6f75ae97b8)



- Perfil del usuario, version mobile completamente responiva
  
![image](https://github.com/user-attachments/assets/12b893e1-5c2e-49f8-84fd-ef12746eaa14)

![image](https://github.com/user-attachments/assets/ba487769-9745-491a-a830-4e4202ccff7f)


- Añadir dirección
  
![image](https://github.com/user-attachments/assets/2b34f34a-a75b-4c58-9746-d8f5af261a8a)


- Añadir formación
  
![image](https://github.com/user-attachments/assets/f8a0227f-004f-4d71-af35-fdcbe0a6d2de)

## Estructura

Se separó la lógica de red y la lógica de sesión en distintos servicios, separando responsabilidades, siguiendo el principio de responsabilidad única y creando abstracciones, siguiendo los principios SOLID.

