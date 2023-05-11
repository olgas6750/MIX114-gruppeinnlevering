document.addEventListener("DOMContentLoaded", function () {
     const acceptButton = document.getElementById("delivery1-acceptButton");
     const declineButton = document.getElementById("delivery1-declineButton");
     const indicationDecline = document.getElementById(
          "delivery1-indicationDecline"
     );
     const indicationAccept = document.getElementById(
          "delivery1-indicationAccept"
     );

     // Function to fetch data
     // Function to fetch data
     async function fetchData() {
          try {
               const response = await fetch(
                    "https://api.npoint.io/1a82a1d24a67d58b1354"
               );
               const data = await response.json();
               console.log(data); // Check your fetched data structure

               // Create buttons for each order
               for (let index = 0; index < data.orders.length; index++) {
                    const order = data.orders[index];

                    console.log("troubleshooting", order);
                    const categories = order.packages.map(
                         (package) => package.category
                    );

                    const distance = await calculateDrivingDistance(
                         order.sender.lat,
                         order.sender.lng,
                         order.recipient.lat,
                         order.recipient.lng
                    );

                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.className = "btn delivery1-request-container";
                    btn.id = `delivery1-request-toggle-button-${index}`;
                    btn.setAttribute("data-bs-toggle", "button");
                    btn.setAttribute("aria-pressed", "false");

                    // Update the innerHTML with order-specific data
                    btn.innerHTML = `
                      <div class="delivery1-ReqAccDec-body" id="delivery1-requestButton-body-${index}">
                          <span class="delivery1-delivery-img">${categories.join(
                               ", "
                          )}</span>
                          <div class="delivery1-delivery-infotext">
                              <span id="delivery1-delivery-title-${index}">${
                         order.sender.name
                    }</span>
                              <h6>Pick-up:<span>${order.pickup_date}</span></h6>
                              <h6>Delivery distance:<span>${distance.toFixed(
                                   2
                              )} km</span></h6>
                              <h6>Order:<span>${order.order_number}</span></h6>
                          </div>
                          <div class="delivery1-indication-request" id="delivery1-indicationRequest-${index}">
                              <span class="material-icons delivery1-questionmark">question_mark</span>
                          </div>
                      </div>
                  `;

                    // Add click event listener to the button
                    btn.addEventListener("click", () => {
                         console.log(order);

                         if (
                              btn.classList.contains("active") ||
                              btn.getAttribute("aria-pressed") === "true"
                         ) {
                              // Run logic when the button is active or aria-pressed is true
                              console.log(
                                   "Button is active or aria-pressed is true"
                              );

                              // Append the new div into the parent element
                              const deliveryInfoContainer =
                                   document.createElement("div");
                              deliveryInfoContainer.className =
                                   "delivery1-order-info-body";
                              deliveryInfoContainer.innerHTML = `
    <div class="delivery1-order-info-columns">
        <div class="delivery1-order-column-general">
            <div class="delivery1-infobox-1">
                <div class="delivery1-infobox-1-2-element">
                    <h5>Order date:</h5>
                    <span>Javascript -></span>
                </div>
                <div class="delivery1-infobox-1-2-element">
                    <h5>Pick-up:</h5>
                    <span>Javascript -></span>
                </div>
                <div class="delivery1-infobox-1-2-element">
                    <h5>Comment:</h5>
                    <span>Javascript -></span>
                </div>
            </div>
            <div class="delivery1-infobox-2">
                <div class="delivery1-infobox-1-2-element">
                    <h5>Delivery:</h5>
                    <span>Javascript -></span>
                </div>
                <div class="delivery1-infobox-1-2-element">
                    <h5>Delivery address:</h5>
                    <span>Javascript -></span>
                </div>
                <div class="delivery1-infobox-1-2-element">
                    <h5>Order number:</h5>
                    <span>Tjødnali 34, 6856 Sogndal</span>
                </div>
            </div>
        </div>
        <div class="delivery1-order-column-items">
            <div class="delivery1-order-items-title">
                <h6>Items</h6>
                <h6 id="delivery1-item-title-Qty">Qty</h6>
                <h6>Weight</h6>
            </div>
            <div class="delivery1-items-OLlist">
                <ol>
                    <li class="delivery1-items-info">
                        <span>
                            <img src="./images/profilepicture.png" alt="picture of delivery item" />
                            <span>Name</span>
                        </span>
                        <span>10</span>
                        <span>10g</span>
                    </li>
                    <li class="delivery1-items-info">
                        <span>
                            <img src="./images/profilepicture.png" alt="picture of delivery item" />
                            <span>Name</span>
                        </span>
                        <span>10</span>
                        <span>10g</span>
                    </li>
                    <li class="delivery1-items-info">
                        <span>
                            <img src="./images/profilepicture.png" alt="picture of delivery item" />
                            <span>Name</span>
                        </span>
                        <span>10</span>
                        <span>10g</span>
                    </li>
                    <li class="delivery1-items-info">
                        <span>
                            <img src="./images/profilepicture.png" alt="picture of delivery item" />
                            <span>Name</span>
                        </span>
                        <span>10</span>
                        <span>10g</span>
                    </li>
                    <li class="delivery1-items-info">
                        <span>
                            <img src="./images/profilepicture.png" alt="picture of delivery item" />
                            <span>Name</span>
                        </span>
                        <span>10</span>
                        <span>10g</span>
                    </li>
                </ol>
            </div>
        </div>
    </div>
`;
                              const parentElement =
                                   document.getElementById("arnetest");
                              parentElement.appendChild(deliveryInfoContainer);

                              // Add your logic here
                         } else {
                              // Run logic when the button is not active or aria-pressed is false
                              console.log(
                                   "Button is not active or aria-pressed is false"
                              );
                              // Add your logic here
                         }
                    });

                    // Add event listener to handle active button
                    btn.addEventListener("click", function () {
                         // Make sure only this button has the active class
                         document.querySelectorAll(".btn").forEach((button) => {
                              button.classList.remove("active");
                              button.setAttribute("aria-pressed", "false");
                         });
                         btn.classList.add("active");
                         btn.setAttribute("aria-pressed", "true");
                    });

                    // Append the button to the container
                    document
                         .getElementById("delivery1-button-container")
                         .appendChild(btn);
               }
          } catch (error) {
               console.error("Error fetching API data:", error);
          }
     }

     fetchData();

     // Function to calculate distance
     // Function to calculate driving distance
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

     // Add event listeners to the accept and decline buttons
     acceptButton.addEventListener("click", function (event) {
          // Handle the click event for the active button
          const activeButton = document.querySelector(".btn.active");
          if (
               activeButton &&
               activeButton.classList.contains("delivery1-request-container")
          ) {
               console.log("Accept button clicked");
               activeButton.classList.remove("delivery1-request-container");
               activeButton.classList.add("delivery1-accepted-container");

               const indicationRequest = activeButton.querySelector(
                    ".delivery1-indication-request"
               );
               if (indicationRequest) {
                    indicationRequest.classList.remove(
                         "delivery1-indication-request"
                    );
                    indicationRequest.classList.add(
                         "delivery1-indication-accept"
                    );
                    indicationRequest.innerHTML = indicationAccept.innerHTML;
               }
          } else {
               console.log("Request button is not active");
          }
     });

     declineButton.addEventListener("click", function (event) {
          // Handle the click event for the active button
          const activeButton = document.querySelector(".btn.active");
          if (
               activeButton &&
               activeButton.classList.contains("delivery1-request-container")
          ) {
               console.log("Decline button clicked");
               activeButton.classList.remove("delivery1-request-container");
               activeButton.classList.add("delivery1-declined-container");

               const indicationRequest = activeButton.querySelector(
                    ".delivery1-indication-request"
               );
               if (indicationRequest) {
                    indicationRequest.classList.remove(
                         "delivery1-indication-request"
                    );
                    indicationRequest.classList.add(
                         "delivery1-indication-decline"
                    );
                    indicationRequest.innerHTML = indicationDecline.innerHTML;
               }
          } else {
               console.log("Request button is not active");
          }
     });
});
