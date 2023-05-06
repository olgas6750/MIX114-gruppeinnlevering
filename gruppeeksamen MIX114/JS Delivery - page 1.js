// Here starts clickevent for accept and decline button on delivery1
document.addEventListener("DOMContentLoaded", function () {
     const acceptButton = document.getElementById("delivery1-acceptButton");
     const declineButton = document.getElementById("delivery1-declineButton");
     const requestToggleButton = document.getElementById(
          "delivery1-request-toggle-button"
     );
     const acceptToggleButton = document.getElementById(
          "delivery1-accept-toggle-button"
     );
     const declineToggleButton = document.getElementById(
          "delivery1-decline-toggle-button"
     );
     const indicationRequest = document.getElementById(
          "delivery1-indicationRequest"
     );
     const indicationDecline = document.getElementById(
          "delivery1-indicationDecline"
     );
     const indicationAccept = document.getElementById(
          "delivery1-indicationAccept"
     );

     acceptButton.addEventListener("click", function () {
          if (
               requestToggleButton.classList.contains("active") &&
               requestToggleButton.classList.contains(
                    "delivery1-request-container"
               )
          ) {
               console.log("Accept button clicked");
               requestToggleButton.classList.remove(
                    "delivery1-request-container"
               );
               requestToggleButton.classList.add(
                    "delivery1-accepted-container"
               );
               indicationRequest.classList.remove(
                    "delivery1-indication-request"
               );
               indicationRequest.classList.add("delivery1-indication-accept");
               indicationRequest.innerHTML = indicationAccept.innerHTML;
          } else {
               console.log("Request button is not active");
          }
     });

     declineButton.addEventListener("click", function () {
          if (
               requestToggleButton.classList.contains("active") &&
               requestToggleButton.classList.contains(
                    "delivery1-request-container"
               )
          ) {
               console.log("Decline button clicked");

               requestToggleButton.classList.remove(
                    "delivery1-request-container"
               );
               requestToggleButton.classList.add(
                    "delivery1-declined-container"
               );

               indicationRequest.classList.remove(
                    "delivery1-indication-request"
               );
               indicationRequest.classList.add("delivery1-indication-decline");
               indicationRequest.innerHTML = indicationDecline.innerHTML;
          } else {
               console.log("Request button is not active");
          }
     });

     requestToggleButton.addEventListener("click", function () {
          if (requestToggleButton.classList.contains("active")) {
               requestToggleButton.setAttribute("aria-pressed", "true");
               acceptToggleButton.classList.remove("active");
               declineToggleButton.classList.remove("active");
          } else {
               requestToggleButton.setAttribute("aria-pressed", "false");
          }
     });

     acceptToggleButton.addEventListener("click", function () {
          if (acceptToggleButton.classList.contains("active")) {
               acceptToggleButton.setAttribute("aria-pressed", "true");
               requestToggleButton.classList.remove("active");
               declineToggleButton.classList.remove("active");
          } else {
               acceptToggleButton.setAttribute("aria-pressed", "false");
          }
     });

     declineToggleButton.addEventListener("click", function () {
          if (declineToggleButton.classList.contains("active")) {
               declineToggleButton.setAttribute("aria-pressed", "true");
               requestToggleButton.classList.remove("active");
               acceptToggleButton.classList.remove("active");
          } else {
               declineToggleButton.setAttribute("aria-pressed", "false");
          }
     });
});

// Here ends clickevent for accept and decline button on delivery1

// This section only allows one active/toggled button at a time

// TSection end
