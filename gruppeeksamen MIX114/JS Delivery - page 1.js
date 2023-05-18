document.addEventListener("DOMContentLoaded", function () {
     var calendarEl = document.getElementById("calendar");

     // This will launch the Fullcalendar API and set it to some initial settings
     var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: "dayGridMonth",
          navLinks: true,
          dayMaxEvents: true,
          allDaySlot: true,
     });

     calendar.render();

     let ordersData = [];

     const acceptButton = document.getElementById("delivery1-acceptButton");
     const declineButton = document.getElementById("delivery1-declineButton");
     const indicationDecline = document.getElementById(
          "delivery1-indicationDecline"
     );
     const indicationAccept = document.getElementById(
          "delivery1-indicationAccept"
     );

     // Here starts picture selection corrosponding with category
     // This will set a specific picture, stored locally, to it's corrosponding "case" which is data stored in the JSON api
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

     // Function to fetch data from the JSON api
     async function fetchData() {
          try {
               const response = await fetch(
                    "https://api.npoint.io/1a82a1d24a67d58b1354"
               );
               const data = await response.json();
               ordersData = data.orders;

               // Here, a for-loop runs through each "orders" og the JSON data.
               for (let index = 0; index < data.orders.length; index++) {
                    const order = data.orders[index];
                    console.log("Data", order);

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

                    // Here the buttons are created and populated with the fetched data.
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

                    // This specific eventlistener for the acceptbutton will add an event to the calendar if aria presser is true.
                    acceptButton.addEventListener("click", function () {
                         console.log("Accept button clicked");
                         acceptButtonPressed = true;

                         if (
                              btn.getAttribute("aria-pressed") == "true" &&
                              acceptButtonPressed
                         ) {
                              const event = {
                                   title: order.sender.name,
                                   start: order.pickup_date,
                              };
                              calendar.addEvent(event);
                         } else {
                              const events = calendar.getEvents();
                              const eventToDelete = events.find(
                                   (e) =>
                                        e.startStr === order.pickup_date &&
                                        e.title === order.sender.name
                              );
                         }
                    });

                    btn.addEventListener("click", () => {
                         console.log(order);

                         const parentElement = document.getElementById(
                              "delivery1-JS-insert-informationsquare"
                         );

                         const parentElement2 = document.getElementById(
                              "delivery1-topbar-sendReci-JS-insert"
                         );

                         if (parentElement.lastElementChild) {
                              parentElement.lastElementChild.remove();
                         }

                         if (parentElement2.lastElementChild) {
                              parentElement2.lastElementChild.remove();
                         }

                         if (
                              btn.classList.contains("active") ||
                              btn.getAttribute("aria-pressed") === "true"
                         ) {
                              console.log(
                                   "Button is active or aria-pressed is true"
                              );

                              //     Here a part of the information square is created and and used to populate further down
                              let packagesHTML = "";
                              for (let package of order.packages) {
                                   const imgSrc = getCategoryImage(
                                        package.category
                                   );
                                   packagesHTML += `
        <li class="delivery1-items-info">
            <span class="delivery1-info-picandname">
                <img src="${imgSrc}" alt="picture of ${package.category}" />
                <span>${package.category}</span>
            </span>
            <span class="delivery1-info-volWeg">${package.volume}</span>
            <span class="delivery1-info-volWeg">${package.weight}Kg</span>
        </li>
    `;
                              }

                              // Creates a new div to hold the detailed order information
                              const deliveryInfoContainer =
                                   document.createElement("div");

                              // Sets class name
                              deliveryInfoContainer.className =
                                   "delivery1-order-info-body";

                              //    Here is another dynamically inserted HTML section, which creates the information square.
                              deliveryInfoContainer.innerHTML = `
                        <div class="delivery1-order-info-columns">
                            <div class="delivery1-order-column-general">
                                <div class="delivery1-infobox-1">
                                   
                                    <div class="delivery1-infobox-1-2-element">
                                        <h5 class="infotext-title">Pick-up:</h5>
                                        <span>${order.pickup_date}</span>
                                    </div>
                                    <div class="delivery1-infobox-1-2-element">
                                        <h5 class="infotext-title">Order number:</h5>
                                        <span>${order.order_number}</span>
                                    </div>
                                    <div class="delivery1-infobox-1-2-element">
                                    <h5 class="infotext-title">Comment:</h5>
                                    <span>${order.comment}</span>
                                </div>
                                </div>
                                <div class="delivery1-infobox-2">
                                    <div class="delivery1-infobox-1-2-element">
                                        <h5 class="infotext-title">Delivery:</h5>
                                        <span>${order.delivery_date}</span>
                                    </div>
                                    <div class="delivery1-infobox-1-2-element">
                                        <h5 class="infotext-title">Delivery address:</h5>
                                        <span>${order.recipient.address}, ${order.recipient.postal_code}</span>
                                    </div>
               
                                </div>
                            </div>
                            <div class="delivery1-order-column-items">
                                <div class="delivery1-order-items-title">
                                    <h6 class="infotext-title">Items</h6>
                                    <h6 class="infotext-title" id="delivery1-item-title-Qty">Qty</h6>
                                    <h6 class="infotext-title">Weight</h6>
                                </div>
                                <div class="delivery1-items-OLlist">
                                    <ol>
                                        ${packagesHTML}
                                    </ol>
                                </div>
                            </div>
                        </div>
                    `;

                              const parentElement = document.getElementById(
                                   "delivery1-JS-insert-informationsquare"
                              );
                              parentElement.appendChild(deliveryInfoContainer);

                              const senderRecipientContainer =
                                   document.createElement("div");
                              senderRecipientContainer.className =
                                   "delivery1-sendRecip-info-topbar";
                              // This will appends the information into the sub-header.
                              senderRecipientContainer.innerHTML = `
                                   <div class=delivery1-sender-topbar>
                                       <h5 class="infotext-title">Sender:</h5>
                                       <span>${order.sender.name}</span></br>
                                       <span>${order.sender.address}, ${order.sender.postal_code}</span>
                                   </div>
                                   <div class=delivery1-recipient-topbar>
                                       <h5 class="infotext-title">Receiver:</h5>
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
                              console.log(
                                   "Button is not active or aria-pressed is false"
                              );
                         }
                    });

                    // This adds an event listener to handle active button
                    btn.addEventListener("click", function () {
                         document.querySelectorAll(".btn").forEach((button) => {
                              button.classList.remove("active");
                              button.setAttribute("aria-pressed", "false");
                         });
                         btn.classList.add("active");
                         btn.setAttribute("aria-pressed", "true");
                    });

                    document
                         .getElementById("delivery1-button-container")
                         .appendChild(btn);
               }
          } catch (error) {
               console.error("Error fetching API data:", error);
          }
     }

     fetchData();

     // This function calculates the driving distance
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

     // Event listeners to the accept and decline buttons which will change class for CSS styling.
     acceptButton.addEventListener("click", function (event) {
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
