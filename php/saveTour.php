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

    if(isset($_POST['name']) && isset($_POST['description']))
    {
        $query = "";
        
        $name = $_POST['name'];
        $description = $_POST['description'];
        $uploadedThumbnail = "";
        
        //Related items that have been selected
        $i = 0;
        while(isset($_POST['loc-'.$i]))
        {
            $location = $_POST['loc-'.$i];
            
            //Query to be made on the database
            $query .= "INSERT INTO `contain`(`tname`, `lname`) VALUES ('$name','$location');";
            
            $i++;
        }
        
        if(isset($_FILES['thumbnail']['name']))
        {
            if(!is_uploaded_file($_FILES['thumbnail']['tmp_name']))
            {
                echo "No thumbnail uploaded\n";
            }
            else
            {
                $thumbName = $_FILES['thumbnail']['name'];
                $thumbSourcePath = $_FILES['thumbnail']['tmp_name'];
                $thumbTargetPath = "../photos/thumb-".$thumbName;
                if(move_uploaded_file($thumbSourcePath,$thumbTargetPath))
                {
                    $uploadedThumbnail = "thumb-".$thumbName;
                }
            }
        }

        //Query to be made on the database
        if($uploadedThumbnail != "")
        {
            $query .= "INSERT INTO `tour`(`name`, `description`, `image`) VALUES ('$name', '$description', '$uploadedThumbnail');";
        }
        else
        {
            $query .= "INSERT INTO `tour`(`name`, `description`) VALUES ('$name', '$description');";
        }

        //Gets the result of the query
        $result = mysqli_multi_query($link, $query);

        //If the query didn't fail
        if($result != FALSE) 
        {
            echo "Tour has been saved.";
            //echo $query;
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