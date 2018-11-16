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
        $tour = str_replace('_', ' ', $_POST['name']);
        
        //Get thumbnail filename to be deleted
        $query = "SELECT `image` FROM `tour` WHERE `name` = '$tour'";
        
        //Gets the result of the query
        $result = mysqli_query($link, $query);

        //If the query didn't fail
        if($result != FALSE) 
        {
            $row = mysqli_fetch_row($result);
            
            $filename = $row[0];
            
            //Remove thumbnail if one was uploaded
            if($filename != "")
            {
                $filePath = "../photos/".$filename;

                //Delete file
                if(file_exists($filePath))
                {
                    unlink($filePath);
                    //echo "Deleted ".$filePath;
                }
            }
            //Query to be made on the database
            //Delete entry in database
            $query = "DELETE FROM `tour` WHERE `name` = '$tour';
                DELETE FROM `contain` WHERE `tname` = '$tour';";

            //Gets the result of the query
            $result = mysqli_multi_query($link, $query);

            //If the query didn't fail
            if($result != FALSE) 
            {
                echo "Tour has been deleted.";
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