function getLoginStatus() {
  return localStorage.getItem('isLoggedIn') === 'true';
}


function setLoginStatus(status, username = null) { // Tambahkan parameter username, default null
  localStorage.setItem('isLoggedIn', status);
  if (status) {
      // Jika status true (login), simpan username yang diberikan
      localStorage.setItem('loggedInUser', username);
  } else {
      // Jika status false (logout), hapus username
      localStorage.removeItem('loggedInUser');
  }
  updateNavbarLoginStatus(); // Perbarui tampilan navbar setelah status berubah
}


function updateNavbarLoginStatus() {
  const loginLink = document.querySelector('.nav-links a[href="login.html"]');
  if (!loginLink) return;

  if (getLoginStatus()) {
    const username = localStorage.getItem('loggedInUser') || 'Pengguna'; // Pastikan ini membaca dari localStorage
    loginLink.textContent = `Logout (${username})`;
    loginLink.href = "#"; 
    loginLink.id = "logout-link"; 
  } else {
    loginLink.textContent = "Login";
    loginLink.href = "login.html";
    loginLink.removeAttribute("id"); 
  }
}

// Handle Login (Dummy)
function handleLogin(event) {
  event.preventDefault();
  
  const usernameInput = document.getElementById('loginUsername').value;
  const passwordInput = document.getElementById('loginPassword').value;

  const lastRegisteredUser = JSON.parse(localStorage.getItem('lastRegisteredUser'));

  if (lastRegisteredUser && usernameInput === lastRegisteredUser.username && passwordInput === lastRegisteredUser.password) {
    // Panggil setLoginStatus dengan username yang benar
    setLoginStatus(true, lastRegisteredUser.username); // <-- Perubahan di sini
    showToast(`Selamat datang, ${lastRegisteredUser.username}!`);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else if (usernameInput === 'admin' && passwordInput === 'password123') { // Fallback ke akun admin bawaan
    // Panggil setLoginStatus dengan username 'AdminDummy'
    setLoginStatus(true, 'AdminDummy'); // <-- Perubahan di sini
    showToast(`Selamat datang, AdminDummy!`);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    showToast('Username atau password salah.');
    setLoginStatus(false);
  }
}

// Handle Register (Dummy - TAPI sekarang menyimpan ke localStorage)
function handleRegister(event) {
    event.preventDefault(); 

    const usernameInput = document.getElementById('registerUsername').value;
    const passwordInput = document.getElementById('registerPassword').value;

    if (usernameInput && passwordInput) {
        localStorage.setItem('lastRegisteredUser', JSON.stringify({
            username: usernameInput,
            password: passwordInput 
        }));

        showToast('Akun berhasil didaftarkan! Silakan login dengan akun Anda.');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    } else {
        showToast('Username dan password tidak boleh kosong.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("auth.js: DOMContentLoaded fired."); 
    
    // Pastikan updateNavbarLoginStatus() terpanggil saat halaman dimuat
    // Ini sudah ada di common.js, tapi panggil di sini juga untuk jaminan
    // updateNavbarLoginStatus();

    const loginForm = document.querySelector('form[action="auth/login.php"]');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    } 

    const registerForm = document.querySelector('form[action="auth/register.php"]');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    document.querySelector('.nav-links').addEventListener('click', (event) => {
        if (event.target.id === 'logout-link') {
            event.preventDefault(); 
            setLoginStatus(false); 
            showToast('Anda telah logout.');
            updateNavbarLoginStatus();
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        }
    });
});
