<?php
    //Stores error messages in a file
    ini_set("error_reporting",E_ALL);
    ini_set("log_errors","1");
    ini_set("error_log","php_errors.txt");
?>

<?php
    require_once ("../include/db.inc.php");

    //Checks if the connection failed and returns to the home page if it did
    if($link == FALSE)
    {
        die("Error connecting to mysql server :". mysqli_connect_error());
    }

    //Query to be made on the database
    $query = "SELECT l.name, i.filename FROM `location` l LEFT JOIN `image` i ON l.name = i.lname AND i.isThumbnail = 1";
    //Gets the result of the query
    $result = mysqli_query($link, $query);

    $data = array();

    //If the query didn't fail
    if($result != FALSE) 
    {
        //Loop through each row in the query results
        while($row = mysqli_fetch_assoc($result)) 
        {
            $data[] = $row;
        }
        
        echo json_encode($data);
    }
    //If the query failed
    else
    {
        die("Error in database query");
    }

    //Close database connection
    mysqli_close($link);
?>