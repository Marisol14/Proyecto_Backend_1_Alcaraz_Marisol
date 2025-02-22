const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const path = require("path");
const fs = require("fs");

// Rutas de la API
const productsRouter = require("./routes/products.js");
const cartsRouter = require("./routes/carts.js");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const productsFilePath = path.join(__dirname, "data", "productos.json");

// --- Función para leer productos desde JSON ---
function getProducts() {
  try {
    if (!fs.existsSync(productsFilePath)) return [];
    const data = fs.readFileSync(productsFilePath, "utf-8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("❌ Error al leer productos:", error);
    return [];
  }
}

// --- Función para guardar productos en JSON ---
function saveProducts(products) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("❌ Error al guardar productos:", error);
  }
}

// Configuración Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Ruta HOME: Renderiza la lista de productos
app.get("/", (req, res) => {
  const products = getProducts();
  res.render("home", { title: "Lista de Productos", products });
});

// Ruta Real Time
app.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

// Configuración Socket.io
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado");

  // Enviar la lista de productos actuales al conectarse
  socket.emit("updateProducts", getProducts());

  // Manejar nuevo producto
  socket.on("newProduct", (product) => {
    console.log("📌 Nuevo producto recibido:", product);
    
    let products = getProducts();
    product.id = Date.now().toString(); // Asignar un ID único
    products.push(product);

    saveProducts(products); // Guardar en productos.json
    io.emit("updateProducts", products); // Emitir actualización a todos
  });

  // Manejar eliminación de producto
  socket.on("deleteProduct", (id) => {
    console.log("🗑 Eliminando producto con ID:", id);
    
    let products = getProducts();
    products = products.filter((p) => p.id !== id);

    saveProducts(products); // Guardar cambios en productos.json
    io.emit("updateProducts", products); // Emitir nueva lista
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

// Iniciar servidor
const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
