

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
      // info.event holds information about the clicked event
      // display the event details in the overlay here
      var title = info.event.title;
      var description = info.event.extendedProps.description;
      document.getElementById('eventOverlayTitle').textContent = title;
      document.getElementById('eventOverlayDescription').textContent = description;
      document.getElementById('eventOverlay').style.display = 'block';
    }
  });

  // close the overlay when the close button is clicked
  document.getElementById('eventOverlayCloseButton').addEventListener('click', function() {
    document.getElementById('eventOverlay').style.display = 'none';
  });

  calendar.render();
});