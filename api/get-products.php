<?php

error_reporting(E_ALL); // Tampilkan semua error
ini_set('display_errors', 1); // Aktifkan tampilan error di browser
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');



header('Content-Type: application/json');

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "comicverse"; // Pastikan ini nama database Anda

// Buat koneksi ke database
$conn = new mysqli($servername, $username, $password, $dbname);

// Cek koneksi
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit();
}


$sql = "SELECT id, title, author, publisher, price, description, image_url, genre FROM products";

$result = $conn->query($sql);

$products = [];
if ($result && $result->num_rows > 0) { // Tambahkan cek $result untuk error query
    while($row = $result->fetch_assoc()) {
        // Konversi price ke float/number di PHP agar lebih pasti di JS
        $row['price'] = (float)$row['price'];
        $products[] = $row;
    }
} else {
    // Jika tidak ada hasil atau ada error query
    if ($conn->error) {
        error_log("SQL Error: " . $conn->error); // Log error ke server
        // echo json_encode(["error" => "SQL query failed: " . $conn->error]); // Bisa diaktifkan untuk debugging di browser
    }
    // Jika tidak ada hasil, array products akan tetap kosong []
}

$conn->close();

echo json_encode($products);
?>