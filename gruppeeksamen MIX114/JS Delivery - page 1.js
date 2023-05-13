document.addEventListener("DOMContentLoaded", function () {
     const acceptButton = document.getElementById("delivery1-acceptButton");
     const declineButton = document.getElementById("delivery1-declineButton");
     const indicationDecline = document.getElementById(
          "delivery1-indicationDecline"
     );
     const indicationAccept = document.getElementById(
          "delivery1-indicationAccept"
     );

     // Here starts picture selection corrosponding with category
     function getCategoryImage(category) {
          switch (category) {
               case "Food":
                    return "./images/food 1.png";
               case "Electronics":
                    return "./images/electronics 1.png";
               case "Books":
                    return "./images/books 1.png";
               case "Clothing":
                    return "./images/clothing 1.png";
               default:
                    return "./images/logo.png";
          }
     }
     // Here ends picture selection corrosponding with category

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
                      <span class="delivery1-delivery-img"><img src="${getOrderImage(
                           order
                      )}" alt="Sender image"/></span>
                          <div class="delivery1-delivery-infotext">
                              <span class="infotext-title" id="delivery1-delivery-title-${index}">${
                         order.sender.name
                    }</span>
                              <div class="infotext-flex"><h6>Pick-up:</h6><span>${
                                   order.pickup_date
                              }</span></div>
                              <div class="infotext-flex"><h6>Delivery distance:</h6><span>${distance.toFixed(
                                   2
                              )} km</span></div>
                              <div class="infotext-flex"><h6>Order:</h6><span>${
                                   order.order_number
                              }</span></div>
                          </div>
                          <div class="delivery1-indication-request" id="delivery1-indicationRequest-${index}">
                              <span class="material-icons delivery1-questionmark">question_mark</span>
                          </div>
                      </div>
                  `;

                    // Add click event listener to the button
                    btn.addEventListener("click", () => {
                         console.log(order);

                         // Get the parent element
                         const parentElement = document.getElementById(
                              "delivery1-JS-insert-informationsquare"
                         );

                         const parentElement2 = document.getElementById(
                              "delivery1-topbar-sendReci-JS-insert"
                         );

                         // Remove the existing detailed order info if it exists
                         if (parentElement.lastElementChild) {
                              parentElement.lastElementChild.remove();
                         }

                         // Remove the existing sender and recipient info if it exists
                         if (parentElement2.lastElementChild) {
                              parentElement2.lastElementChild.remove();
                         }

                         if (
                              btn.classList.contains("active") ||
                              btn.getAttribute("aria-pressed") === "true"
                         ) {
                              // Run logic when the button is active or aria-pressed is true
                              console.log(
                                   "Button is active or aria-pressed is true"
                              );

                              // Generate the items HTML
                              let packagesHTML = "";
                              for (let package of order.packages) {
                                   const imgSrc = getCategoryImage(
                                        package.category
                                   );
                                   packagesHTML += `
        <li class="delivery1-items-info">
            <span>
                <img src="${imgSrc}" alt="picture of ${package.category}" />
                <span>${package.category}</span>
            </span>
            <span>${package.volume}</span>
            <span>${package.weight}</span>
        </li>
    `;
                              }

                              // Create a new div to hold the detailed order information
                              const deliveryInfoContainer =
                                   document.createElement("div");

                              // Set the class name for the new div
                              deliveryInfoContainer.className =
                                   "delivery1-order-info-body";

                              // Add the order-specific data as the innerHTML for the new div
                              deliveryInfoContainer.innerHTML = `
                        <div class="delivery1-order-info-columns">
                            <div class="delivery1-order-column-general">
                                <div class="delivery1-infobox-1">
                                   
                                    <div class="delivery1-infobox-1-2-element">
                                        <h5>Pick-up:</h5>
                                        <span>${order.pickup_date}</span>
                                    </div>
                                    <div class="delivery1-infobox-1-2-element">
                                        <h5>Comment:</h5>
                                        <span>${order.comment}</span>
                                    </div>
                                </div>
                                <div class="delivery1-infobox-2">
                                    <div class="delivery1-infobox-1-2-element">
                                        <h5>Delivery:</h5>
                                        <span>${order.delivery_date}</span>
                                    </div>
                                    <div class="delivery1-infobox-1-2-element">
                                        <h5>Delivery address:</h5>
                                        <span>${order.recipient.address}, ${order.recipient.postal_code}</span>

                                    </div>
                                    <div class="delivery1-infobox-1-2-element">
                                        <h5>Order number:</h5>
                                        <span>${order.order_number}</span>
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
                                        ${packagesHTML}
                                    </ol>
                                </div>
                            </div>
                        </div>
                    `;

                              // Append the new div into the parent element
                              const parentElement = document.getElementById(
                                   "delivery1-JS-insert-informationsquare"
                              );
                              parentElement.appendChild(deliveryInfoContainer);

                              const senderRecipientContainer =
                                   document.createElement("div");
                              senderRecipientContainer.className =
                                   "delivery1-sendRecip-info-topbar";
                              senderRecipientContainer.innerHTML = `
                                   <div class=delivery1-sender-topbar>
                                       <h5>Sender:</h5>
                                       <span>${order.sender.name}</span></br>
                                       <span>${order.sender.address}, ${order.sender.postal_code}</span>
                                   </div>
                                   <div class=delivery1-recipient-topbar>
                                       <h5>Receiver:</h5>
                                       <span>${order.recipient.name}</span></br>
                                       <span>${order.recipient.address}, ${order.recipient.postal_code}</span>
                                   </div>
                               `;

                              const parentElement2 = document.getElementById(
                                   "delivery1-topbar-sendReci-JS-insert"
                              );

                              parentElement2.appendChild(
                                   senderRecipientContainer
                              );
                         } else {
                              // Run logic when the button is not active or aria-pressed is false
                              console.log(
                                   "Button is not active or aria-pressed is false"
                              );
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

     // |||||REF 2

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
