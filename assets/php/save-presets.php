<?php
/**
 * Created by PhpStorm.
 * User: Jiachen
 * Date: 7/8/17
 * Time: 10:36 a.m.
 */

include 'db-utils.php';
$conn = require_db_acc();

$directions = json_decode($_POST['json']);
$query_names = "";
$query_values = "";
echo "querying...\n";
foreach ($directions as $name => $value) {
    $query_names .= (string)$name . ",";
    $formatted = (gettype($value) == "boolean" ? $value ? "TRUE" : "FALSE" : (string)$value);
    $query_values .= gettype($value) == "string" ? "\"" . $formatted . "\"," : $formatted . ",";
    echo "name: " . $name . ", value: " . $value . ", type: " . gettype($value) . ";\n";
}
/** @noinspection SqlInsertValues */
$sql = " `flock-animation-presets` (" . substr($query_names, 0, -1) . ")
VALUES (" . substr($query_values, 0, -1) . ")";
if ($conn->query("INSERT INTO" . $sql) === TRUE) echo "Presets successfully queried.";
else if ($conn->query("REPLACE" . $sql) === TRUE)
    echo "Key entry has been overridden.";
else echo "Error: " . $sql . $conn->error;

//echo json_encode($directions);