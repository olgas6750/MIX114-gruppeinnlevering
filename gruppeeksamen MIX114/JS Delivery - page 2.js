// JS for maps starts here:
function initMap() {
     const mapOptions = {
          center: { lat: 60.389181, lng: 5.333219 },
          zoom: 14,
     };

     //!!!!!!!!!!!!!!!! Main map starts here !!!!!!!!!!!!!!!!1
     const map2 = new google.maps.Map(
          document.getElementById("delivery2-main-map"),
          mapOptions
     );

     // Main map pinpoints starts here

     const coordinates = [
          { lat: 60.3901, lng: 5.332, name: "Location1" },
          { lat: 60.3901, lng: 5.3345, name: "Location2" },
          { lat: 60.389, lng: 5.3315, name: "Location3" },
          { lat: 60.3887, lng: 5.3332, name: "Location4" },
          { lat: 60.389, lng: 6.335, name: "Location5" },
          // Her skal json inn
     ];

     // This adds marker to main map
     addMarkers(coordinates, map2);

     //!!!!!!!!!!!!!!!! Main map ends here !!!!!!!!!!!!!!!!!!!

     //!!!!!!!!!!!!!!!! modal map starts here !!!!!!!!!!!!!!!!!!!

     // This is modal map
     const map1 = new google.maps.Map(
          document.getElementById("delivery2-modal-map"),
          mapOptions
     );

     const directionsService = new google.maps.DirectionsService();
     const directionsRenderer = new google.maps.DirectionsRenderer({
          suppressMarkers: true, // This will remove default A and B markers
     });
     directionsRenderer.setMap(map1);

     // Denne er default og kan taes bort
     // const destination = { lat: 60.366043, lng: 5.345529, name: "Destination" };

     if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
               (position) => {
                    const userLocation = {
                         lat: position.coords.latitude,
                         lng: position.coords.longitude,
                         name: "My location:",
                    };
                    console.log("FROM:", userLocation);

                    calculateAndDisplayRoute(
                         directionsService,
                         directionsRenderer,
                         userLocation,
                         coordinates[4], // Pass the desired destination from the coordinates array
                         map1
                    );
                    console.log("TO", destination);
               },
               () => {
                    console.log("Error: The Geolocation service failed.");
               }
          );
     } else {
          console.log("Error: Your browser doesn't support geolocation.");
     }
}

// !!!!
async function getAddressFromLatLng(lat, lng) {
     const geocoder = new google.maps.Geocoder();
     const location = new google.maps.LatLng(lat, lng);

     return new Promise((resolve, reject) => {
          geocoder.geocode({ location }, (results, status) => {
               if (status === google.maps.GeocoderStatus.OK && results[0]) {
                    const addressComponents = results[0].address_components;
                    const street = addressComponents.find((component) =>
                         component.types.includes("route")
                    );
                    const city = addressComponents.find((component) =>
                         component.types.includes("locality")
                    );

                    resolve({
                         street: street ? street.long_name : "",
                         city: city ? city.long_name : "",
                    });
               } else {
                    reject(
                         new Error(
                              "Geocode was not successful for the following reason: " +
                                   status
                         )
                    );
               }
          });
     });
}

// !!!!

// Here starts map tracking for the modal
function calculateAndDisplayRoute(
     directionsService,
     directionsRenderer,
     origin,
     destination,
     map
) {
     const originIcon = "images/Deliveryman, rounded.png";

     directionsService.route(
          {
               origin: origin,
               destination: destination,
               travelMode: google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
               if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(response);

                    // Custom markers for origin and destination
                    addMarkerWithInfoWindow(origin, map, originIcon);
                    addMarkerWithInfoWindow(destination, map);
               } else {
                    console.log(
                         "Error: Directions request failed due to " + status
                    );
               }
          }
     );
}

// Marker naming starts here
function addMarkerWithInfoWindow(coordinate, map, customIcon) {
     const marker = new google.maps.Marker({
          position: { lat: coordinate.lat, lng: coordinate.lng },
          map: map,
          title: coordinate.name,
          icon: {
               url: customIcon,
               scaledSize: new google.maps.Size(40, 40),
          },
     });

     const infoWindowContent = `
       <div class="custom-infowindow">
         ${coordinate.name}
       </div>
     `;

     const infoWindow = new google.maps.InfoWindow({
          content: infoWindowContent,
     });

     marker.addListener("click", () => {
          infoWindow.open(map, marker);
     });
}

function addMarkers(coordinates, map) {
     coordinates.forEach((coordinate) => {
          const marker = new google.maps.Marker({
               position: { lat: coordinate.lat, lng: coordinate.lng },
               map: map,
               title: coordinate.name,
          });
          // This warps the pupupwindow in a div, so that i can style it in css.
          const infoWindowContent = `
         <div class="custom-infowindow">
           ${coordinate.name}
         </div>
       `;

          const infoWindow = new google.maps.InfoWindow({
               content: infoWindowContent,
          });

          marker.addListener("click", () => {
               infoWindow.open(map, marker);
          });
     });
}

// Marker naming ends here

//!!!!!!!!!!!!!!!! modal map ends here !!!!!!!!!!!!!!!!!!!

// Dropdown list for delaytime start here:
function updateSelectedDelay(selectedItem) {
     // Get the delay hours from the data attribute of the selected item
     const delayHours = parseInt(selectedItem.getAttribute("data-delay-hours"));

     // Find the span element with the id "delivery2-modal-delay-selected"
     const targetSpan = document.getElementById(
          "delivery2-modal-delay-selected"
     );

     const iconSpan = document.getElementById("iconSpan");
     iconSpan.textContent = "priority_high";
     const formCheckInputDelay = document.querySelector(
          ".form-check-input-delay"
     );
     formCheckInputDelay.classList.add("form-check-input-delay-red");

     // Get the current value in the span
     const currentValue = parseInt(targetSpan.textContent) || 0;

     // Add the delay hours to the current value
     const newValue = currentValue + delayHours;

     // Update the span's content with the new value
     targetSpan.textContent = newValue + " Hours";

     // Find the span element with the id "delivery2-modal-delayed-lastUpdate"
     const lastUpdateSpan = document.getElementById(
          "delivery2-modal-delayed-lastUpdate"
     );

     // Get the current date and time
     const now = new Date();

     // Format the date and time
     const formattedDateTime = now.toLocaleString();

     // Update the lastUpdateSpan's content with the formatted date and time
     lastUpdateSpan.textContent = formattedDateTime;
}

// Move the event listener outside the function
const dropdownMenu = document.getElementById("dropdownMenu");
dropdownMenu.addEventListener("click", function (event) {
     const selectedItem = event.target;
     if (selectedItem.classList.contains("dropdown-item")) {
          updateSelectedDelay(selectedItem);
     }
});

// Dropdown list for delaytime ends here:

// General time update for chekboxes starts here
function updateLastCheckedTime(checkbox, spanId) {
     checkbox.addEventListener("change", function () {
          if (checkbox.checked) {
               const now = new Date();
               const formattedDateTime = now.toLocaleString();
               const targetSpan = document.getElementById(spanId);
               targetSpan.textContent = formattedDateTime;
          }
     });
}

const checkboxes = document.getElementsByClassName("form-check-input");

updateLastCheckedTime(checkboxes[0], "delivery2-modal-pickedUp-lastUpdate");
updateLastCheckedTime(checkboxes[1], "delivery2-modal-onRoute-lastUpdate");
updateLastCheckedTime(checkboxes[2], "delivery2-modal-arrived-lastUpdate");
updateLastCheckedTime(checkboxes[3], "delivery2-modal-confirmed-lastUpdate");

// General time update for chekboxes ends here
