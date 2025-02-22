📌 Proyecto: Productos en Tiempo Real con WebSockets

📝 Descripción del Proyecto

Este proyecto es una aplicación web desarrollada con Node.js, Express, Socket.io y Handlebars, diseñada para gestionar productos en tiempo real. Permite a los usuarios agregar y eliminar productos dinámicamente, reflejando estos cambios en todas las sesiones conectadas mediante WebSockets.

🎯 Objetivo de la Pre-Entrega 2

El objetivo de esta pre-entrega es implementar una solución que permita gestionar productos en tiempo real mediante WebSockets, cumpliendo con los siguientes requisitos:

📡 Implementar WebSockets para la actualización en tiempo real.

📄 Manejo de plantillas con Handlebars para renderizar los productos.

✅ Agregar y eliminar productos, reflejando los cambios en la interfaz y en productos.json.

🔄 Sincronización en todas las sesiones para que los cambios sean visibles instantáneamente.

⚡ Evitar errores en la interfaz cuando no hay productos disponibles.

🚀 Características Implementadas

✅ 1. Configuración del Servidor
✅ 2. Rutas Implementadas 
📌 Archivo principal: app.js
📌 Archivos:

routes/products.js

routes/carts.js

✅ 3. Funcionalidad de WebSockets
✅ 4. Manejo de Casos Especiales

Cuando no hay productos, home.handlebars muestra el mensaje "No hay productos en la lista" en lugar de un error.

Si productos.json está vacío, el servidor lo inicializa automáticamente.

Se agregó una recarga automática en / tras eliminar productos para reflejar los cambios.

📌 Instalación y Ejecución

🔧 1. Clonar el repositorio

git clone https://github.com/JonatanUribio7749/Proyecto_Backend_Jonatan_Uribio.git

cd Proyecto_Backend_Jonatan_Uribio

📦 2. Instalar dependencias

npm install

▶️ 3. Iniciar el servidor

npm start
npm run dev (desarrollo)

🌐 4. Acceder a la aplicación

Lista de productos: http://localhost:8080/

Productos en tiempo real: http://localhost:8080/realtimeproducts

📌 Tecnologías Utilizadas

Node.js + Express para el servidor.

Socket.io para la actualización en tiempo real.

Handlebars para la renderización de vistas.

CSS básico + Bootstrap (opcional) para estilos.

FS (File System) para persistencia de datos.

👨‍💻 Autor

📌 Desarrollador: JONATAN URIBIO📌 Repositorio: GitHub📌 Fecha de Entrega: 22/02/2025