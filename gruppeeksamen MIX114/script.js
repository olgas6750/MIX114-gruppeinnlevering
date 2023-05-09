document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    navLinks: true,
    dayMaxEvents: true,
    events: [
    {
      title: ' ',
      start: '2023-05-12T10:30:00',
      end: '2023-05-12T12:30:00'
    }
    ],
    eventClick: function(info){
      //create overlay
      $('#eventModalTitle').html(inof.event.title);
      $('#eventModalBody').html(info.event.extenedProps.description);
      $('#evetModal').modal();
    }

  });
  calendar.render();
});