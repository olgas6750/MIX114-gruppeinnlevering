// ||||||||||||HERE STARTS UPDATED DELIVER 2||||||||||||||||||||
let map2;
let map1;

async function initMap() {
     const mapOptions = {
          center: { lat: 60.389181, lng: 5.333219 },
          zoom: 14,
     };

     // adding sender's location

     map2 = new google.maps.Map(
          document.getElementById("delivery2-main-map"),
          mapOptions
     );

     originIcon = "images/Deliveryman, rounded.png";

     if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
               async (position) => {
                    const pos = {
                         lat: position.coords.latitude,
                         lng: position.coords.longitude,
                    };

                    // Create a new marker and set its position to the user's current location
                    new google.maps.Marker({
                         map: map2,
                         position: pos,
                         icon: {
                              url: originIcon, // Use custom icon for this marker
                              scaledSize: new google.maps.Size(50, 50), // This will scale your custom icon
                         },
                    });

                    // Set the center of the map to the user's current location
                    map2.setCenter(pos);

                    // Get the human-readable address and insert it into the span
                    const address = await geocodeLatLng(
                         position.coords.latitude,
                         position.coords.longitude
                    );
                    document.querySelector(
                         "#delivery2-JS-insert-myLocation"
                    ).textContent = address;
               },
               () => {
                    handleLocationError(true, map2);
               }
          );
     } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, map2);
     }
}

initMap();
window.addEventListener("load", (event) => {
     fetchData();
});

// Here starts translation from coordinates to steet and city name
function geocodeLatLng(lat, lng) {
     const geocoder = new google.maps.Geocoder();
     const latlng = { lat: parseFloat(lat), lng: parseFloat(lng) };
     return new Promise((resolve, reject) => {
          geocoder.geocode({ location: latlng }, function (results, status) {
               if (status === "OK") {
                    if (results[0]) {
                         resolve(results[0].formatted_address);
                    } else {
                         reject("No results found");
                    }
               } else {
                    reject("Geocoder failed due to: " + status);
               }
          });
     });
}
// Here stops translation from coordinates to steet and city name

// his function takes the data object (which is the result of fetching your JSON data) as an argument.
// It loops through each order in the data, and for each order, it extracts the sender and recipient coordinates
// (latitude and longitude) and pushes them to an array coordinates. Finally, it returns the coordinates array.
function extractCoordinatesFromData(data) {
     const coordinates = [];
     for (let order of data.orders) {
          coordinates.push({
               lat: order.sender.lat,
               lng: order.sender.lng,
          });
          coordinates.push({
               lat: order.recipient.lat,
               lng: order.recipient.lng,
          });
     }
     return coordinates;
}

// This function takes the coordinates array and a map object as arguments.
// It loops through each coordinate in the coordinates array, and for each coordinate,
// it creates a new marker on the given map at the position specified by the coordinate.

let markers = [];

// The fetchData function now does the following:
// Fetches data from your API.
// Extracts coordinates from the data using extractCoordinatesFromData().
// Initializes map2.
// Adds markers to map2 for each coordinate using addMarkers().
// Loops through each order in the data, calculates the delivery distance for the order,
// and creates a button with the order's details. The button is then added to the HTML container.
async function fetchData() {
     try {
          const url = "https://api.npoint.io/1a82a1d24a67d58b1354";
          const response = await fetch(url);
          const data = await response.json();

          const coordinates = extractCoordinatesFromData(data);

          const mapOptions = {
               center: { lat: 60.389181, lng: 5.333219 },
               zoom: 14,
          };

          addMarkers(data.orders, map2);
          const container = document.querySelector(
               "#delivery2-colmnleft-JS-insert"
          );
          for (let order of data.orders) {
               const deliveryDistance = await calculateDrivingDistance(
                    order.sender.lat,
                    order.sender.lng,
                    order.recipient.lat,
                    order.recipient.lng
               ).catch((err) =>
                    console.error("Error in calculating distance:", err)
               );

               const buttonContent = `
  <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModalCenter" class="btn delivery1-accepted-container" data-order-number="${
       order.order_number
  }">
             <div class="delivery1-ReqAccDec-body">
               <span class="delivery1-delivery-img"><img src="${getOrderImage(
                    order
               )}" alt="Order image"/></span>
               <div class="delivery1-delivery-infotext">
                 <span class="infotext-title" id="delivery1-delivery-title">${
                      order.sender.name
                 }</span>
                 <div class="infotext-flex"><h6>Pick-up:</h6><span id="pickup-date-span">${
                      order.pickup_date
                 }</span></div>
                 <div class="infotext-flex"><h6>Delivery distance:</h6><span id="delivery-distance-span">${deliveryDistance.toFixed(
                      2
                 )} km</span></div>
                 <div class="infotext-flex"><h6>Order:</h6><span id="order-number-span">${
                      order.order_number
                 }</span></h6></div>
               </div>
               <div class="delivery1-indication-accept">
                 <span class="material-icons delivery1-check">check</span>
               </div>
             </div>
           </button>
         `;
               container.innerHTML += buttonContent;
               console.log(order);
          }

          const buttons = document.querySelectorAll(
               ".delivery1-accepted-container"
          );
          let currentOrderNumber;

          buttons.forEach((button) => {
               button.addEventListener("click", function () {
                    currentOrderNumber = this.getAttribute("data-order-number");
               });
          });

          // Setup event listener for modal's 'shown' event
          let map1;

          $("#exampleModalCenter").on("shown.bs.modal", function () {
               if (!map1) {
                    map1 = new google.maps.Map(
                         document.getElementById("delivery2-modal-map"),
                         mapOptions
                    );

                    // Trigger resize event and set center after initializing map1
                    google.maps.event.trigger(map1, "resize");
                    map1.setCenter(mapOptions.center);
               }

               // Find the corresponding order using currentOrderNumber
               const order = data.orders.find(
                    (order) => order.order_number === currentOrderNumber
               );

               if (!order) {
                    console.error(
                         `Could not find order with number ${currentOrderNumber}`
                    );
                    return;
               }

               // Call addMarkersToMap1() with the corresponding order
               addMarkersToMap1(order, map1);

               // Add current position marker
               if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                         async (position) => {
                              const currentPosition = {
                                   lat: position.coords.latitude,
                                   lng: position.coords.longitude,
                              };

                              new google.maps.Marker({
                                   position: currentPosition,
                                   map: map1,
                                   title: "Current Position",
                                   icon: {
                                        url: originIcon,
                                        scaledSize: new google.maps.Size(
                                             50,
                                             50
                                        ),
                                   },
                              });
                         }
                    );
               } else {
                    console.log(
                         "Geolocation is not supported by this browser."
                    );
               }
          });
     } catch (error) {
          console.error("Error fetching API data:", error);
     }
}

function addMarkers(orders, map2) {
     orders.forEach((order) => {
          const sender = order.sender;
          const marker = new google.maps.Marker({
               position: { lat: sender.lat, lng: sender.lng },
               map: map2,
               title: sender.name,
               icon: {
                    url: getOrderImage(order),
                    scaledSize: new google.maps.Size(40, 40),
               },
          });

          const infoWindowContent = `
         <div class="custom-infowindow">
             ${sender.name}
         </div>
         `;

          const infoWindow = new google.maps.InfoWindow({
               content: infoWindowContent,
          });

          marker.addListener("click", () => {
               infoWindow.open(map2, marker);
          });
     });
}

let directionsRenderer = null; // Declare it globally

function addMarkersToMap1(order, map) {
     // Clear out old markers
     for (let marker of markers) {
          marker.setMap(null);
     }
     markers = []; // Reset the markers array

     // Clear out the old route
     if (directionsRenderer != null) {
          directionsRenderer.setDirections({ routes: [] });
     }

     const senderMarker = new google.maps.Marker({
          position: { lat: order.sender.lat, lng: order.sender.lng },
          map: map,
          title: order.sender.name,
          icon: {
               url: getOrderImage(order),
               scaledSize: new google.maps.Size(40, 30),
          },
     });

     const recipientMarker = new google.maps.Marker({
          position: { lat: order.recipient.lat, lng: order.recipient.lng },
          map: map,
          title: order.recipient.name,
          icon: {
               url: getOrderImage(order),
               scaledSize: new google.maps.Size(40, 30),
          },
     });

     // Add new markers to markers array
     markers.push(senderMarker, recipientMarker);

     // Get current position and display route
     if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
               (position) => {
                    const currentPosition = {
                         lat: position.coords.latitude,
                         lng: position.coords.longitude,
                    };

                    const directionsService =
                         new google.maps.DirectionsService();
                    directionsRenderer = new google.maps.DirectionsRenderer(); // assign to the global variable
                    directionsRenderer.setMap(map);

                    calculateAndDisplayRoute(
                         directionsService,
                         directionsRenderer,
                         currentPosition,
                         { lat: order.sender.lat, lng: order.sender.lng },
                         { lat: order.recipient.lat, lng: order.recipient.lng }
                    );
               },
               () => {
                    handleLocationError(true, map);
               }
          );
     } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, map);
     }
}

// Function to calculate driving distance starts here
async function calculateDrivingDistance(lat1, lng1, lat2, lng2) {
     return new Promise((resolve, reject) => {
          let service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix(
               {
                    origins: [new google.maps.LatLng(lat1, lng1)],
                    destinations: [new google.maps.LatLng(lat2, lng2)],
                    travelMode: google.maps.TravelMode.DRIVING,
               },
               (response, status) => {
                    if (status == google.maps.DistanceMatrixStatus.OK) {
                         const distance =
                              response.rows[0].elements[0].distance.value /
                              1000; // Distance in km
                         resolve(distance);
                    } else {
                         reject("Error calculating distance");
                    }
               }
          );
     });
}

function calculateAndDisplayRoute(
     directionsService,
     directionsRenderer,
     origin,
     destination,
     map
) {
     // const originIcon = "images/Deliveryman, rounded.png";

     directionsService.route(
          {
               origin: origin,
               destination: destination,
               waypoints: [
                    { location: origin, stopover: false },
                    { location: destination, stopover: true },
               ],
               optimizeWaypoints: true,
               travelMode: google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
               if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(response);

                    // Custom markers for origin, sender, and recipient
                    const route = response.routes[0];
                    const leg1 = route.legs[0];
                    const leg2 = route.legs[1];

                    addMarkerWithInfoWindow(origin, map, originIcon);
                    addMarkerWithInfoWindow(
                         leg1.start_location,
                         map,
                         "Sender Marker"
                    );
                    addMarkerWithInfoWindow(
                         leg2.end_location,
                         map,
                         "Recipient Marker"
                    );
               } else {
                    console.log(
                         "Error: Directions request failed due to " + status
                    );
               }
          }
     );
}

function getOrderImage(order) {
     switch (order.sender.name) {
          case "Oliver Hansen":
               return "./images/biome.png";
          case "Sophia Andersen":
               return "./images/Birdgate.png";
          case "William Pedersen":
               return "./images/Levita.png";
          case "Mia Sørensen":
               return "./images/Sport Norway.png";
          case "Lars Nilsen":
               return "./images/Stranded.png";
          case "Sofie Jensen":
               return "./images/Yellow cat.png";
          // add more cases as needed...
          default:
               return "./images/profilepicture.png"; // default image
     }
}
// Function to calculate driving distance ends here

// This DMOContentLodaed will run the functions after the HTML is finished loading

//||||||||||||||here starts google maps functionality|||||||||||||||||||

// ||||||||HERE STARTS MODAL DELAY

// |||||||HERE STOPS MODAL DELAY

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
