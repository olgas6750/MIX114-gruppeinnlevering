// Js for maps starts here
function initMap() {
     const mapOptions = {
          center: { lat: -34.397, lng: 150.644 },
          zoom: 8,
     };

     const map = new google.maps.Map(
          document.getElementById("map"),
          mapOptions
     );
}
// Js for maps ends here

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

     const dropdownMenu = document.getElementById("dropdownMenu");
     dropdownMenu.addEventListener("click", function (event) {
          const selectedItem = event.target;
          if (selectedItem.classList.contains("dropdown-item")) {
               updateSelectedDelay(selectedItem);
          }
     });

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
