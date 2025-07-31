
// Fungsi untuk mendapatkan status login dari localStorage
function getLoginStatus() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

// Fungsi untuk menyimpan status login ke localStorage
function setLoginStatus(status, username = null) {
  localStorage.setItem('isLoggedIn', status);
  // Simpan juga username jika berhasil login
  if (status) {
      localStorage.setItem('loggedInUser', 'username'); // Contoh username dummy
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
  event.preventDefault();
  
  const form = event.target;
  const usernameInput = document.getElementById('loginUsername').value;
  const passwordInput = document.getElementById('loginPassword').value;

  // Ambil akun yang terakhir didaftarkan dari localStorage (jika ada)
  const lastRegisteredUser = JSON.parse(localStorage.getItem('lastRegisteredUser'));

  // Logika Login yang Diperbarui:
  // Coba login dengan akun yang baru didaftarkan, ATAU fallback ke admin/password123
  if (lastRegisteredUser && usernameInput === lastRegisteredUser.username && passwordInput === lastRegisteredUser.password) {
    setLoginStatus(true, lastRegisteredUser.username);
    showToast(`Selamat datang, ${lastRegisteredUser.username}!`);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else if (usernameInput === 'admin' && passwordInput === 'password123') { // Fallback ke akun admin bawaan
    setLoginStatus(true, 'AdminDummy');
    showToast(`Selamat datang, AdminDummy!`);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    showToast('Username atau password salah.');
    setLoginStatus(false);
  }
}

// Handle Register (Dummy - tidak menyimpan ke DB)
function handleRegister(event) {
    event.preventDefault(); // Mencegah form submit default

    const form = event.target;
    const usernameInput = document.getElementById('registerUsername').value;
    const passwordInput = document.getElementById('registerPassword').value;

    // Logika Dummy Register: Cukup simulasikan berhasil terdaftar
    if (usernameInput && passwordInput) {
        // Simpan akun yang baru diregistrasi ke localStorage
        localStorage.setItem('lastRegisteredUser', JSON.stringify({
            username: usernameInput,
            password: passwordInput // Password disimpan plaintext (tidak dihash) karena tidak ada backend
        }));

        showToast('Akun berhasil didaftarkan! Silakan login dengan akun Anda.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    } else {
        showToast('Username dan password tidak boleh kosong.');
    }
}

// Tambahkan event listener untuk tombol Logout di navbar (jika sudah login)
document.addEventListener('DOMContentLoaded', () => {
    console.log("auth.js: DOMContentLoaded fired."); // Tambahkan ini

    const loginForm = document.querySelector('form[action="auth/login.php"]');
    console.log("auth.js: loginForm element found?", loginForm); // Tambahkan ini
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log("auth.js: Login form event listener attached."); // Tambahkan ini
    } else {
        console.warn("auth.js: Login form with action='auth/login.php' NOT found on this page."); // Tambahkan ini
    }

    const registerForm = document.querySelector('form[action="auth/register.php"]');
    console.log("auth.js: registerForm element found?", registerForm); // Tambahkan ini
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
        console.log("auth.js: Register form event listener attached."); // Tambahkan ini
    } else {
        console.warn("auth.js: Register form with action='auth/register.php' NOT found on this page."); // Tambahkan ini
    }

    updateNavbarLoginStatus

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