<?php
$host     = 'localhost'; //localhost
$db       = 'u633829885_skyready';
$user     = 'u633829885_skyready_root';
$password = '@Soo2taw2eet';
try {
    $conn = new PDO("mysql:host=$host", $user, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $sql = 'CREATE DATABASE IF NOT EXISTS ' . $db . ' COLLATE "utf8_general_ci"';
    $conn->exec($sql);
} catch (PDOException $e) {
    echo $sql . "<br>" . $e->getMessage();
}
