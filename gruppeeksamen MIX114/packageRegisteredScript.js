window.onload = function(){

    orderString = localStorage.getItem("finalOrderInfo");
    console.log(orderString);
    order = JSON.parse(orderString);
    console.log(order);

    dateContainer = document.getElementById("dateContainer");
    timeContainer = document.getElementById("timeContainer");

    console.log(order.pickUpTime);

    date = order.pickUpTime.split("T")[0];
    time = order.pickUpTime.split("T")[1];

    dateContainer.innerHTML += date;
    timeContainer.innerHTML += time;
}