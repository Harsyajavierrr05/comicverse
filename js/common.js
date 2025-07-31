/// js/common.js

/* ---------- CART STORAGE ---------- */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// === PERBAIKAN DI SINI UNTUK addToCart ===
function addToCart(productToAdd) { // Parameter seharusnya objek produk lengkap
  console.log("Fungsi addToCart dipanggil.");
  console.log("Product data received by addToCart:", productToAdd);

  const cart = getCart();

  // Validasi dasar untuk memastikan productToAdd adalah objek yang valid
  if (!productToAdd || !productToAdd.id || !productToAdd.title || productToAdd.price === undefined) {
    console.error("Data produk tidak valid di addToCart:", productToAdd);
    showToast("Gagal menambahkan produk: Data tidak lengkap.");
    return;
  }

  // Cari apakah produk sudah ada di keranjang
  const existingItemIndex = cart.findIndex(item => item.id === productToAdd.id);

  if (existingItemIndex > -1) {
    // Jika produk sudah ada, tambahkan kuantitasnya
    cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
  } else {
    // Jika produk belum ada, tambahkan sebagai item baru dengan kuantitas 1
    // Pastikan semua properti yang relevan disalin
    cart.push({
      id: productToAdd.id,
      title: productToAdd.title,
      price: productToAdd.price,
      image: productToAdd.image_url || productToAdd.image, // Fleksibel untuk data.js atau DB
      quantity: 1 // Inisialisasi kuantitas
    });
  }

  saveCart(cart); // Simpan keranjang yang sudah diperbarui
  updateCartBadge(); // Perbarui badge keranjang
  showToast(`${productToAdd.title} ditambahkan ke keranjang!`);
}
// === AKHIR PERBAIKAN addToCart ===

/* ---------- CART BADGE IN NAV ---------- */
function updateCartBadge() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  const cart = getCart();
  // Hitung total kuantitas dari semua item di keranjang
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  el.textContent = `(${totalItems})`; // Tampilkan total kuantitas
}

/* ---------- TOAST NOTIFICATION ---------- */
function showToast(msg) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

/* ---------- DARK MODE ---------- */
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

(function restoreTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
})();

/* ---------- INIT ON LOAD ---------- */
document.addEventListener("DOMContentLoaded", updateCartBadge);