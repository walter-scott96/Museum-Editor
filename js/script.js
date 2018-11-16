var geocoder;
var markers = [];
var selPos;

/* Initialise map */
function initialize()
{
	geocoder = new google.maps.Geocoder();
    myMap();
}

/* Set up map properties */
function myMap() {
    var mapOptions = {
        center: new google.maps.LatLng(-37.895, 175.47),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    
    //Listen for map click
    map.addListener('click', function(e) {
        placeMarkerAndPanTo(e.latLng, map);
  });
}

/* Place marker on map at position that was clicked */
function placeMarkerAndPanTo(latLng, map) {
    DeleteMarkers();
    var marker = new google.maps.Marker({
    position: latLng,
    map: map
  });
    markers.push(marker);
    map.panTo(latLng);
}

/* Remove existing markers */
function DeleteMarkers() {
    //Loop through all the markers and remove
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

/* Save selected location */
function setLocation()
{
    selPos = markers[0].position;
    closeModal();
}

function addloc()
{
    window.location.assign("./location.html");
}


/* Toggle classes to make preview window appear */
function move()
{
    document.getElementById('preview-container').classList.toggle('open');
    document.getElementById('page-content').classList.toggle('shrink');
    //alert(document.getElementById('preview-container').className);
}


function highlight()
{
    var i = document.getElementById("selectors");
    var e = document.createElement('div');
    e.style.color="green";
    e.style.width='15px';
    e.style.height='15px';
    i.appendChild(e);
}


/* Make map modal appear */
function openModal()
{
    var modal = document.getElementById('myModal');
    modal.style.display = "block";
}

/*Hide the map modal */
function closeModal()
{
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
}


function save()
{
    window.location.assign("../index.html");
}


/* Switch entry from selected to unselected, including clicks on child elements */
function clicked(e)
{
    if(e.target.nodeName === "A")
    {
        if(e.target.className === "unselectedEntry")
        {
            e.target.className = "selectedEntry";
            e.target.lastChild.className = "entryCheckVisible";
        }
        else
        {
            e.target.className = "unselectedEntry";
            e.target.lastChild.className = "entryCheckHidden";
        }
    }
    else if(e.target.nodeName === "DIV")
    {
        if(e.target.parentElement.className === "unselectedEntry")
        {
            e.target.parentElement.className = "selectedEntry";
            e.target.parentElement.lastChild.className = "entryCheckVisible";
        }
        else
        {
            e.target.parentElement.className = "unselectedEntry";
            e.target.parentElement.lastChild.className = "entryCheckHidden";
        }
    }
    else if(e.target.nodeName === "P")
    {
        if(e.target.parentElement.parentElement.className === "unselectedEntry")
        {
            e.target.parentElement.parentElement.className = "selectedEntry";
            e.target.parentElement.parentElement.lastChild.className = "entryCheckVisible";
        }
        else
        {
            e.target.parentElement.parentElement.className = "unselectedEntry";
            e.target.parentElement.parentElement.lastChild.className = "entryCheckHidden";
        }
    }
}

//Generic ajax request
function ajaxRequest(method, url, async, data, callback)
{
	var request = new XMLHttpRequest();
	request.open(method, url, async);
	
	if(method == "POST")
    {
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	}
	
	request.onreadystatechange = function()
    {
		if(request.readyState == 4)
        {
			if(request.status == 200)
            {
				var response = request.responseText;
				callback(response);
			} 
            else 
            {
				//do nothing
			}
		}
	}
	
	request.send(data);
}

/* Save location entry to the database */
function saveLocation()
{
    var name = document.getElementById("name").value;
    var description = document.getElementById("description").value;
    var photos = document.getElementById("photos").files;
    var thumbnail = document.getElementById("thumbnail").files;
    
    //Check location is selected
    if(markers.length == 0)
    {
        alert("Please set a location using the map.");
    }
    //Check other data is entered
    else if((name == null || name == "") && (description == null || description == ""))
    {
        alert("Please fill out all fields.");
    }
    else
    {   
        //If location has been selected to edit, then update record
        var urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has('name'))
        {
            //Form data
            var data = new FormData();
            data.append('name', urlParams.get('name'));
            data.append('newName', name);
            data.append('description', description);
            data.append('lat', selPos.lat());
            data.append('lon', selPos.lng());

            //If new thumbnail is selected, then set to be deleted and a new one to be uploaded
            if(document.getElementById("thumbnail").value != "")
            {
                data.append('setThumbnail', "set");
                
                //Thumbnail
                jQuery.each(jQuery('#thumbnail')[0].files, function(i, file){
                    console.log("Thumbnail selected");
                    data.append('thumbnail', file);
                });
            }

            //Photos
            jQuery.each(jQuery('#photos')[0].files, function(i, file){
                console.log("Photos selected");
                data.append('file-' + i, file);
            });

            //Linked items
            $('.selectedEntry').each(function(i, item) {
                var itemName = item.firstChild.firstChild.innerHTML;
                console.log(itemName);
                data.append('item-' + i, itemName);
            });

            for (var value of data.values())
            {
               console.log(value); 
            }

            //Request
            $.ajax({
                type: 'POST',
                url: "../php/updateLocation.php",
                cache: false,
                contentType: false,
                processData: false,
                data: data,
                success: function(response)
                {
                    alert(response);
                    //Return to home page
                    window.location.assign("../");
                }
            });
        }
        //If new location, then save normally
        else
        {
            //Form data
            var data = new FormData();
            data.append('name', name);
            data.append('description', description);
            data.append('lat', selPos.lat());
            data.append('lon', selPos.lng());

            //Thumbnail
            jQuery.each(jQuery('#thumbnail')[0].files, function(i, file){
                console.log("Thumbnail selected");
                data.append('thumbnail', file);
            });

            //Photos
            jQuery.each(jQuery('#photos')[0].files, function(i, file){
                console.log("Photos selected");
                data.append('file-' + i, file);
            });

            //Linked items
            $('.selectedEntry').each(function(i, item) {
                var itemName = item.firstChild.firstChild.innerHTML;
                console.log(itemName);
                data.append('item-' + i, itemName);
            });

            for (var value of data.values())
            {
               console.log(value); 
            }

            //Request
            $.ajax({
                type: 'POST',
                url: "../php/saveLocation.php",
                cache: false,
                contentType: false,
                processData: false,
                data: data,
                success: function(response)
                {
                    alert(response);
                    //Return to home page
                    window.location.assign("../");
                }
            });
        }
    }
}

/* Save item entry to the database */
function saveItem()
{
    var name = document.getElementById("name").value;
    var description = document.getElementById("description").value;
    var category = document.getElementById("category").value;
    var photos = document.getElementById("photos").files;
    var thumbnail = document.getElementById("thumbnail").files;
    
    //Check data has been entered
    if((name == null || name == "") && (description == null || description == "") && (category == null || category == ""))
    {
        alert("Please fill out all fields.");
    }
    else
    {
        //If item has been selected to edit, then update record
        var urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has('name'))
        {
            //Form data
            var data = new FormData();
            data.append('name', urlParams.get('name'));
            data.append('newName', name);
            data.append('description', description);
            data.append('category', category);

            //If new thumbnail is selected, then set to be deleted and a new one to be uploaded
            if(document.getElementById("thumbnail").value != "")
            {
                data.append('setThumbnail', "set");
                
                //Thumbnail
                jQuery.each(jQuery('#thumbnail')[0].files, function(i, file){
                    console.log("Thumbnail selected");
                    data.append('thumbnail', file);
                });
            }

            //Photos
            jQuery.each(jQuery('#photos')[0].files, function(i, file){
                console.log("Photos selected");
                data.append('file-' + i, file);
            });

            //Linked locations
            $('.selectedEntry').each(function(i, location) {
                var locationName = location.firstChild.firstChild.innerHTML;
                console.log(locationName);
                data.append('loc-' + i, locationName);
            });

            //Request
            $.ajax({
                type: 'POST',
                url: "../php/updateItem.php",
                cache: false,
                contentType: false,
                processData: false,
                data: data,
                success: function(response)
                {
                    alert(response);
                    //Return to home page
                    window.location.assign("../");
                }
            });
        }
        //If new item, then save normally
        else
        {
            //Form data
            var data = new FormData();
            data.append('name', name);
            data.append('description', description);
            data.append('category', category);

            //Thumbnail
            jQuery.each(jQuery('#thumbnail')[0].files, function(i, file){
                console.log("Thumbnail selected");
                data.append('thumbnail', file);
            });

            //Photos
            jQuery.each(jQuery('#photos')[0].files, function(i, file){
                console.log("Photos selected");
                data.append('file-' + i, file);
            });

            //Linked locations
            $('.selectedEntry').each(function(i, location) {
                var locationName = location.firstChild.firstChild.innerHTML;
                console.log(locationName);
                data.append('loc-' + i, locationName);
            });

            //Request
            $.ajax({
                type: 'POST',
                url: "../php/saveItem.php",
                cache: false,
                contentType: false,
                processData: false,
                data: data,
                success: function(response)
                {
                    alert(response);
                    //Return to home page
                    window.location.assign("../");
                }
            });
        }
    }
}

/* Save tour entry to the database */
function saveTour()
{
    var name = document.getElementById("name").value;
    var description = document.getElementById("description").value;
    var thumbnail = document.getElementById("thumbnail").files;
    
    //Check data has been entered
    if((name == null || name == "") && (description == null || description == ""))
    {
        alert("Please fill out all fields.");
    }
    else
    {
        //If tour has been selected to edit, then update record
        var urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has('name'))
        {
            var data = new FormData();
            data.append('name', urlParams.get('name'));
            data.append('newName', name);
            data.append('description', description);
            
            //If new thumbnail is selected, then set to be deleted and a new one to be uploaded
            if(document.getElementById("thumbnail").value != "")
            {
                data.append('setThumbnail', "set");
                
                //Thumbnail
                jQuery.each(jQuery('#thumbnail')[0].files, function(i, file){
                    console.log("Thumbnail selected");
                    data.append('thumbnail', file);
                });
            }
            
            //Linked locations
            $('.selectedEntry').each(function(i, location) {
                var locationName = location.firstChild.firstChild.innerHTML;
                console.log(locationName);
                data.append('loc-' + i, locationName);
            });
            
            //Request to delete tour
            $.ajax({
                type: 'POST',
                url: "../php/updateTour.php",
                cache: false,
                contentType: false,
                processData: false,
                data: data,
                success: function(response)
                {
                    alert(response);
                    //Return to home page
                    window.location.assign("../");
                }
            });
        }
        //If new tour, then save normally
        else
        {
            //Form data
            var data = new FormData();
            data.append('name', name);
            data.append('description', description);
            
            //Thumbnail
            jQuery.each(jQuery('#thumbnail')[0].files, function(i, file){
                console.log("Thumbnail selected");
                data.append('thumbnail', file);
            });
            
            //Linked locations
            $('.selectedEntry').each(function(i, location) {
                var locationName = location.firstChild.firstChild.innerHTML;
                console.log(locationName);
                data.append('loc-' + i, locationName);
            });

            //Request
            $.ajax({
                type: 'POST',
                url: "../php/saveTour.php",
                cache: false,
                contentType: false,
                processData: false,
                data: data,
                success: function(response)
                {
                    alert(response);
                    //Return to home page
                    window.location.assign("../");
                }
            });
        }
    }
}

/* Call functions to grab entries to display on the home page */
function homeSetup()
{
    getTours();
    getLocations();
    getItems();
}

/* Get list of tour entries in the database */
function getTours()
{
    url = "./php/getTourList.php";
    ajaxRequest("GET", url, true, "", addTours);
}
/* Display those tours on the page */
function addTours(response)
{
    var data = JSON.parse(response);
    
    var container = document.getElementById("tourWrapper");
    
    if(data.length == 0)
    {
        var message = document.createElement("P");
        message.innerHTML = "No data available";
        container.appendChild(message);
        return;
    }
    
    //For each tour create a card with entries' name and its thumbnail
    for(i = 0; i < data.length; i++)
    {
        var a = document.createElement("A");
        var div = document.createElement("DIV");
        var p = document.createElement("P");
        
        var param = data[i].name.replace(/ /g,"_");
        
        a.href = "./edit/tour.html?name="+param;
        div.className = "card";
        if(data[i].image != null){
            div.style.backgroundImage = 'url("./photos/' + data[i].image + '")';
        }
        p.innerHTML = data[i].name;
        
        div.appendChild(p);
        a.appendChild(div);
        container.appendChild(a);
    }
}

/* Get list of location entries in the database */
function getLocations()
{
    url = "./php/getLocationList.php";
    ajaxRequest("GET", url, true, "", addLocations);
}
/* Display those locations on the page */
function addLocations(response)
{
    var data = JSON.parse(response);
    
    var container = document.getElementById("locationWrapper");
    
    if(data.length == 0)
    {
        var message = document.createElement("P");
        message.innerHTML = "No data available";
        container.appendChild(message);
        return;
    }
    
    //For each location create a card with entries' name and its thumbnail
    for(i = 0; i < data.length; i++)
    {
        var a = document.createElement("A");
        var div = document.createElement("DIV");
        var p = document.createElement("P");
        
        var param = data[i].name.replace(/ /g,"_");
        
        a.href = "./edit/location.html?name="+param;
        div.className = "card";
        if(data[i].filename != null){
            div.style.backgroundImage = 'url("./photos/' + data[i].filename + '")';
        }
        p.innerHTML = data[i].name;
        
        div.appendChild(p);
        a.appendChild(div);
        container.appendChild(a);
    }
}

/* Get list of item entries in the database */
function getItems()
{
    url = "./php/getItemList.php";
    ajaxRequest("GET", url, true, "", addItems);
}
/* Display those items on the page */
function addItems(response)
{
    var data = JSON.parse(response);
    
    var container = document.getElementById("itemWrapper");
    
    if(data.length == 0)
    {
        var message = document.createElement("P");
        message.innerHTML = "No data available";
        container.appendChild(message);
        return;
    }
    
    //For each item create a card with entries' name and its thumbnail
    for(i = 0; i < data.length; i++)
    {
        var a = document.createElement("A");
        var div = document.createElement("DIV");
        var p = document.createElement("P");
        
        var param = data[i].name.replace(/ /g,"_");
        
        a.href = "./edit/item.html?name="+param;
        div.className = "card";
        if(data[i].filename != null){
            div.style.backgroundImage = 'url("./photos/' + data[i].filename + '")';
        }
        p.innerHTML = data[i].name;
        
        div.appendChild(p);
        a.appendChild(div);
        container.appendChild(a);
    }
}

/* Get data to display tour page */
function tourSetup()
{
    //Grab location list
    url = "../php/getLocationList.php";
    ajaxRequest("GET", url, true, "", tourAddLocations);
    
    //If tour has been selected to edit, grab all the data for the one selected
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('name'))
    {
        url = "../php/getTour.php?name="+urlParams.get('name');
        ajaxRequest("GET", url, true, "", fillTour);
    }
}
/* Add the list of locations to the page as selectable cards */
function tourAddLocations(response)
{
    var data = JSON.parse(response);
    
    var container = document.getElementById("locationWrapper");

    if(data.length == 0)
    {
        var message = document.createElement("P");
        message.innerHTML = "No data available";
        container.appendChild(message);
        return;
    }
    
    //For each location create a card with entries' name and its thumbnail
    for(i = 0; i < data.length; i++)
    {
        var a = document.createElement("A");
        var div = document.createElement("DIV");
        var p = document.createElement("P");
        var c = document.createElement("DIV");
        
        a.href = "#";
        a.className = "unselectedEntry";
        a.setAttribute("onclick", "clicked(event);");
        div.className = "card";
        if(data[i].filename != null){
            div.style.backgroundImage = 'url("../photos/' + data[i].filename + '")';
        }
        p.innerHTML = data[i].name;
        c.className = "entryCheckHidden";
        c.innerHTML = "&#10004;";
        
        div.appendChild(p);
        a.appendChild(div);
        a.appendChild(c);
        container.appendChild(a);
    }
}
/* Fill the page with the data of the selected tour */
function fillTour(response)
{
    var data = JSON.parse(response);

    var container = document.getElementById("locationWrapper");

    if(data[0][0].length == 0)
    {
        /*
        var message = document.createElement("P");
        message.innerHTML = "Missing data.";
        container.appendChild(message);
        return;
        */
        alert("Missing data.");
    }
    //Fill fields and set selected locations
    else
    {
        document.getElementById("name").value = data[0][0].name;
        document.getElementById("description").value = data[0][0].description;
        
        //If there are selections made
        if(data[1].length != 0)
        {
            var locations = document.querySelectorAll('#locationWrapper > *');
            //console.log(items);

            //Check each location against the ones for this item and set them as selected
            for(i = 0; i < locations.length; i++)
            {
                //console.log("------------- " + locations[i].firstChild.firstChild.innerHTML + " -------------");

                for(j = 0; j < data[1].length; j++)
                {
                    //console.log("Selected: " + data[1][j].lname);
                    if(locations[i].firstChild.firstChild.innerHTML == data[1][j].lname)
                    {
                        //console.log("MATCH!");
                        locations[i].className = "selectedEntry";
                        locations[i].lastChild.className = "entryCheckVisible";
                    }   
                }
            }
        }
    }
}

/* Get data to display location page */
function locationSetup()
{
    //Set onhover property for add button
    //Input has to go after button so pure css hover does not work
    $(function() {
      $('#photos').hover(function() {
        $('#addPhotos').css('box-shadow', '0 0 6px rgba(0, 0, 0, 0.6)');
      }, function() {
        //On mouseout, reset the shadow
        $('#addPhotos').css('box-shadow', '0 0 1px rgba(0, 0, 0, 0)');
      });
    });
    
    //Grab item list
    url = "../php/getItemList.php";
    ajaxRequest("GET", url, true, "", locationAddItems);
    
    //If location has been selected to edit, grab all the data for the one selected
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('name'))
    {
        url = "../php/getLocation.php?name="+urlParams.get('name');
        ajaxRequest("GET", url, true, "", fillLocation);
    }
}
/* Add the list of items to the page as selectable cards */
function locationAddItems(response)
{
    var data = JSON.parse(response);
    
    var container = document.getElementById("itemWrapper");

    if(data.length == 0)
    {
        var message = document.createElement("P");
        message.innerHTML = "No data available";
        container.appendChild(message);
        return;
    }
    
    //For each item create a card with entries' name and its thumbnail
    for(i = 0; i < data.length; i++)
    {
        var a = document.createElement("A");
        var div = document.createElement("DIV");
        var p = document.createElement("P");
        var c = document.createElement("DIV");        
        
        a.href = "#";
        a.className = "unselectedEntry";
        a.setAttribute("onclick", "clicked(event);");
        div.className = "card";
        if(data[i].filename != null){
            div.style.backgroundImage = 'url("../photos/' + data[i].filename + '")';
        }
        p.innerHTML = data[i].name;
        c.className = "entryCheckHidden";
        c.innerHTML = "&#10004;";
        
        div.appendChild(p);
        a.appendChild(div);
        a.appendChild(c);
        container.appendChild(a);
    }
}
/* Fill the page with the data of the selected location */
function fillLocation(response)
{
    var data = JSON.parse(response);

    var container = document.getElementById("itemWrapper");

    if(data[0][0].length == 0)
    {
        /*
        var message = document.createElement("P");
        message.innerHTML = "Missing data.";
        container.appendChild(message);
        return;
        */
        alert("Missing data.");
    }
    //Fill fields, display photos, and set selected locations
    else
    {
        document.getElementById("name").value = data[0][0].name;
        document.getElementById("description").value = data[0][0].description;
        
        //Set location on map
        var latLng = new google.maps.LatLng(data[0][0].lat, data[0][0].lon);
        var mapOptions = {
            center: new google.maps.LatLng(data[0][0].lat, data[0][0].lon),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        placeMarkerAndPanTo(latLng, map);
        
        //Listen for map click
        map.addListener('click', function(e) {
            placeMarkerAndPanTo(e.latLng, map);
        });
        setLocation();
        
        //If there are selections made
        if(data[2].length != 0)
        {
            var items = document.querySelectorAll('#itemWrapper > *');
            //console.log(items);

            //Check each item against the ones for this location and set them as selected
            for(i = 0; i < items.length; i++)
            {
                //console.log("------------- " + items[i].firstChild.firstChild.innerHTML + " -------------");

                for(j = 0; j < data[2].length; j++)
                {
                    //console.log("Selected: " + data[2][j].iname);
                    if(items[i].firstChild.firstChild.innerHTML == data[2][j].iname)
                    {
                        //console.log("MATCH!");
                        items[i].className = "selectedEntry";
                        items[i].lastChild.className = "entryCheckVisible";
                    }   
                }
            }
        }
        
        //console.log("Photos: ");
        
        //If there are photos uploaded
        if(data[1].length != 0)
        {
            //For each photo of this location create a card with the image
            for(i = 0; i < data[1].length; i++)
            {
                //console.log(data[i].filename);

                if(data[1][i].isThumbnail == 0)
                {
                    //console.log(data[1][i].filename);

                    //Insert photo
                    var container = document.getElementById("selectedPhotos");

                    var a = document.createElement("A");
                    a.href = "#";
                    a.className = "selectedPhoto";
                    a.setAttribute("onclick", "removePhoto(event);");
                    //a.setAttribute("data-filename", fileName);
                    var d = document.createElement("DIV");
                    d.className = "card";
                    d.style.backgroundImage = 'url("../photos/'+data[1][i].filename+'")';
                    var c = document.createElement("DIV");
                    c.className = "photoRemove";
                    c.innerHTML = "X";

                    a.appendChild(d);
                    a.appendChild(c);
                    container.appendChild(a);
                }
            }
        }
    }
}

/* Get data to display item page */
function itemSetup()
{
    //Set onhover property for add button
    //Input has to go after button so pure css hover does not work
    $(function() {
      $('#photos').hover(function() {
        $('#addPhotos').css('box-shadow', '0 0 6px rgba(0, 0, 0, 0.6)');
      }, function() {
        //On mouseout, reset the shadow
        $('#addPhotos').css('box-shadow', '0 0 1px rgba(0, 0, 0, 0)');
      });
    });
    
    //Grab location list (can use callback from tour setup)
    url = "../php/getLocationList.php";
    ajaxRequest("GET", url, true, "", tourAddLocations);
    
    //Grab the list of existing categories
    url = "../php/getCategories.php";
    ajaxRequest("GET", url, true, "", addCategories);
    
    //If item has been selected to edit, grab all the data for the one selected
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('name'))
    {
        url = "../php/getItem.php?name="+urlParams.get('name');
        ajaxRequest("GET", url, true, "", fillItem);
    }
}
/* Add existing categories as options of category input */
function addCategories(response)
{
    var data = JSON.parse(response);
    
    if(data.length != 0)
    {
        var dataList = document.getElementById("categoryList");
        
        //Add each category as option
        for(i = 0; i < data.length; i++)
        {
            var op = document.createElement("OPTION");
            op.value = data[i].category;
            
            dataList.appendChild(op);
        }
    }
}
/* Fill the page with the data of the selected item */
function fillItem(response)
{
    var data = JSON.parse(response);

    var container = document.getElementById("locationWrapper");

    if(data[0][0].length == 0)
    {
        /*
        var message = document.createElement("P");
        message.innerHTML = "Missing data.";
        container.appendChild(message);
        return;
        */
        alert("Missing data.");
    }
    else
    {
        document.getElementById("name").value = data[0][0].name;
        document.getElementById("description").value = data[0][0].description;
        document.getElementById("category").value = data[0][0].category;
        
        //If there are selections made
        if(data[2].length != 0)
        {
            var locations = document.querySelectorAll('#locationWrapper > *');
            //console.log(items);

            //Check each location against the ones for this item and set them as selected
            for(i = 0; i < locations.length; i++)
            {
                //console.log("------------- " + locations[i].firstChild.firstChild.innerHTML + " -------------");

                for(j = 0; j < data[2].length; j++)
                {
                    //console.log("Selected: " + data[2][j].lname);
                    if(locations[i].firstChild.firstChild.innerHTML == data[2][j].lname)
                    {
                        //console.log("MATCH!");
                        locations[i].className = "selectedEntry";
                        locations[i].lastChild.className = "entryCheckVisible";
                    }   
                }
            }
        }
        
        //console.log("Photos: ");
        
        //If there are photos uploaded
        if(data[1].length != 0)
        {
            //For each photo of this item create a card with the image
            for(i = 0; i < data[1].length; i++)
            {
                //console.log(data[i].filename);

                if(data[1][i].isThumbnail == 0)
                {
                    //console.log(data[1][i].filename);

                    //Insert photo
                    var container = document.getElementById("selectedPhotos");

                    var a = document.createElement("A");
                    a.href = "#";
                    a.className = "selectedPhoto";
                    a.setAttribute("onclick", "removePhoto(event);");
                    //a.setAttribute("data-filename", fileName);
                    var d = document.createElement("DIV");
                    d.className = "card";
                    d.style.backgroundImage = 'url("../photos/'+data[1][i].filename+'")';
                    var c = document.createElement("DIV");
                    c.className = "photoRemove";
                    c.innerHTML = "X";

                    a.appendChild(d);
                    a.appendChild(c);
                    container.appendChild(a);
                }
            }
        }
    }
}

/* Display previews of images selected in file input */
function displayPhotos(input)
{
    if(input.files && input.files[0])
    {
        var container = document.getElementById("selectedPhotos");
        
        //Remove existing selected file previews
        var existing = container.getElementsByClassName("inputPhoto");
        while(existing[0]) {
            existing[0].parentNode.removeChild(existing[0]);
        }
        
        var readers = [];
        var numFiles = input.files.length;
        console.log("Number of files: " + input.files.length);
        
        //Read in the data for each selected photo
        for(i = 0; i < numFiles; i++)
        {
            /*
            console.log(input.files[i]);
            console.log("File no.: " + i);
            console.log("File name: " + input.files[i].name);
            console.log("------------------------------");
            */
            
            readers[i] = new FileReader();
            readers[i].onload = loadReader;
            readers[i].readAsDataURL(input.files[i]);
        }
    }
}
/* Create the card with the photo preview */
function loadReader(e)
{
    var container = document.getElementById("selectedPhotos");
    
    var a = document.createElement("A");
    a.href = "#";
    a.className = "inputPhoto";
    a.setAttribute("onclick", "noRemove();");
    //a.setAttribute("data-filename", fileName);
    var d = document.createElement("DIV");
    d.className = "card";
    d.style.backgroundImage = 'url('+e.target.result+')';
    
    a.appendChild(d);
    container.appendChild(a);
}

/* Remove a photo from the database and server file system */
function removePhoto(e)
{
    if (confirm('Are you sure you want to remove this photo?'))
    {
        var data = new FormData();
        
        //Get name of the file from background image property
        if(e.target.nodeName === "A")
        {
            var loc = e.target.firstChild.style.backgroundImage.slice(4, -1).replace(/"/g, "");
            data.append('location', loc);
        }
        else if(e.target.nodeName === "DIV")
        {
            var loc = e.target.parentNode.firstChild.style.backgroundImage.slice(4, -1).replace(/"/g, "");
            data.append('location', loc);
        }
        
        //Request to remove photo
        $.ajax({
            type: 'POST',
            url: "../php/deletePhoto.php",
            cache: false,
            contentType: false,
            processData: false,
            data: data,
            success: function(response)
            {
                //Remove preview card from list
                if(e.target.nodeName === "A")
                {
                    e.target.parentNode.removeChild(e.target);
                }
                else if(e.target.nodeName === "DIV")
                {
                    e.target.parentElement.parentNode.removeChild(e.target.parentElement);
                }
            }
        });
    } 
    else {
        return;
    }
}

/* Can only change preview images through file input selection */
function noRemove()
{
    alert("Please choose different photos to change this selection.");
}


/* Delete the tour that has been selected */
function deleteTour()
{
    //Check that tour is selected
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('name'))
    {
        if (confirm('Are you sure you want to delete this tour?'))
        {
            var data = new FormData();
            
            data.append('name', urlParams.get('name'));
            
            //Request to delete tour
            $.ajax({
                type: 'POST',
                url: "../php/deleteTour.php",
                cache: false,
                contentType: false,
                processData: false,
                data: data,
                success: function(response)
                {
                    alert(response);
                    
                    //Return to home page
                    window.location.assign("../");
                }
            });
        }
        else {
            return;
        }
    }
    else
    {
        alert("Tour must be saved before deleting.");
    }
}
/* Delete the location that has been selected */
function deleteLocation()
{
    //Check that location is selected
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('name'))
    {
        if (confirm('Are you sure you want to delete this location?'))
        {
            var data = new FormData();
            
            data.append('name', urlParams.get('name'));
            
            //Request to delete location
            $.ajax({
                type: 'POST',
                url: "../php/deleteLocation.php",
                cache: false,
                contentType: false,
                processData: false,
                data: data,
                success: function(response)
                {     
                    alert(response);
                    //Return to home page
                    window.location.assign("../");
                }
            });
        }
        else {
            return;
        }
    }
    else
    {
        alert("Location must be saved before deleting.");
    }
}
/* Delete the item that has been selected */
function deleteItem()
{
    //Check that item is selected
    var urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('name'))
    {
        if (confirm('Are you sure you want to delete this item?'))
        {
            var data = new FormData();
            
            data.append('name', urlParams.get('name'));
            
            //Request to delete item
            $.ajax({
                type: 'POST',
                url: "../php/deleteItem.php",
                cache: false,
                contentType: false,
                processData: false,
                data: data,
                success: function(response)
                {     
                    alert(response);
                    //Return to home page
                    window.location.assign("../");
                }
            });
        }
        else {
            return;
        }
    }
    else
    {
        alert("Item must be saved before deleting.");
    }
}