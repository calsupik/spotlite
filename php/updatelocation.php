<?php
	 
	require 'config.php';
	
	header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	
	$id = addslashes($_POST['id']);
	$name = addslashes($_POST['name']);
	$shortDesc = addslashes($_POST['shortDesc']);
	$longDesc = addslashes($_POST['longDesc']);
	$img = addslashes($_POST['img']);
	$lat = addslashes($_POST['lat']);
	$lng = addslashes($_POST['lng']);
	$radius = addslashes($_POST['radius']);
	$category = addslashes($_POST['category']);
	$deal = addslashes($_POST['deal']);

	
    $con = mysqli_connect($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_DATABASE);
	
	if (!$con) {
    	die(json_encode("Connection failed: " . mysqli_connect_error()));
	}

	$query = "UPDATE  `NexMove`.`Locations` SET "; 
	
	if ($title != NULL){
		$query = $query."'Title' = '".$title."', "; 
	}
	
	$query = $query."WHERE  `Locations`.`ID` = ".$id;
			
	if (mysqli_query($con, $query)) {
    	echo json_encode("Location Updated Successfully!");
	} else {
    	echo json_encode("Error, Location Update Failed.");
	}

	mysqli_close($con);
	
?>