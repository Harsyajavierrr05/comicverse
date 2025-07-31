// js/cart.js
// Membutuhkan: common.js (untuk getCart, saveCart, showToast, updateCartBadge)
document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById("cart-items");

  function renderCart() {
    const cart = getCart(); 
    cartItemsContainer.innerHTML = ''; 

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="text-center w-full py-10">
          <p class="text-gray-600 text-xl mb-4">Keranjang Anda kosong.</p>
          <a href="catalog.html" class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200">Mulai Belanja</a>
        </div>
      `;
      return;
    }

    let total = 0;

    cart.forEach(item => {
      total += item.price * (item.quantity || 1); 

    const cartItemElement = document.createElement('div');
      // Perhatikan kelas CSS: flex items-center justify-between mb-4
      // Anda mungkin ingin menyesuaikan jika tidak ada gambar
      cartItemElement.className = 'cart-item bg-white p-4 rounded-lg shadow-md flex items-center justify-between mb-4';
      
      
      cartItemElement.innerHTML = `
        <div class="flex items-center flex-grow"> <div>
            <h3 class="text-lg font-semibold text-gray-800">${item.title}</h3>
            <p class="text-gray-600">Rp${item.price.toLocaleString('id-ID')}</p>
          </div>
        </div>
        <div class="flex items-center">
          <input
            type="number"
            min="1"
            value="${item.quantity || 1}"
            data-product-id="${item.id}"
            class="quantity-input w-16 text-center border border-gray-300 rounded-md py-1 px-2 mr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button class="remove-from-cart-btn text-red-600 hover:text-red-800 transition-colors duration-200" data-product-id="${item.id}">Hapus</button>
        </div>
      `;

      cartItemsContainer.appendChild(cartItemElement);
    });

    const summaryElement = document.createElement('div');
    summaryElement.className = 'cart-summary bg-white p-6 rounded-lg shadow-md text-right mt-6';
    summaryElement.innerHTML = `
      <p class="text-2xl font-bold text-gray-900 mb-4">Total: Rp${total.toLocaleString('id-ID')}</p>
      <button class="checkout-btn bg-green-600 text-white py-3 px-8 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
        Lanjutkan Pembayaran (Dummy)
      </button>
    `;
    cartItemsContainer.appendChild(summaryElement);

    // Event listener untuk tombol hapus
    cartItemsContainer.querySelectorAll('.remove-from-cart-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const productId = parseInt(event.target.dataset.productId);
        removeFromCart(productId);
        renderCart(); // Render ulang keranjang setelah menghapus
        showToast('Item dihapus dari keranjang.');
        updateCartBadge();
      });
    });

    // Event listener untuk input kuantitas
    cartItemsContainer.querySelectorAll('.quantity-input').forEach(input => {
      input.addEventListener('change', (event) => {
        const productId = parseInt(event.target.dataset.productId);
        const newQuantity = parseInt(event.target.value);
        if (newQuantity > 0) {
          updateCartQuantity(productId, newQuantity);
          renderCart(); // Render ulang keranjang setelah memperbarui kuantitas
          updateCartBadge();
        } else {
          // Jika kuantitas 0 atau kurang, hapus item
          removeFromCart(productId);
          renderCart();
          showToast('Item dihapus dari keranjang.');
          updateCartBadge();
        }
      });
    });

    // Event listener untuk tombol checkout dummy
    document.querySelector('.checkout-btn').addEventListener('click', () => {
      showToast('Fitur pembayaran belum diimplementasikan!');
    });
  }

  // Fungsi untuk menghapus produk dari keranjang
  function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
  }

  // Fungsi untuk memperbarui kuantitas produk di keranjang
  function updateCartQuantity(productId, newQuantity) {
    let cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      cart[itemIndex].quantity = newQuantity;
      saveCart(cart);
    }
  }

  // Render keranjang saat halaman dimuat
  renderCart();
});