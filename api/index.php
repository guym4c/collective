<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;

require '../keys/keys.php';


// Get the PHP helper library from twilio.com/docs/php/install
require '../vendor/autoload.php'; // Loads the library
use Twilio\Rest\Client;
$app = new \Slim\App;

$sid = getTwilioSid();
$token = getTwilioToken();
$client = new Client($sid, $token);


$app->get("/words", function ($request, $response) {
    $sql = "SELECT id, stringN, timestamp FROM words ORDER BY id";
 
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $names = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($names);
    } catch (PDOException $e) {
        echo '["Success":"False"]';
    }
});

$app->get("/words/{amount}", function ($request, $response) {
    $amount = $request->getAttribute('amount');
    $sql = "SELECT id, stringN, timestamp FROM words ORDER BY id DESC LIMIT $amount";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $names = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($names);
    } catch (PDOException $e) {
        echo '["Success":"False"]';
        print_r($e);
    }
});

$app->get("/words/{start}/{amount}", function ($request, $response) {
    $amount = $request->getAttribute('amount');
    $start = $request->getAttribute('start');
    $sql = "SELECT id, stringN, timestamp FROM words ORDER BY id LIMIT $amount OFFSET $start";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $names = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        echo json_encode($names);
    } catch (PDOException $e) {
        echo '["Success":"False"]';
    }
});

$app->post("/words", function ($request, $response) {

    $data = $request->getParsedBody();
    $id = $data['Body'];
    
    $sql = "INSERT INTO words (id, stringN) VALUES (NULL, \"$id\")";
    try {
        $db = getConnection();
        $stmt = $db->query($sql);
        $db = null;
    } catch (PDOException $e) {
       echo '["Success":"False"]';
    }

    echo "<Response><Message>Thanks for submitting.</Message></Response>";


});


$app->run();

//MySQL Connection - PDO
