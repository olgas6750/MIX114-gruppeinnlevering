let userLocation = null;

// Global function for storing location.
// I tried implementing this at the end to replace each indicidual geolocation call, but this demanded to much code change, so there
// are still other individual calls. I think this is the potential for most improvement in the code structure.
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

// Map2 is for the main page
// Map1 is for the modal
let map2;
let map1;
// Google maps is launched and under initMap comes all added functinality to the map
async function initMap() {
     const mapOptions = {
          center: { lat: 60.389181, lng: 5.333219 },
          zoom: 14,
     };

     map2 = new google.maps.Map(
          document.getElementById("delivery2-main-map"),
          mapOptions
     );

     // Picture for current position
     originIcon = "images/Deliveryman, rounded.png";

     if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
               async (position) => {
                    const pos = {
                         lat: position.coords.latitude,
                         lng: position.coords.longitude,
                    };

                    // Adds new pin for current position
                    const marker = new google.maps.Marker({
                         map: map2,
                         position: pos,
                         icon: {
                              url: originIcon,
                              scaledSize: new google.maps.Size(50, 50),
                         },
                    });

                    //   Calling the translation from coordinates to human readable aderess.
                    const address = await geocodeLatLng(
                         position.coords.latitude,
                         position.coords.longitude
                    );
                    document.querySelector(
                         "#delivery2-JS-insert-myLocation"
                    ).textContent = address;

                    // The popup window above the marker is created and adress (translate coordinates) populates it.
                    const infoWindow = new google.maps.InfoWindow({
                         content: `<div class="custom-infowindow">
                             <span>Your position:</br></br>${address}</span>
                         </div>`,
                    });

                    marker.addListener("mouseover", () => {
                         infoWindow.open(map2, marker);
                    });

                    marker.addListener("mouseout", () => {
                         infoWindow.close();
                    });

                    // Set the center of the map to the users current location
                    map2.setCenter(pos);
               },
               () => {
                    handleLocationError(true, map2);
               }
          );
     } else {
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

// This function takes the data object (which is the result of fetching your JSON data) as an argument.
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

let markers = [];

// The fetchData function now does the following:
// Fetches data from API.
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
               // Buttons are created, populated and inserted thorugh this for-loop.
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

          let map1;

          //|||||||||||||||||||||| Here starts inilazation of modal content|||||||||||||||||||||||||||||||
          // This section had to be included later on, because of running issues related to bootstrap modal, google maps api and general JS.
          // The section only rund the JS it contains when the modal is "shown". Troubleshooting and implementation of the section done with the
          // help of ChatGPT.
          $("#exampleModalCenter").on("shown.bs.modal", function () {
               if (!map1) {
                    map1 = new google.maps.Map(
                         document.getElementById("delivery2-modal-map"),
                         mapOptions
                    );

                    google.maps.event.trigger(map1, "resize");
                    map1.setCenter(mapOptions.center);
               }

               const order = data.orders.find(
                    (order) => order.order_number === currentOrderNumber
               );

               // This adds event listeners to checkboxes inside the modal
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

               // Here starts bootstrap Dropdown button for selecting delaytime
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

                                   // Here the chosen time is appended to the span
                                   const currentDelayHours = delaySpan.innerText
                                        ? parseInt(delaySpan.innerText)
                                        : 0;
                                   const totalDelayHours =
                                        currentDelayHours +
                                        parseInt(delayHours);
                                   delaySpan.innerText =
                                        totalDelayHours + " Hours";

                                   // This changes the class to 'form-check-input-delay-red'
                                   delayContainer.classList.remove(
                                        "form-check-input-delay"
                                   );
                                   delayContainer.classList.add(
                                        "form-check-input-delay-red"
                                   );

                                   // Time and date added to the span
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
                                   // This changes the google icon for delaytime
                                   document.getElementById(
                                        "iconSpan"
                                   ).innerText = "priority_high";
                              }
                         );
                    });

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

                    // Resets time display
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

                    // Resets dropdown selection
                    const delaySpan = document.getElementById(
                         "delivery2-modal-delay-selected"
                    );
                    delaySpan.innerText = "";

                    // Resets Delay container class
                    const delayContainer = document.querySelector(
                         ".form-check-input-delay-red"
                    );
                    if (delayContainer) {
                         delayContainer.classList.remove(
                              "form-check-input-delay-red"
                         );
                         delayContainer.classList.add("form-check-input-delay");
                    }

                    // Resets the last update time for delay
                    document.getElementById(
                         "delivery2-modal-delayed-lastUpdate"
                    ).innerText = "";

                    // Resets the icon in the span with id "iconSpan"
                    document.getElementById("iconSpan").innerText = "check";
                    //||||||||||||||||||||| Here stops reset of modal when hidden||||||||||||||||||||||||
               });

               if (!order) {
                    console.error(
                         `Could not find order with number ${currentOrderNumber}`
                    );
                    return;
               }

               // Adds markers to map1, corrosponding with the chosen order.
               addMarkersToMap1(order, map1);

               // Adds current position marker
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
                    console.log("Geolocation is not supported.");
               }
          });
     } catch (error) {
          console.error("Error fetching API data:", error);
     }
}

// Global variable to store the current open infoWindow
let currentInfoWindow = null;

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

          var directionsService = new google.maps.DirectionsService();
          var directionsRenderer = new google.maps.DirectionsRenderer();

          marker.addListener("mouseover", () => {
               if (currentInfoWindow) {
                    currentInfoWindow.close();
               }

               infoWindow.open(map2, marker);
               currentInfoWindow = infoWindow;

               // Checks if userLocation is already set
               if (userLocation) {
                    // Sets the map
                    directionsRenderer.setMap(map2);

                    // Sets the directions
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

          marker.addListener("mouseout", () => {
               infoWindow.close();

               // Removes the directions from the map
               directionsRenderer.setMap(null);
          });
     });
}

let markerMap1 = [];
let directionsRenderer = null;

function addMarkersToMap1(order, map) {
     // This clears out old markers
     for (let marker of markerMap1) {
          marker.setMap(null);
     }

     // Resetting of the markers array
     markerMap1 = [];

     if (directionsRenderer == null) {
          directionsRenderer = new google.maps.DirectionsRenderer({
               suppressMarkers: true,
          });
     } else {
          // This clears out the old route
          directionsRenderer.setMap(null);
          directionsRenderer.setPanel(null);
          directionsRenderer = new google.maps.DirectionsRenderer({
               suppressMarkers: true,
          });
     }

     // Popup window for sender
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

     // Popup window for recipient
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

     // This adds new markers to markerMap1 array
     markerMap1.push(senderMarker, recipientMarker);

     // This gets the current position and display the fastestroute
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
          handleLocationError(false, map);
     }
}

// This function calculates the driving distance which is added to the inserted HTML
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
                              1000;
                         resolve(distance);
                    } else {
                         reject("Error calculating distance");
                    }
               }
          );
     });
}

// This function creates the route dispaly on map1
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

// Assigns pictures to names
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

          default:
               return "./images/profilepicture.png";
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
               return "./images/profilepicture.png";
     }
}
