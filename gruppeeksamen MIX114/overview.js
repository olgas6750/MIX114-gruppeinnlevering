const userName = "Oliver Hansen";

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    navLinks: true,
    dayMaxEvents: true,

    eventClick: function(info) {
      loadModal(info);
    } 
  });
    calendar.render();
    loadEvents(calendar);
  }
);

async function loadEvents(calendar){
  const url = "https://api.npoint.io/22c58a328e7e75e91929";

  const response = await fetch(url);
  data = await response.json();
  console.log(data);

  var orderCount = Object.keys(data.orders).length;

  
  for(let i = 0; i<orderCount; i++){
    let currentOrder = data.orders[i];
    let orderID = data.orders[i].order_number;
    let currentPackageList = data.orders[i].packages;
    console.log(currentPackageList);
    
    if(currentOrder.sender.name == userName)
    {
      const pickUpDate = currentOrder.pickup_date;
      
      var event = {
        id: orderID,
        title: "Order pickup",
        start: pickUpDate,
        color: "blue",
        extendedProps: currentOrder
      }

      calendar.addEvent(event);
    }
    else if(currentOrder.recipient.name == userName)
    { 
      const deliveryDate = currentOrder.delivery_date;
      
      var event = {
        id: orderID,
        title: "Order delivery",
        start: deliveryDate,
        color: "green",
        extendedProps: currentOrder
      }

      calendar.addEvent(event);
    }
    else
    {
      alert("error hehe");
    }
  }
}

function loadModal(info){
  console.log(info);
  $('#orderModal').modal('show');
}