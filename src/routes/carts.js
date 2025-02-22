// src/routes/carts.js (CommonJS)
const { Router } = require("express");
const fs = require("fs");
const path = require("path");

const cartsRouter = Router();
const cartsFile = path.join(__dirname, "..", "data", "carts.json");

function getCarts() {
  if (!fs.existsSync(cartsFile)) return [];
  const data = fs.readFileSync(cartsFile, "utf-8");
  return data ? JSON.parse(data) : [];
}

function saveCarts(carts) {
  fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2));
}

// Crear un nuevo carrito
cartsRouter.post("/", (req, res) => {
  const carts = getCarts();
  const newCart = { id: Date.now().toString(), products: [] };
  carts.push(newCart);
  saveCarts(carts);
  res.status(201).json(newCart);
});

// Obtener todos los carritos
cartsRouter.get("/", (req, res) => {
  const carts = getCarts();
  res.json(carts);
});

// ... (Más endpoints si los necesitas)

module.exports = cartsRouter;
