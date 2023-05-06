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
