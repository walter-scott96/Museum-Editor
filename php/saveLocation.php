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

    if(isset($_POST['name']) && isset($_POST['description']) && isset($_POST['lat']) && isset($_POST['lon']))
    {
        $query = "";
        
        $name = $_POST['name'];
        $description = $_POST['description'];
        $lat = $_POST['lat'];
        $lon = $_POST['lon'];
        $uploadedThumbnail = "";
        
        //Related items that have been selected
        $i = 0;
        while(isset($_POST['item-'.$i]))
        {
            $item = $_POST['item-'.$i];
            
            //Query to be made on the database
            $query .= "INSERT INTO `related`(`lname`, `iname`) VALUES ('$name','$item');";
            
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
        
        //If photos have been selected for upload
        if(isset($_FILES['file-0']['name']))
        {
            $c = 0;
            $photos = [];
            while(isset($_FILES['file-'.$c]['name']))
            {
                //echo $_FILES['file-'.$c]['name'];
                if(!is_uploaded_file($_FILES['file-'.$c]['tmp_name']))
                {
                    echo "No file uploaded\n";
                }
                else
                {
                    $fileName = $_FILES['file-'.$c]['name'];
                    $sourcePath = $_FILES['file-'.$c]['tmp_name'];
                    $targetPath = "../photos/".$fileName;
                    if(move_uploaded_file($sourcePath,$targetPath))
                    {
                        $uploadedFile = $fileName;

                        array_push($photos, $uploadedFile);
                    }
                }
                $c++;
            }
            
            //Check that the files were uploaded
            if(sizeOf($photos) == $c)
            {
                //Query to be made on the database
                $query .= "INSERT INTO `location`(`name`, `description`, `lat`, `lon`) VALUES ('$name','$description', $lat, $lon); INSERT INTO `image`(`filename`, `isThumbnail`,`lname`) VALUES ";
                
                //Add each set of values for join table
                foreach($photos as $photo)
                {
                    $query .= "('$photo', 0, '$name'), ";
                }
                $query = substr_replace($query,"",-2);
                $query .= ";";
                
                if($uploadedThumbnail != "")
                {
                    $query .= " INSERT INTO `image`(`filename`, `isThumbnail`,`lname`) VALUES ('$uploadedThumbnail', 1, '$name');";
                }
                
                //Gets the result of the query
                $result = mysqli_multi_query($link, $query);

                //If the query didn't fail
                if($result != FALSE) 
                {
                    echo "Location has been saved.";
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
                echo "File upload unsuccessful\n";
            }
        }
        //No photos added
        else
        {
            //Query to be made on the database
            $query .= "INSERT INTO `location`(`name`, `description`, `lat`, `lon`) VALUES ('$name','$description', $lat, $lon);";
            
            if($uploadedThumbnail != "")
            {
                $query .= " INSERT INTO `image`(`filename`, `isThumbnail`,`lname`) VALUES ('$uploadedThumbnail', 1, '$name');";
            }
            
            //Gets the result of the query
            $result = mysqli_multi_query($link, $query);

            //If the query didn't fail
            if($result != FALSE) 
            {
                echo "Location has been saved.";
                //echo $query;
            }
            //If the query failed
            else
            {
                die("Error in database query: ".$query."\n");
            }
        }
    }
    else
    {
        echo "Error, request failed.\n";
    }

    //Close database connection
    mysqli_close($link);
?>