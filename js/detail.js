// js/product-detail.js
document.addEventListener('DOMContentLoaded', () => {
  const productDetailContainer = document.getElementById('product-detail-container');
  const loadingMessage = document.getElementById('loading-message');
  const errorMessage = document.getElementById('error-message');

  // Fungsi untuk mendapatkan parameter dari URL
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const productId = parseInt(getQueryParam('id'));

  if (isNaN(productId)) {
    loadingMessage.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = 'ID produk tidak valid.';
    return;
  }

  // Cari produk di array 'products' (dari data.js)
  // 'products' harus sudah tersedia karena data.js dimuat lebih dulu
  const product = products.find(p => p.id === productId);

  if (product) {
    loadingMessage.classList.add('hidden');
    productDetailContainer.innerHTML = `
      <div class="md:w-1/3 p-6 flex justify-center items-center">
          <img
              src="${product.image}"
              alt="${product.title}"
              class="w-full max-w-xs md:max-w-none rounded-lg shadow-md"
              onerror="this.onerror=null;this.src='https://placehold.co/300x450/E0E0E0/333333?text=Image+Not+Found';"
          />
      </div>
      <div class="md:w-2/3 p-6 md:p-10">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">${product.title}</h1>
          <p class="text-xl text-gray-700 mb-2">Penulis: <span class="font-semibold">${product.author || 'N/A'}</span></p>
          <p class="text-xl text-gray-700 mb-2">Penerbit: <span class="font-semibold">${product.publisher || 'N/A'}</span></p>
          <p class="text-xl text-gray-700 mb-4">Genre: <span class="font-semibold">${product.genre || 'N/A'}</span></p>
          <p class="text-3xl font-extrabold text-indigo-600 mb-6">Rp${product.price.toLocaleString('id-ID')}</p>
          <p class="text-gray-800 leading-relaxed mb-8">${product.description || 'Tidak ada deskripsi tersedia.'}</p>
          <button
              id="add-to-cart-detail-btn"
              class="bg-indigo-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              data-product-id="${product.id}"
          >
              Tambah ke Keranjang
          </button>
          <button
              onclick="window.history.back()"
              class="ml-4 bg-gray-300 text-gray-800 py-3 px-8 rounded-full text-lg font-semibold hover:bg-gray-400 transition-colors duration-200 shadow-lg"
          >
              Kembali
          </button>
      </div>
    `;

    // Tambahkan event listener untuk tombol "Tambah ke Keranjang" di halaman detail
    const addToCartDetailBtn = document.getElementById('add-to-cart-detail-btn');
    if (addToCartDetailBtn) {
      addToCartDetailBtn.addEventListener('click', () => {
        // Panggil fungsi addToCart dari common.js, berikan objek produk lengkap
        addToCart(product);
      });
    }

  } else {
    loadingMessage.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = 'Produk tidak ditemukan.';
  }
});