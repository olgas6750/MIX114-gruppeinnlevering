// Get the current order information from localstorage
window.onload = function(){

    packageString = localStorage.getItem("packages");
    console.log(packageString);
    packages = JSON.parse(packageString);
    console.log(packages);
}

// Declare some variables for later use
let senderReady = false;
let recipientReady = false;
let extraInfo = "";

function collectData2(){
    // Initialize senderReady and recipientReady variables as true
    senderReady = true;
    recipientReady = true;

    // Get the sender form element
    const senderForm = document.querySelector('#senderForm');
    // Create a new FormData object to gather sender form input values
    const senderData = new FormData(senderForm);

    // Create an empty object to store sender data
    const senderObject = {};

    // Iterate through each key-value pair in the senderData object
    for (const [key, value] of senderData.entries()) {
        // Check if the value is empty
        if(value == ""){
            // Display an alert message for missing values in the sender form
            alert("Please fill out all the fields. Detected missing value for sender " + key);
            // Set senderReady to false
            senderReady = false;
            // Exit the loop
            break;
        } else {
            // Assign the value to the senderObject using the key as the property name
            senderObject[key] = value;
        }
    }

    // Get the recipient form element
    const recipientForm = document.querySelector('#recipientForm');
    // Create a new FormData object to gather recipient form input values
    const recipientData = new FormData(recipientForm);

    // Create an empty object to store recipient data
    const recipientObject = {};

    // Iterate through each key-value pair in the recipientData object
    for (const [key, value] of recipientData.entries()) {
        // Check if the value is empty
        if(value == ""){
            // Set recipientReady to false
            recipientReady = false;
            // Display an alert message for missing values in the recipient form
            alert("Please fill out all the fields. Detected missing value for recipient " + key);
            // Exit the loop
            break;
        } else {
            // Assign the value to the recipientObject using the key as the property name
            recipientObject[key] = value;
        }
    }

    // Get the value of the "textBoks" input element
    extraInfo = document.querySelector('#textBoks').value;

    // Check if both sender and recipient forms are ready
    if(senderReady && recipientReady){
        // Create an orderInfo object with packages, senderInfo, recipientInfo, and extraInfo
        let orderInfo = {"packages": packages, "senderInfo": senderObject, "recipientInfo": recipientObject, "extraInfo": extraInfo};
        // Store the orderInfo object as a string in the browser's localStorage
        localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
        // Redirect the user to "selectDay.html"
        location.replace("selectDay.html");
    }
}