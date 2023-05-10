async function initMap() {
     const mapOptions = {
          center: { lat: 60.389181, lng: 5.333219 },
          zoom: 14,
     };

     const map2 = new google.maps.Map(
          document.getElementById("delivery2-main-map"),
          mapOptions
     );

     async function fetchData() {
          try {
               const response = await fetch(
                    "https://api.npoint.io/1a82a1d24a67d58b1354"
               );
               const data = await response.json();
               const coordinates = extractCoordinatesFromData(data);

               // Add markers to the main map
               addMarkers(coordinates, map2);

               // Parse JSON data
               const orders = data.orders;
               const firstOrder = orders[0];

               // Chat-GPT used to provide av formula (Haversine formula) for calulating the distance between sender and recipicant.
               function calculateDistance(lat1, lon1, lat2, lon2) {
                    const R = 6371; // Radius of the earth in km
                    const dLat = deg2rad(lat2 - lat1);
                    const dLon = deg2rad(lon2 - lon1);
                    const a =
                         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                         Math.cos(deg2rad(lat1)) *
                              Math.cos(deg2rad(lat2)) *
                              Math.sin(dLon / 2) *
                              Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return R * c; // Distance in km
               }

               function deg2rad(deg) {
                    return deg * (Math.PI / 180);
               }

               // Extract data from the first order
               const category = firstOrder.packages[0].category;
               const name = firstOrder.sender.name;
               const pickupDate = firstOrder.pickup_date;
               const senderLat = firstOrder.sender.lat;
               const senderLng = firstOrder.sender.lng;
               const recipientLat = firstOrder.recipient.lat;
               const recipientLng = firstOrder.recipient.lng;
               const deliveryDistance = calculateDistance(
                    senderLat,
                    senderLng,
                    recipientLat,
                    recipientLng
               );
               const orderNumber = firstOrder.order_number;

               // Insert data into HTML
               document.getElementById("category-span").innerText = category;
               document.getElementById("delivery1-delivery-title").innerText =
                    name;
               document.getElementById("pickup-date-span").innerText =
                    pickupDate;
               document.getElementById("delivery-distance-span").innerText =
                    deliveryDistance.toFixed(2) + " km";
               document.getElementById("order-number-span").innerText =
                    orderNumber;
          } catch (error) {
               console.error("Error fetching API data:", error);
          }
     }

     // Call fetchData function to update the HTML elements
     fetchData();

     // Remaining code of initMap() function
     const map1 = new google.maps.Map(
          document.getElementById("delivery2-modal-map"),
          mapOptions
     );

     const directionsService = new google.maps.DirectionsService();
     const directionsRenderer = new google.maps.DirectionsRenderer({
          suppressMarkers: true, // This will remove default A and B markers
     });
     directionsRenderer.setMap(map1);

     if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
               async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    const address = await getAddressFromLatLng(lat, lng);

                    const userLocation = {
                         lat: lat,
                         lng: lng,
                         name: `My location:<br>${address.street} <br> ${address.postalCode}, ${address.city} <br> ${address.country}`,
                    };

                    console.log("FROM:", userLocation);

                    calculateAndDisplayRoute(
                         directionsService,
                         directionsRenderer,
                         userLocation,
                         coordinates[0],
                         map1
                    );
               },
               () => {
                    console.log("Error: The Geolocation service failed.");
               }
          );
     } else {
          console.log("Error: Your browser doesn't support geolocation.");
     }
}

async function fetchData() {
     try {
          const response = await fetch(
               "https://api.npoint.io/1a82a1d24a67d58b1354"
          );
          const data = await response.json();
          const coordinates = extractCoordinatesFromData(data);

          // Add markers to the main map
          addMarkers(coordinates, map2);

          // Parse JSON data
          const orders = data.orders;
          const firstOrder = orders[0];

          // ... the rest of the code that updates the HTML elements
     } catch (error) {
          console.error("Error fetching API data:", error);
     }
}

fetchData(); // Call the fetchData function

// JSON fetch of coordinates start
function extractCoordinatesFromData(data) {
     const senderCoords = data.orders.map((order) => {
          return {
               lat: order.sender.lat,
               lng: order.sender.lng,
               name: order.sender.name,
          };
     });

     const recipientCoords = data.orders.map((order) => {
          return {
               lat: order.recipient.lat,
               lng: order.recipient.lng,
               name: order.recipient.name,
          };
     });

     return senderCoords.concat(recipientCoords);
}
// JSON fetch of coordinates stop here.

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
                    const postalCode = addressComponents.find((component) =>
                         component.types.includes("postal_code")
                    );
                    const country = addressComponents.find((component) =>
                         component.types.includes("country")
                    );

                    resolve({
                         street: street ? street.long_name : "",
                         city: city ? city.long_name : "",
                         postalCode: postalCode ? postalCode.long_name : "",
                         country: country ? country.long_name : "",
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
               scaledSize: new google.maps.Size(50, 50),
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

// |||||||||||||||||| HERE STARTS THE DELIVERY 2, ACCEPTED DELIVERYES JSON BUILD |||

// |||||||||||||||||| HERE ENDS THE DELIVERY 2, ACCEPTED DELIVERYES JSON BUILD |||
