<?php
/**
 * Created by PhpStorm.
 * User: Jiachen
 * Date: 7/8/17
 * Time: 4:45 p.m.
 */
include 'db-utils.php';
$conn = require_db_acc();

$name = $_GET['name'];
$limit = $_GET['num'];
$sql = "SELECT * FROM `flock-animation-presets` WHERE name LIKE '%" . $name . "%' LIMIT " . $limit; //contains
$result = $conn->query($sql);
$output = array();
while ($row = $result->fetch_assoc()) {
    array_push($output, $row);
}
echo json_encode($output);
