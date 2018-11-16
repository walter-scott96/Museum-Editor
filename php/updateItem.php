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
        $item = str_replace('_', ' ', $_POST['name']);
        
        //Get thumbnail filename to be deleted
        $query = "SELECT `filename` FROM `image` WHERE `iname` = '$item' AND `isThumbnail` = 1";
        
        //Gets the result of the query
        $result = mysqli_query($link, $query);

        //If the query didn't fail
        if($result != FALSE) 
        {
            $row = mysqli_fetch_row($result);
            
            $filename = $row[0];
            
            $filePath = "../photos/".$filename;
            
            echo "Old thumbnail: ".$filename."\n";
            
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
                        echo "Deleted ".$filePath."\n";
                    }
                }
            }
            
            if(isset($_POST['newName']) && isset($_POST['description']) && isset($_POST['category']))
            {
                $query = "";

                $name = $_POST['newName'];
                $description = $_POST['description'];
                $category = $_POST['category'];
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
                
                echo "Saved new thumbnail: ".$uploadedThumbnail."\n";

                $query = "DELETE FROM `item` WHERE `name` = '$item'; DELETE FROM `related` WHERE `iname` = '$item'; DELETE FROM `image` WHERE `iname` = '$item' AND `isThumbnail` = 1;";
                $query .= "INSERT INTO `item` (`name`, `description`, `category`) VALUES ('$name', '$description', '$category'); INSERT INTO `image` (`filename`, `isThumbnail`, `iname`) VALUES ('$uploadedThumbnail', 1, '$name');";

                //Related locations that have been selected
                $i = 0;
                while(isset($_POST['loc-'.$i]))
                {
                    $location = $_POST['loc-'.$i];

                    //Query to be made on the database
                    $query .= "INSERT INTO `related`(`lname`, `iname`) VALUES ('$location', '$name');";

                    $i++;
                }
                
                echo "Adding photos.\n";
                //Related items that have been selected
                $j = 0;
                while(isset($_FILES['file-'.$j]['name']))
                {
                    if(!is_uploaded_file($_FILES['file-'.$j]['tmp_name']))
                    {
                        echo $_FILES['file-'.$j]['name']." - Photo not uploaded\n";
                    }
                    else
                    {
                        $photoName = $_FILES['file-'.$j]['name'];
                        $photoSourcePath = $_FILES['file-'.$j]['tmp_name'];
                        $photoTargetPath = "../photos/".$photoName;
                        if(move_uploaded_file($photoSourcePath,$photoTargetPath))
                        {
                            echo "Photo: ".$photoName."\n";

                            //Query to be made on the database
                            $query .= "INSERT INTO `image` (`filename`, `isThumbnail`, `iname`) VALUES ('$photoName', 0, '$name');";
                        }
                    }
                    
                    $j++;
                }
                echo $j." photos added.\n";
                
                //Update existing images if new name is entered
                if($item != $name)
                {
                    $query .= "UPDATE `image` SET `iname` = '$name' WHERE `iname` = '$item';";
                }

                //Gets the result of the query
                $result = mysqli_multi_query($link, $query);

                //If the query didn't fail
                if($result != FALSE) 
                {
                    echo "Changes to item have been saved.\n";
                    echo $query."\n";
                    echo "New: ".$name." ".$description." ".$category." ".$uploadedThumbnail."\n";
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