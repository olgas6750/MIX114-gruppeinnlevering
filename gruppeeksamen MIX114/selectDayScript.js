window.onload = function(){

  orderString = localStorage.getItem("orderInfo");
  order = JSON.parse(orderString);
}

var selectedDateAndTime;

document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');
  
    var calendar = new FullCalendar.Calendar(calendarEl, {
      selectable: 'true',
      timeZone: 'GMT',
      initialView: 'timeGridDay',
      headerToolbar: {
        left: 'next',
        center: 'title',
        right: 'today'
      },
      allDaySlot: false,
      slotMinTime: "07:00:00",
      slotMaxTime: "20:30:00",
      dateClick: function(info) {
            selectedDateAndTime = info.dateStr;
            $('#confirmModal').find('.selectedDateAndTime').text(info.dateStr.split("T"));
            $('#confirmModal').modal()
      },
    });
    calendar.render();
  });

function nextPage(){
  order.pickUpTime = selectedDateAndTime;
  console.log(order);
  const finalOrderInfo = JSON.stringify(order);
  localStorage.setItem("finalOrderInfo", finalOrderInfo);
   location.replace("packageRegistered.html");
}