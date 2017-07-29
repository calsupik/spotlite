<?php
	 
	require 'config.php';
	
	header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	
	$id = $_POST['id'];
	
    $con = mysqli_connect($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_DATABASE);
	
	if (!$con) {
    	die(json_encode("Connection failed: " . mysqli_connect_error()));
	}

	$query = "DELETE FROM Locations WHERE ID = ".$id;

	if (mysqli_query($con, $query)) {
    	echo json_encode("Location Removed Successfully!");
	} else {
    	echo json_encode("Error, Location Remove Failed.");
	}

	mysqli_close($con);
	
?>