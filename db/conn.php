<?php
$host = "localhost";
$user = "root";         // default XAMPP/WAMP
$pass = "";             // default XAMPP/WAMP (kosong)
$db = "comicverse";     // sesuaikan nama database kamu

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
  die("Koneksi ke database gagal: " . mysqli_connect_error());
}
?>
