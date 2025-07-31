
document.addEventListener('DOMContentLoaded', () => {
  const productDetailContainer = document.getElementById('product-detail-container');
  const loadingMessage = document.getElementById('loading-message');
  const errorMessage = document.getElementById('error-message');

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const productIdFromUrl = parseInt(getQueryParam('id'));

  if (isNaN(productIdFromUrl)) {
    loadingMessage.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = 'ID produk tidak valid di URL.';
    return;
  }

  fetch("api/get-products.php")
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then(productsData => {
      const product = productsData.find(p => parseInt(p.id) === productIdFromUrl);

      if (product) {
        loadingMessage.classList.add('hidden');
        productDetailContainer.innerHTML = `
          <div class="md:w-1/3 p-6 flex justify-center items-center">
              <img
                  src="${product.image_url}" alt="${product.title}"
                  class="w-full max-w-xs md:max-w-none rounded-lg shadow-md"
                  onerror="this.onerror=null;this.src='https://placehold.co/300x450/E0E0E0/333333?text=Image+Not+Found';"
              />
          </div>
          <div class="md:w-2/3 p-6 md:p-10 flex flex-col"> <h1 class="text-4xl font-bold text-gray-900 mb-4">${product.title}</h1>

              <div class="info-group mb-2"> <span class="info-label">Penulis:</span>
                  <span class="info-value font-semibold">${product.author || 'N/A'}</span>
              </div>
              <div class="info-group mb-2">
                  <span class="info-label">Penerbit:</span>
                  <span class="info-value font-semibold">${product.publisher || 'N/A'}</span>
              </div>
              <div class="info-group mb-4">
                  <span class="info-label">Genre:</span>
                  <span class="info-value font-semibold">${product.genre || 'N/A'}</span>
              </div>

              <p class="product-price text-4xl font-extrabold text-indigo-600 mb-6"> Rp${Number(product.price).toLocaleString('id-ID')}
              </p>

              <p class="product-description text-gray-800 leading-relaxed mb-8 flex-grow"> ${product.description || 'Tidak ada deskripsi tersedia.'}
              </p>

              <div class="button-group mt-auto"> <button
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
          </div>
        `;

        const addToCartDetailBtn = document.getElementById('add-to-cart-detail-btn');
        if (addToCartDetailBtn) {
          addToCartDetailBtn.addEventListener('click', () => {
            addToCart({
                id: parseInt(product.id),
                title: product.title,
                price: parseFloat(product.price),
                image: product.image_url
            });
          });
        }

      } else {
        loadingMessage.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = `Produk dengan ID ${productIdFromUrl} tidak ditemukan.`;
      }
    })
    .catch(error => {
      console.error("Error fetching products in product-detail.js:", error);
      loadingMessage.classList.add('hidden');
      errorMessage.classList.remove('hidden');
      errorMessage.textContent = 'Gagal memuat detail produk. Periksa koneksi server.';
      showToast("Gagal memuat detail produk dari server!");
    });
});