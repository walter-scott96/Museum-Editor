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
            
            $filePath = "../photos/".$filename;
            
            //Only delete photo if a new one has been selected
            if(isset($_POST['setThumbnail']))
            {
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

            if(isset($_POST['newName']) && isset($_POST['description']))
            {
                $query = "";

                $name = $_POST['newName'];
                $description = $_POST['description'];
                $uploadedThumbnail = "";

                //Only upload photo if a new one has been selected
                if(isset($_POST['setThumbnail']))
                {
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
                }
                else
                {
                    $uploadedThumbnail = $filename;
                }

                $query = "DELETE FROM `tour` WHERE `name` = '$tour'; DELETE FROM `contain` WHERE `tname` = '$tour';";
                $query .= "INSERT INTO `tour`(`name`, `description`, `image`) VALUES ('$name', '$description', '$uploadedThumbnail');";

                //Related items that have been selected
                $i = 0;
                while(isset($_POST['loc-'.$i]))
                {
                    $location = $_POST['loc-'.$i];

                    //Query to be made on the database
                    $query .= "INSERT INTO `contain`(`tname`, `lname`) VALUES ('$name', '$location');";

                    $i++;
                }

                //Gets the result of the query
                $result = mysqli_multi_query($link, $query);

                //If the query didn't fail
                if($result != FALSE) 
                {
                    echo "Changes to tour have been saved.";
                    //echo $query;
                    //echo "New: ".$name." ".$description." ".$uploadedThumbnail;
                }
                //If the query failed
                else
                {
                    die("Error in database query: ".$query."\n".mysqli_error($link));
                }
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