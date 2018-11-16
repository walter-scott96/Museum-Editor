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

    if(isset($_POST['location']))
    {
        $file = $_POST['location'];
        
        //Delete file
        if(file_exists($file))
        {
            unlink($file);
        }
        
        //Extract filename from path
        $filename = basename($file);

        //Query to be made on the database
        //Delete entry in database
        $query = "DELETE FROM `image` WHERE `filename` = '$filename'";

        //Gets the result of the query
        $result = mysqli_multi_query($link, $query);

        //If the query didn't fail
        if($result != FALSE) 
        {
            echo "Image has been deleted.\n";
            echo $query;
        }
        //If the query failed
        else
        {
            die("Error in database query: ".$query."\n");
        }
    }
    else
    {
        echo "Error, request failed.\n";
    }

    //Close database connection
    mysqli_close($link);
?>