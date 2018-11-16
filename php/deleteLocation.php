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

    if(isset($_POST['name']))
    {
        $location = str_replace('_', ' ', $_POST['name']);
        
        //Get thumbnail filename to be deleted
        $query = "SELECT `filename`, `isThumbnail` FROM `image` WHERE `lname` = '$location'";
        
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
            
            foreach($data as $file)
            {
                $filename = $file['filename'];
                $type = $file['isThumbnail'];
                $filePath = "../photos/".$filename;
                
                //Remove thumbnail if one was uploaded
                if($filename != "")
                {
                    //Delete file
                    if(file_exists($filePath))
                    {
                        unlink($filePath);
                        //echo "Deleted ".$filePath;
                    }
                }
            }
            
            //Query to be made on the database
            //Delete entry in database
            $query = "DELETE FROM `location` WHERE `name` = '$location';
                DELETE FROM `related` WHERE `lname` = '$location';
                DELETE FROM `image` WHERE `lname` = '$location';";

            //Gets the result of the query
            $result = mysqli_multi_query($link, $query);

            //If the query didn't fail
            if($result != FALSE) 
            {
                echo "Location has been deleted.";
            }
            //If the query failed
            else
            {
                die("Error in database query: ".$query."\n");
            }
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