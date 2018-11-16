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

    if(isset($_GET['name']))
    {
        $name = str_replace('_', ' ', $_GET['name']);
        
        //Query to be made on the database
        $query = "SELECT * FROM `tour` WHERE name = '$name'";
        //Gets the result of the query
        $tourResult = mysqli_query($link, $query);
        
        $query = "SELECT * FROM `contain` WHERE tname = '$name'";
        $containResult = mysqli_query($link, $query);
        
        $tables = array($tourResult, $containResult);
        $data = array();

        foreach($tables as $result)
        {
            $tmpData = array();
            
            //If the query didn't fail
            if($result != FALSE) 
            {
                //Loop through each row in the query results
                while($row = mysqli_fetch_assoc($result)) 
                {
                    $tmpData[] = $row;
                }

                //Push table to array
                array_push($data, $tmpData);
            }
            //If the query failed
            else
            {
                die("Error in database query");
            }
        }
        
        echo json_encode($data);
    }
    //Close database connection
    mysqli_close($link);
?>