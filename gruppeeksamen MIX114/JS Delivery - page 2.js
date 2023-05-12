// ||||||||||||HERE STARTS UPDATED DELIVER 2||||||||||||||||||||

function getOrderImage(order) {
     switch (order.sender.name) {
          case "Oliver Hansen":
               return "./images/Deliveryman, rounded.png";
          case "Sophia Andersen":
               return "./images/Deliveryman, rounded.png";
          case "William Pedersen":
               return "./images/Deliveryman, rounded.png";
          case "Mia Sørensen":
               return "./images/Deliveryman, rounded.png";
          case "Lars Nilsen":
               return "./images/Deliveryman, rounded.png";
          case "Sofie Jensen":
               return "./images/Deliveryman, rounded.png";
          // add more cases as needed...
          default:
               return "./images/Deliveryman, rounded.png"; // default image
     }
}

async function fetchData() {
     const url = "https://api.npoint.io/1a82a1d24a67d58b1354";
     const response = await fetch(url);
     const data = await response.json();

     const container = document.querySelector("#delivery2-colmnleft-JS-insert");
     for (let order of data.orders) {
          const deliveryDistance = await calculateDrivingDistance(
               order.sender.lat,
               order.sender.lng,
               order.recipient.lat,
               order.recipient.lng
          );

          const buttonContent = `
         <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModalCenter" class="btn delivery1-accepted-container">
             <div class="delivery1-ReqAccDec-body">
                 <span class="delivery1-delivery-img"><img src="${getOrderImage(
                      order
                 )}" alt="Order image"/></span>
                 <div class="delivery1-delivery-infotext">
                     <span id="delivery1-delivery-title">${
                          order.recipient.name
                     }</span>
                     <h6>Pick-up:<span id="pickup-date-span">${
                          order.pickup_date
                     }</span></h6>
                     <h6>Delivery distance:<span id="delivery-distance-span">${deliveryDistance.toFixed(
                          2
                     )} km</span></h6>
                     <h6>Order:<span id="order-number-span">${
                          order.order_number
                     }</span></h6>
                 </div>
                 <div class="delivery1-indication-accept">
                     <span class="material-icons delivery1-check">check</span>
                 </div>
             </div>
         </button>
         `;

          container.innerHTML += buttonContent;
     }
}

fetchData();

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

// Function to calculate driving distance ends here

//||||||||||||||here starts google maps functionality|||||||||||||||||||
async function initMap() {
     const mapOptions = {
          center: { lat: 60.389181, lng: 5.333219 },
          zoom: 14,
     };

     const map2 = new google.maps.Map(
          document.getElementById("delivery2-main-map"),
          mapOptions
     );

     let map1;

     $("#exampleModalCenter").on("shown.bs.modal", function () {
          if (!map1) {
               // Initialize map1 only once
               map1 = new google.maps.Map(
                    document.getElementById("delivery2-modal-map"),
                    mapOptions
               );
          }
          // Trigger resize event
          google.maps.event.trigger(map1, "resize");
          // Re-center the map
          map1.setCenter(mapOptions.center);
     });

     // rest of the code...
}

document.addEventListener("DOMContentLoaded", function () {
     initMap();
     fetchData();
});
