<?php
/**
 * Created by PhpStorm.
 * User: Jiachen
 * Date: 7/8/17
 * Time: 10:27 a.m.
 */
function require_db_acc()
{
    $server = "mysql.hostinger.com";
    $username = "u106841746_jren";
    $password = "Rjc-819825-3161";
    $database = "u106841746_db";

// Create connection
    $conn = new mysqli($server, $username, $password, $database);

// Check connection
    if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);
    else return $conn;
}