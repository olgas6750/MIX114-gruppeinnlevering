var selectedDateAndTime;

document.addEventListener('DOMContentLoaded', function() {

    var calendarEl = document.getElementById('calendar');
  
    var calendar = new FullCalendar.Calendar(calendarEl, {
      selectable: 'true',
      timeZone: 'GMT',
      initialView: 'timeGridDay',
      headerToolbar: {
        left: 'next today',
        center: 'title',
        right: 'timeGridDay'
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
