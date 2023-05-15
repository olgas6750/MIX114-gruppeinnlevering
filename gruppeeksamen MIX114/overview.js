// HERE STARTS OVERVIEW MAP
var directionsService;
var directionsRenderer;

async function initMap() {
     directionsService = new google.maps.DirectionsService();
     directionsRenderer = new google.maps.DirectionsRenderer();
     const mapOptions = {
          center: { lat: 60.389181, lng: 5.333219 },
          zoom: 14,
     };

     mapOverview = new google.maps.Map(
          document.getElementById("overview-modal-goolgeMaps"),
          mapOptions
     );

     directionsRenderer.setMap(mapOverview);
}

function calcRoute(start,end){
     var request = {
          origin: start,
          destination: end,
          // Note that JavaScript allows us to access the constant
          // using square brackets and a string value as its
          // "property."
          travelMode: "DRIVING"
      };
      directionsService.route(request, function(response, status) {
        if (status == 'OK') {
          directionsRenderer.setDirections(response);
        }
      });
}

// HERE ENDS OVERVIEW MAP

const userName = "Oliver Hansen";

document.addEventListener("DOMContentLoaded", function () {
     var calendarEl = document.getElementById("calendar");

     var calendar = new FullCalendar.Calendar(calendarEl, {
          initialView: "dayGridMonth",
          navLinks: true,
          dayMaxEvents: true,

          eventClick: function (info) {
               loadModal(info);
          },
     });
     calendar.render();
     loadEvents(calendar);
});

async function loadEvents(calendar) {
     const url = "https://api.npoint.io/22c58a328e7e75e91929";

     const response = await fetch(url);
     data = await response.json();

     var orderCount = Object.keys(data.orders).length;

     for (let i = 0; i < orderCount; i++) {
          let currentOrder = data.orders[i];
          let orderID = data.orders[i].order_number;
/*           let currentPackageList = data.orders[i].packages;
          console.log(currentPackageList); */

          if (currentOrder.sender.name == userName) {
               const pickUpDate = currentOrder.pickup_date;

               var event = {
                    id: orderID,
                    title: "Order pickup",
                    start: pickUpDate,
                    color: "blue",
                    extendedProps: currentOrder,
               };

               calendar.addEvent(event);
          } else if (currentOrder.recipient.name == userName) {
               const deliveryDate = currentOrder.delivery_date;

               var event = {
                    id: orderID,
                    title: "Order delivery",
                    start: deliveryDate,
                    color: "green",
                    extendedProps: currentOrder,
               };

               calendar.addEvent(event);
          } else {
               alert("error hehe");
          }
     }
}


function loadModal(info) {


     let modalOrderInfo = info.event.extendedProps;
     
     document.getElementById("modal-title").innerHTML = modalOrderInfo.order_number;
     document.getElementById("senderName").innerHTML = modalOrderInfo.sender.name;
     document.getElementById("senderAddress").innerHTML = modalOrderInfo.sender.address;
     document.getElementById("recipientName").innerHTML = modalOrderInfo.recipient.name;
     document.getElementById("recipientAddress").innerHTML = modalOrderInfo.recipient.address;

     let senderLat = modalOrderInfo.sender.lat;
     let senderLng = modalOrderInfo.sender.lng;
     let recipientLat = modalOrderInfo.recipient.lat;
     let recipientLng = modalOrderInfo.recipient.lng;

      var senderLatlng = new google.maps.LatLng(senderLat,senderLng);
      var recipientLatlng = new google.maps.LatLng(recipientLat,recipientLng);

      calcRoute(senderLatlng, recipientLatlng);

     document.getElementById("orderPackageListContainer").innerHTML = "";
     for(let i = 0; i<modalOrderInfo.packages.length;i++){
      let thisPackage = modalOrderInfo.packages[i];


      document.getElementById("orderPackageListContainer").innerHTML += 
      '<ul id="package'+i+'">' +
      '<li id="packageName'+i+'">Package '+(i+1)+'</li>' +
      '<ul>'+
      '<li id="packageWeight'+i+'">Weight: '+ thisPackage.weight +'</li>' +
      '<li id="packageVolume'+i+'">Quantity: '+ thisPackage.volume +'</li>' +
      '<li id="packageCategory'+i+'">Category: '+ thisPackage.category +'</li>' +
      '</ul>'+
      '</ul>';
      
     }
     $("#orderModal").modal("show");
}
