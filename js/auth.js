// js/auth.js
// Membutuhkan: common.js (untuk showToast, updateCartBadge)

// Fungsi untuk mendapatkan status login dari localStorage
function getLoginStatus() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

// Fungsi untuk menyimpan status login ke localStorage
function setLoginStatus(status) {
  localStorage.setItem('isLoggedIn', status);
  // Simpan juga username jika berhasil login
  if (status) {
      localStorage.setItem('loggedInUser', 'AdminDummy'); // Contoh username dummy
  } else {
      localStorage.removeItem('loggedInUser');
  }
  updateNavbarLoginStatus(); // Perbarui tampilan navbar setelah status berubah
}

// Fungsi untuk memperbarui tampilan navbar (Login/Logout)
function updateNavbarLoginStatus() {
  const loginLink = document.querySelector('.nav-links a[href="login.html"]');
  if (!loginLink) return;

  if (getLoginStatus()) {
    const username = localStorage.getItem('loggedInUser') || 'Pengguna';
    loginLink.textContent = `Logout (${username})`;
    loginLink.href = "#"; // Ubah href menjadi # atau kosongkan untuk aksi logout
    loginLink.id = "logout-link"; // Tambahkan ID untuk event listener logout
  } else {
    loginLink.textContent = "Login";
    loginLink.href = "login.html";
    loginLink.removeAttribute("id"); // Hapus ID jika tidak login
  }
}

// Handle Login (Dummy)
function handleLogin(event) {
  event.preventDefault(); // Mencegah form submit default (page refresh)

  const form = event.target;
  const usernameInput = form.querySelector('input[name="username"]').value;
  const passwordInput = form.querySelector('input[name="password"]').value;

  // Logika Dummy Login: Cek username dan password statis
  if (usernameInput === 'admin' && passwordInput === 'password123') { // Kredensial dummy
    setLoginStatus(true);
    showToast(`Selamat datang, ${localStorage.getItem('loggedInUser')}!`);
    // Redirect ke halaman beranda atau katalog setelah login sukses
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000); // Redirect setelah 1 detik
  } else {
    showToast('Username atau password salah.');
    setLoginStatus(false);
  }
}

// Handle Register (Dummy - tidak menyimpan ke DB)
function handleRegister(event) {
    event.preventDefault(); // Mencegah form submit default

    const form = event.target;
    const usernameInput = form.querySelector('input[name="username"]').value;
    const passwordInput = form.querySelector('input[name="password"]').value;

    // Logika Dummy Register: Cukup simulasikan berhasil terdaftar
    if (usernameInput && passwordInput) {
        showToast('Akun berhasil didaftarkan! Silakan login.');
        // Redirect ke halaman login setelah registrasi sukses
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    } else {
        showToast('Username dan password tidak boleh kosong.');
    }
}

// Tambahkan event listener untuk tombol Logout di navbar (jika sudah login)
document.addEventListener('DOMContentLoaded', () => {
    updateNavbarLoginStatus(); // Inisialisasi status login di navbar saat DOM siap

    const loginForm = document.querySelector('form[action="auth/login.php"]');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.querySelector('form[action="auth/register.php"]');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Event delegation untuk link logout (karena link bisa berubah)
    document.querySelector('.nav-links').addEventListener('click', (event) => {
        if (event.target.id === 'logout-link') {
            event.preventDefault(); // Mencegah navigasi #
            setLoginStatus(false); // Set status logout
            showToast('Anda telah logout.');
            updateNavbarLoginStatus(); // Perbarui navbar kembali ke Login
            // Optional: Redirect ke halaman beranda
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        }
    });
});