const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// Ruta al archivo de productos
const productsFilePath = path.join(__dirname, "../data/productos.json");

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

// Ruta para la página principal `/`
router.get("/", (req, res) => {
  const products = getProducts();
  res.render("home", {
    title: "Lista de Productos",
    products: products.length > 0 ? products : null,
  });
});

// Ruta para la vista de productos en tiempo real `/realtimeproducts`
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    title: "Productos en Tiempo Real",
  });
});

module.exports = router;
