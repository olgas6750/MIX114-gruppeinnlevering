// ||||||||||||HERE STARTS UPDATED DELIVER 2||||||||||||||||||||
let userLocation = null;

// Call this function once to get and store the user's location
function getUserLocation() {
     return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
               (position) => {
                    userLocation = {
                         lat: position.coords.latitude,
                         lng: position.coords.longitude,
                    };
                    resolve(userLocation);
               },
               (error) => {
                    reject(error);
               }
          );
     });
}

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
                    const marker = new google.maps.Marker({
                         map: map2,
                         position: pos,
                         icon: {
                              url: originIcon, // Use custom icon for this marker
                              scaledSize: new google.maps.Size(50, 50), // This will scale your custom icon
                         },
                    });

                    // Get the human-readable address and insert it into the span
                    const address = await geocodeLatLng(
                         position.coords.latitude,
                         position.coords.longitude
                    );
                    document.querySelector(
                         "#delivery2-JS-insert-myLocation"
                    ).textContent = address;

                    // Create an info window for the marker
                    const infoWindow = new google.maps.InfoWindow({
                         content: `<div class="custom-infowindow">
                             <span>Your position:</br></br>${address}</span>
                         </div>`,
                    });
                    // Add a mouseover listener to the marker
                    marker.addListener("mouseover", () => {
                         infoWindow.open(map2, marker);
                    });

                    // Add a mouseout listener to the marker
                    marker.addListener("mouseout", () => {
                         infoWindow.close();
                    });

                    // Set the center of the map to the user's current location
                    map2.setCenter(pos);
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

          //|||||||||||||||||||||| Here starts inilazation of modal content|||||||||||||||||||||||||||||||
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

               // Add event listeners to checkboxes
               document
                    .getElementById("pickedUpCheckbox")
                    .addEventListener("change", function () {
                         if (this.checked) {
                              const currentTime = new Date();
                              const formattedTime =
                                   currentTime.toLocaleString();
                              document.getElementById(
                                   "delivery2-modal-pickedUp-lastUpdate"
                              ).innerText = formattedTime;
                         }
                    });

               document
                    .getElementById("onRouteCheckbox")
                    .addEventListener("change", function () {
                         if (this.checked) {
                              const currentTime = new Date();
                              const formattedTime =
                                   currentTime.toLocaleString();
                              document.getElementById(
                                   "delivery2-modal-onRoute-lastUpdate"
                              ).innerText = formattedTime;
                         }
                    });

               document
                    .getElementById("arrivedCheckbox")
                    .addEventListener("change", function () {
                         if (this.checked) {
                              const currentTime = new Date();
                              const formattedTime =
                                   currentTime.toLocaleString();
                              document.getElementById(
                                   "delivery2-modal-arrived-lastUpdate"
                              ).innerText = formattedTime;
                         }
                    });

               document
                    .getElementById("confirmedCheckbox")
                    .addEventListener("change", function () {
                         if (this.checked) {
                              const currentTime = new Date();
                              const formattedTime =
                                   currentTime.toLocaleString();
                              document.getElementById(
                                   "delivery2-modal-confirmed-lastUpdate"
                              ).innerText = formattedTime;
                         }
                    });

               // Here starts bootstrap Dropdown item selection event
               document
                    .querySelectorAll(".dropdown-item")
                    .forEach(function (dropdownItem) {
                         dropdownItem.addEventListener(
                              "click",
                              function (event) {
                                   const delayHours =
                                        this.getAttribute("data-delay-hours");
                                   const delaySpan = document.getElementById(
                                        "delivery2-modal-delay-selected"
                                   );
                                   const delayContainer =
                                        document.querySelector(
                                             ".form-check-input-delay"
                                        );
                                   const lastUpdateSpan =
                                        document.getElementById(
                                             "delivery2-modal-delayed-lastUpdate"
                                        );

                                   // 1. Append the chosen time to the span
                                   const currentDelayHours = delaySpan.innerText
                                        ? parseInt(delaySpan.innerText)
                                        : 0;
                                   const totalDelayHours =
                                        currentDelayHours +
                                        parseInt(delayHours);
                                   delaySpan.innerText =
                                        totalDelayHours + " Hours";

                                   // 2. Change the class to 'form-check-input-delay-red'
                                   delayContainer.classList.remove(
                                        "form-check-input-delay"
                                   );
                                   delayContainer.classList.add(
                                        "form-check-input-delay-red"
                                   );

                                   // 3. Append time and date to the span
                                   const currentTime = new Date();
                                   const formattedTime =
                                        currentTime.toDateString() +
                                        " " +
                                        currentTime.getHours() +
                                        ":" +
                                        currentTime.getMinutes() +
                                        ":" +
                                        currentTime.getSeconds();
                                   lastUpdateSpan.innerText = formattedTime;
                                   // 4. Change the icon in the span with id "iconSpan"
                                   document.getElementById(
                                        "iconSpan"
                                   ).innerText = "priority_high";
                              }
                         );
                    });
               // Here stops bootstrap Dropdown item selection event

               // Inside the 'shown.bs.modal' event callback, after finding the corresponding order...

               // Here starts the populate modal with order.data
               document.getElementById("order-number").innerText =
                    order.order_number;
               document.getElementById("sender-name").innerText =
                    order.sender.name;
               document.getElementById("sender-address").innerText =
                    order.sender.address;
               document.getElementById("recipient-name").innerText =
                    order.recipient.name;
               document.getElementById("recipient-address").innerText =
                    order.recipient.address;
               document.getElementById("buyer-info").innerText = order.comment;
               document.getElementById("estimated-delivery").innerText =
                    order.delivery_date;
               // Here ends the populate modal with order.data
               //|||||||||||||||||||||| Here ends inilazation of modal content|||||||||||||||||||||||||||||||

               //|||||||||||||||||||||| Here starts reset of modal when hidden|||||||||||||||||||||||||||||||
               $("#exampleModalCenter").on("hide.bs.modal", function () {
                    // Reset checkboxes
                    document.getElementById("pickedUpCheckbox").checked = false;
                    document.getElementById("onRouteCheckbox").checked = false;
                    document.getElementById("arrivedCheckbox").checked = false;
                    document.getElementById(
                         "confirmedCheckbox"
                    ).checked = false;

                    // Reset time display
                    document.getElementById(
                         "delivery2-modal-pickedUp-lastUpdate"
                    ).innerText = "";
                    document.getElementById(
                         "delivery2-modal-onRoute-lastUpdate"
                    ).innerText = "";
                    document.getElementById(
                         "delivery2-modal-arrived-lastUpdate"
                    ).innerText = "";
                    document.getElementById(
                         "delivery2-modal-confirmed-lastUpdate"
                    ).innerText = "";

                    // Reset dropdown selection
                    const delaySpan = document.getElementById(
                         "delivery2-modal-delay-selected"
                    );
                    delaySpan.innerText = "";

                    // Reset Delay container class
                    const delayContainer = document.querySelector(
                         ".form-check-input-delay-red"
                    );
                    if (delayContainer) {
                         delayContainer.classList.remove(
                              "form-check-input-delay-red"
                         );
                         delayContainer.classList.add("form-check-input-delay");
                    }

                    // Reset the last update time for delay
                    document.getElementById(
                         "delivery2-modal-delayed-lastUpdate"
                    ).innerText = "";

                    // Reset the icon in the span with id "iconSpan"
                    document.getElementById("iconSpan").innerText = "";
                    //|||||||||||||||||||||||||| Here stops reset of modal when hidden|||||||||||||||||||||||||||
               });

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

let currentInfoWindow = null; // Global variable to store the current open infoWindow

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
           SENDER:</br></br>${sender.name},</br> ${sender.address}, ${sender.postal_code}
           </div>
      `;

          const infoWindow = new google.maps.InfoWindow({
               content: infoWindowContent,
          });
          // Instantiate the Directions Service
          var directionsService = new google.maps.DirectionsService();
          var directionsRenderer = new google.maps.DirectionsRenderer();

          // Add to mouseover listener
          marker.addListener("mouseover", () => {
               if (currentInfoWindow) {
                    currentInfoWindow.close();
               }

               infoWindow.open(map2, marker);
               currentInfoWindow = infoWindow;

               // Check if userLocation is already set
               if (userLocation) {
                    // Set the map
                    directionsRenderer.setMap(map2);

                    // Set the directions
                    directionsService.route(
                         {
                              origin: userLocation,
                              destination: marker.position,
                              travelMode: "DRIVING",
                         },
                         function (response, status) {
                              if (status === "OK") {
                                   directionsRenderer.setDirections(response);
                              } else {
                                   console.log(
                                        "Directions request failed due to " +
                                             status
                                   );
                              }
                         }
                    );
               } else {
                    console.error("User location not yet set");
               }
          });

          // Add to mouseout listener
          marker.addListener("mouseout", () => {
               infoWindow.close();

               // Remove the directions from the map
               directionsRenderer.setMap(null);
          });
     });
}

let markerMap1 = []; // Declare markerMap1 array globally
let directionsRenderer = null; // Declare it globally

function addMarkersToMap1(order, map) {
     // Clear out old markers
     for (let marker of markerMap1) {
          marker.setMap(null);
     }
     markerMap1 = []; // Reset the markers array
     // Create the DirectionsRenderer if it doesn't exist yet
     if (directionsRenderer == null) {
          directionsRenderer = new google.maps.DirectionsRenderer({
               suppressMarkers: true,
          }); // Add this line
     } else {
          // Clear out the old route
          directionsRenderer.setMap(null);
          directionsRenderer.setPanel(null);
          directionsRenderer = new google.maps.DirectionsRenderer({
               suppressMarkers: true,
          }); // Add this line
     }

     const senderInfoWindowContent = `
               <div class="custom-infowindow">
               SENDER:</br></br>${order.sender.name},</br> ${order.sender.address}, ${order.sender.postal_code}
               </div>
          `;

     const senderInfoWindow = new google.maps.InfoWindow({
          content: senderInfoWindowContent,
     });

     const senderMarker = new google.maps.Marker({
          position: { lat: order.sender.lat, lng: order.sender.lng },
          map: map,
          title: order.sender.name,
          icon: {
               url: getOrderImage(order),
               scaledSize: new google.maps.Size(40, 30),
          },
     });

     senderMarker.addListener("mouseover", () => {
          senderInfoWindow.open(map, senderMarker);
     });

     senderMarker.addListener("mouseout", () => {
          senderInfoWindow.close();
     });

     const recipientInfoWindowContent = `
               <div class="custom-infowindow">
               RECIPIENT:</br></br>${order.recipient.name},</br> ${order.recipient.address}, ${order.recipient.postal_code},</br></br> ${order.comment}
               </div>
          `;

     const recipientInfoWindow = new google.maps.InfoWindow({
          content: recipientInfoWindowContent,
     });

     const recipientMarker = new google.maps.Marker({
          position: { lat: order.recipient.lat, lng: order.recipient.lng },
          map: map,
          title: order.recipient.name,
          icon: {
               url: getOrderImageRecipient(order),
               scaledSize: new google.maps.Size(40, 30),
          },
     });
     recipientMarker.addListener("mouseover", () => {
          recipientInfoWindow.open(map, recipientMarker);
     });

     recipientMarker.addListener("mouseout", () => {
          recipientInfoWindow.close();
     });

     // Add new markers to markerMap1 array
     markerMap1.push(senderMarker, recipientMarker);

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
                    directionsRenderer.setMap(map);

                    calculateAndDisplayRoute(
                         directionsService,
                         directionsRenderer,
                         currentPosition,
                         { lat: order.sender.lat, lng: order.sender.lng },
                         { lat: order.recipient.lat, lng: order.recipient.lng },
                         map
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

async function calculateAndDisplayRoute(
     directionsService,
     directionsRenderer,
     origin,
     waypoint,
     destination,
     map
) {
     directionsService.route(
          {
               origin: origin,
               destination: destination,
               waypoints: [{ location: waypoint }],
               travelMode: google.maps.TravelMode.DRIVING,
          },
          async (response, status) => {
               if (status === google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(response);
               } else {
                    console.log(
                         "Error: Directions request failed due to " + status
                    );
               }
          }
     );
}

// Then, when you call the function:
calculateAndDisplayRoute(
     directionsService,
     directionsRenderer,
     currentPosition, // Origin
     { lat: order.sender.lat, lng: order.sender.lng }, // Waypoint
     { lat: order.recipient.lat, lng: order.recipient.lng }, // Destination
     map
);

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

function getOrderImageRecipient(order) {
     switch (order.recipient.name) {
          case "Emma Johnson":
               return "./images/Person 1.png";
          case "Noah Olsen":
               return "./images/Person 2.png";
          case "Ava Larsen":
               return "./images/Person 1.png";
          case "Erik Johansen":
               return "./images/Person 4.png";
          case "Ingrid Solberg":
               return "./images/Person 1.png";
          case "Jonas Berg":
               return "./images/Person 6.png";
          default:
               return "./images/profilepicture.png"; // Default image for recipient
     }
}
