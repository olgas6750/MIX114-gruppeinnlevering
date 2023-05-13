window.onload = async function(){
  const url = "https://api.npoint.io/22c58a328e7e75e91929";

  const response = await fetch(url);
  var data = await response.json();
  console.log(data);
};

document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    navLinks: true,
    dayMaxEvents: true,
    events: [
      {
        title: ' ',
        start: '2023-05-12T12:30:00',
        end: '2023-05-12T13:30:00',
      },

      {
        title: ' ',
        start: '2023-05-15T22:30:00',
        end: '2023-05-15T22:30:00'
      }
    ],

    eventClick: function(info) {
      loadModal(info);
    } 
  });
  calendar.render();
});

function loadModal(){
  $('#orderModal').modal('show');
}