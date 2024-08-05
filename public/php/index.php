<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
// ini_set('mysqlnd_ms_config.max_packet_size', '64M');
// SET GLOBAL max_allowed_packet = 1073741824;

// Include Composer autoloader
require 'vendor/autoload.php';

// Create Database Connection
require './database/db_creator.php';
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
require "./functions/sql_functions.php";

// Use JWT Token
require './functions/token_functions.php';

// Use Server Method
$method = $_SERVER['REQUEST_METHOD'];

// Make Global $POST_data
if ($method === 'POST') {
    $Post_object = file_get_contents('php://input');
    $POST_data = json_decode($Post_object, true);
}

// Make Global Response
$response = [
    'err' => true,
    'msg' => null,
    'data' => null,
];

$endpoints = [
    '/api/insert' => 'insert_data',
    '/api/update' => 'update_data',
];

// Use Controllers
require "./controllers/auth.php";
require "./controllers/aircrafts.php";
require "./controllers/connectors.php";
require "./controllers/projects.php";
require "./controllers/retrofit.php";
require "./controllers/users.php";
require "./controllers/warehouse.php";
require "./controllers/forms.php";
require "./controllers/reports.php";
require "./controllers/kpi.php";

// Use Router
require "./assets/router.php";
