<?php
$host = 'localhost';
$username = 'root';
$password = ''; // Update if your MySQL has a password
$database = 'bitebuzz';

$conn = new mysqli($host, $username, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>