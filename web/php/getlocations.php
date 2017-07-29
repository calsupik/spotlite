<?php
	
	/**
	 * Returns all Locations as JSON
	 */

	require 'config.php';
	
	header('Content-Type: application/json');
	header('Access-Control-Allow-Origin: *');
	
	$lat = $_POST['lat'];
	$lng = $_POST['lng'];
	$category = $_POST['category'];
	$distance = 100000000;
	
    $con = mysqli_connect($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_DATABASE);
    
    if (!$con) {
    	die(json_encode("Connection failed: " . mysqli_connect_error()));
	}
	
    $query = "";

	if(($lat != NULL) && ($lng != NULL)){
		$query .= "SELECT * , SQRT( POW( 69.1 * ( Latitude - ".$lat.") , 2 ) + POW( 69.1 * (".$lng." - Longitude ) * COS( Latitude / 57.3 ) , 2 ) ) AS Distance FROM Locations";
		
		if($category != NULL){
			$query .= " WHERE Category = '".$category."' HAVING Distance < ".$distance." ORDER BY Distance";
		}else{
			$query .= " HAVING Distance < ".$distance." ORDER BY Distance";
		}
		
	}else{
		$query .= "SELECT * FROM Locations";
				  
		if($category != NULL){
			$query .= " WHERE Category = '".$category;
		}
		
	}	
	
	
	if (mysqli_connect_errno($con)){
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}
		
    $results = mysqli_query($con,$query);

	$rows = mysqli_num_rows($results);
	
    $locations = array();
    $location = array();
	
    if ($rows != null){
        while ($row = mysqli_fetch_array($results)) {
			
            $location["id"] = $row["ID"];
			$location["name"] = $row["Name"];
			$location["shortDesc"] = $row["ShortDesc"];
			$location["longDesc"] = $row["LongDesc"];
			$location["img"] = $row["Image"];	
			$location["lat"] = $row["Latitude"];	
			$location["lng"] = $row["Longitude"];	
			$location["radius"] = $row["Radius"];
			$location["category"] = $row["Category"];
			$location["deal"] = $row["Deal"];
			
            array_push($locations,$location);
        }
		
        echo json_encode($locations);
		
    }
	
	mysqli_close();
?>