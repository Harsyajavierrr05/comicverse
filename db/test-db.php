<?php
$conn = mysqli_connect("localhost", "root", "", "comicverse");

if (!$conn) {
    die("Koneksi gagal: " . mysqli_connect_error());
}
echo "Koneksi sukses bro!";
?>
