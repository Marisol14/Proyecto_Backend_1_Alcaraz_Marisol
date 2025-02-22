const socket = io();

socket.on("connect", () => {
  console.log("✅ Conectado al servidor WebSocket");
});

socket.on("disconnect", () => {
  console.log("❌ Desconectado del servidor WebSocket");
});

const productList = document.getElementById("productList");
const productForm = document.getElementById("productForm");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");

// Cargar productos inicialmente
(async () => {
  try {
    const response = await fetch("/api/products");
    const products = await response.json();

    if (!products.length) {
      productList.innerHTML = "<p>No hay productos disponibles</p>";
    } else {
      productList.innerHTML = products.map(
        (p) => `<li><strong>${p.title}</strong> - $${p.price}</li>`
      ).join("");
    }
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
  }
})();

socket.on("updateProducts", (product) => {
  console.log("🔄 Producto agregado:", product);
  const newItem = document.createElement("li");
  newItem.innerHTML = `<strong>${product.title}</strong> - $${product.price}`;
  productList.appendChild(newItem);
});

productForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  const price = parseFloat(priceInput.value);

  if (!name || isNaN(price) || price <= 0) {
    alert("⚠️ Ingrese un nombre y precio válido");
    return;
  }

  socket.emit("newProduct", { title: name, price });
  nameInput.value = "";
  priceInput.value = "";
});
