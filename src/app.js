const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const path = require("path");
const fs = require("fs");

// Importar rutas
const productsRouter = require("./routes/products.js");
const cartsRouter = require("./routes/carts.js");
const viewsRouter = require("./routes/views.js");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Ruta al archivo de productos
const productsFilePath = path.join(__dirname, "data", "productos.json");

// Función para obtener productos
function getProducts() {
  try {
    if (!fs.existsSync(productsFilePath)) return [];
    const data = fs.readFileSync(productsFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Error al leer productos:", error);
    return [];
  }
}

// Configuración de Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Uso de rutas
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter); // Se delegan las rutas de vistas al nuevo router

// Configuración de WebSockets
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado");

  // Enviar la lista de productos al cliente cuando se conecta
  socket.emit("updateProducts", getProducts());

  // Evento para agregar un producto
  socket.on("newProduct", (product) => {
    console.log("📌 Nuevo producto recibido:", product);
    let products = getProducts();
    product.id = Date.now().toString();
    products.push(product);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    io.emit("updateProducts", products);
  });

  // Evento para eliminar un producto
  socket.on("deleteProduct", (id) => {
    console.log("🗑 Producto eliminado:", id);
    let products = getProducts().filter((p) => p.id !== id);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    io.emit("updateProducts", products);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
