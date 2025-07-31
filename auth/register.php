<?php
require '../db/conn.php';

$username = $_POST['username'];
$password = $_POST['password'];

if (!$username || !$password) {
  echo "<script>alert('Isi semua kolom!'); window.history.back();</script>";
  exit;
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Cek apakah username sudah dipakai
$check = mysqli_query($conn, "SELECT * FROM users WHERE username='$username'");
if (mysqli_num_rows($check) > 0) {
  echo "<script>alert('Username sudah digunakan!'); window.history.back();</script>";
  exit;
}

// Insert user ke DB
$query = "INSERT INTO users (username, password) VALUES ('$username', '$hashedPassword')";
$result = mysqli_query($conn, $query);

if ($result) {
  echo "<script>alert('Pendaftaran berhasil! Silakan login.'); window.location.href='../login.html';</script>";
} else {
  echo "<script>alert('Gagal mendaftar!'); window.history.back();</script>";
}
?>
