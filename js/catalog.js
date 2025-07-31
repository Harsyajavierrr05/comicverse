// js/catalog.js
// Membutuhkan: common.js (untuk showToast, updateCartBadge)
// data.js TIDAK DIMUAT LAGI karena data dari database

document.addEventListener("DOMContentLoaded", () => {
  const catalogListContainer = document.getElementById("catalog-list");
  const searchInput = document.getElementById("searchInput");
  const genreFilter = document.getElementById("genreFilter"); // Dapatkan elemen filter genre
  let allProducts = []; // Akan menyimpan semua produk yang di-fetch dari API

  // Fungsi untuk merender produk ke DOM
  function renderProducts(productsToDisplay) {
    catalogListContainer.innerHTML = "";

    if (productsToDisplay.length === 0) {
      catalogListContainer.innerHTML = '<p class="text-center text-gray-600 w-full">Tidak ada komik yang ditemukan.</p>';
      return;
    }

    productsToDisplay.forEach((product, index) => {
      const card = document.createElement("div");
      card.className = `product-card slide delay-${index + 1}`;
      card.setAttribute('data-product-id', product.id);
      card.innerHTML = `
        <img src="${product.image_url}" alt="${product.title}" onerror="this.onerror=null;this.src='https://placehold.co/200x300/E0E0E0/333333?text=Image+Not+Found';">
        <h3>${product.title}</h3>
        <p class="price">Rp ${Number(product.price).toLocaleString("id-ID")}</p>
      `;
      catalogListContainer.appendChild(card);

      card.addEventListener('click', (event) => {
          const productId = card.dataset.productId;
          window.location.href = `product-detail.html?id=${productId}`;
      });
    });
  }

  // Fungsi untuk mengisi dropdown genre
  function populateGenreFilter(products) {
    const uniqueGenres = new Set();
    products.forEach(product => {
      if (product.genre) {
        console.log("populateGenreFilter: Checking product genre:", product.genre);
        uniqueGenres.add(product.genre);
      }
    });
    console.log("populateGenreFilter: Unique genres found:", Array.from(uniqueGenres));

    // Urutkan genre secara alfabetis
    const sortedGenres = Array.from(uniqueGenres).sort();

    genreFilter.innerHTML = '<option value="">Semua Genre</option>'; // Opsi default
    sortedGenres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre;
      option.textContent = genre;
      genreFilter.appendChild(option);
    });
  }

  // Fungsi untuk menerapkan filter gabungan
  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;

    const filteredProducts = allProducts.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm) ||
                            (product.genre && product.genre.toLowerCase().includes(searchTerm)) ||
                            (product.description && product.description.toLowerCase().includes(searchTerm));

      const matchesGenre = selectedGenre === "" || (product.genre && product.genre === selectedGenre);

      return matchesSearch && matchesGenre;
    });

    renderProducts(filteredProducts);
  }

  // --- FETCH PRODUK DARI API BACKEND SAAT HALAMAN DIMUAT ---
  fetch("api/get-products.php")
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(productsData => {
      allProducts = productsData;
      console.log("catalog.js: Products fetched from API:", allProducts);
      
      populateGenreFilter(allProducts); // Isi filter genre setelah produk di-fetch
      renderProducts(allProducts); // Render semua produk saat pertama kali dimuat
    })
    .catch(error => {
      console.error("Error fetching products in catalog.js:", error);
      catalogListContainer.innerHTML = '<p class="text-center text-red-600 w-full">Gagal memuat produk. Periksa koneksi server.</p>';
      showToast("Gagal memuat produk dari server!");
    });

  // Tambahkan event listener untuk memicu filter saat input search berubah
  searchInput.addEventListener("input", applyFilters);

  // Tambahkan event listener untuk memicu filter saat pilihan genre berubah
  genreFilter.addEventListener("change", applyFilters);
});
