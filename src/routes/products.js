const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const productsFilePath = path.join(__dirname, "../data/productos.json");

// Función para obtener productos desde el JSON
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

// Función para guardar productos en el JSON
function saveProducts(products) {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("❌ Error al guardar productos:", error);
  }
}

// Ruta para obtener todos los productos
router.get("/", (req, res) => {
  const products = getProducts();
  res.json(products);
});

// Ruta para agregar un nuevo producto
router.post("/", (req, res) => {
  const { title, description, price, stock, category, images } = req.body;

  // Validar campos obligatorios
  if (!title || !description || !price || !stock || !category) {
    return res.status(400).json({ error: "Todos los campos son obligatorios, excepto las imágenes." });
  }

  // Crear nuevo producto
  const newProduct = {
    id: Date.now().toString(),
    title,
    description,
    price,
    stock,
    category,
    images: images || [], // Si no se proporcionan imágenes, establecer como un array vacío
  };

  // Obtener productos existentes y agregar el nuevo
  const products = getProducts();
  products.push(newProduct);

  // Guardar productos actualizados
  saveProducts(products);

  // Responder con el nuevo producto
  res.status(201).json(newProduct);
});

// Ruta para eliminar un producto por ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  let products = getProducts();

  // Filtrar los productos para eliminar el que coincida con el ID
  const newProducts = products.filter((product) => product.id !== id);

  if (products.length === newProducts.length) {
    return res.status(404).json({ error: "Producto no encontrado." });
  }

  // Guardar la lista actualizada sin el producto eliminado
  saveProducts(newProducts);
  res.json({ message: "Producto eliminado correctamente." });
});

module.exports = router;
