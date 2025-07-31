// js/main.js
// Membutuhkan: common.js (untuk showToast, addToCart, updateCartBadge)
// data.js TIDAK DIMUAT LAGI karena data dari database

document.addEventListener('DOMContentLoaded', () => {
  const featuredContainer = document.getElementById("featured-products");

  // --- FETCH PRODUK DARI API BACKEND ---
  fetch("api/get-products.php") // Pastikan path ini benar!
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(productsData => { // productsData adalah array produk dari database
      console.log("main.js: Products fetched from API:", productsData); // Debugging

      // Filter atau slice produk unggulan dari data yang di-fetch
      const featured = productsData.slice(0, 2);

      if (featured.length === 0) {
          featuredContainer.innerHTML = '<p class="text-center text-gray-600 w-full">Tidak ada produk unggulan untuk ditampilkan.</p>';
          console.warn("main.js: No featured products from API to display.");
          return;
      }

      featured.forEach((item, index) => {
        const productCard = document.createElement('div');
        productCard.className = `product-card slide delay-${index + 2}`;
        productCard.setAttribute('data-product-id', item.id);
        // Perhatikan: Gunakan item.image_url jika dari database
        productCard.innerHTML = `
          <img src="${item.image_url}" alt="${item.title}" onerror="this.onerror=null;this.src='https://placehold.co/200x300/E0E0E0/333333?text=Image+Not+Found';">
          <h3>${item.title}</h3>
          <p class="price">Rp${Number(item.price).toLocaleString('id-ID')}</p>
        `;
        featuredContainer.appendChild(productCard);

        productCard.addEventListener('click', (event) => {
            const productId = productCard.dataset.productId;
            window.location.href = `product-detail.html?id=${productId}`;
        });
      });
    })
    .catch(error => {
      console.error("Error fetching products in main.js:", error);
      featuredContainer.innerHTML = '<p class="text-center text-red-600 w-full">Gagal memuat produk. Periksa koneksi server.</p>';
      showToast("Gagal memuat produk dari server!");
    });
});