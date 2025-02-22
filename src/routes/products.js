// src/routes/products.js (CommonJS)
const { Router } = require("express");
const { readFileSync, writeFileSync, existsSync } = require("fs");
const path = require("path");

const router = Router();
const productsFile = path.join(__dirname, "..", "data", "productos.json");

function getProducts() {
  if (!existsSync(productsFile)) return [];
  const data = readFileSync(productsFile, "utf-8");
  return data ? JSON.parse(data) : [];
}

function saveProducts(products) {
  writeFileSync(productsFile, JSON.stringify(products, null, 2));
}

// GET all
router.get("/", (req, res) => {
  const products = getProducts();
  res.json(products);
});

// POST new
router.post("/", (req, res) => {
  const products = getProducts();
  const newProduct = { id: Date.now().toString(), ...req.body };
  products.push(newProduct);
  saveProducts(products);
  res.status(201).json(newProduct);
});

// DELETE by :id
router.delete("/:id", (req, res) => {
  let products = getProducts();
  products = products.filter((p) => p.id !== req.params.id);
  saveProducts(products);
  res.json({ message: "Producto eliminado" });
});

module.exports = router;
