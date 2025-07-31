<?php
session_start();
require '../db/conn.php'; // panggil koneksi DB

$username = $_POST['username'];
$password = $_POST['password'];

// Cek username di DB
$query = "SELECT * FROM users WHERE username='$username'";
$result = mysqli_query($conn, $query);
$user = mysqli_fetch_assoc($result);

// Verifikasi password
if ($user && password_verify($password, $user['password'])) {
  $_SESSION['user'] = $user['username'];
  header("Location: ../index.html"); // redirect setelah login
  exit;
} else {
  echo "<script>alert('Login gagal!'); window.location.href='../login.html';</script>";
}
?>
