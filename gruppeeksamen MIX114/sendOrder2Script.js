window.onload = function(){

    packageString = localStorage.getItem("packages");
    console.log(packageString);
    packages = JSON.parse(packageString);
    console.log(packages);
}

let senderReady = false;
let recipientReady = false;
let extraInfo = "";

function collectData2(){
    senderReady = true;
    recipientReady = true;
    const senderForm = document.querySelector('#senderForm');
    const senderData = new FormData(senderForm);

    const senderObject = {};

    for (const [key, value] of senderData.entries()) {
        if(value == ""){
            alert("Please fill out all the fields. Detected missing value for sender " + key);
            senderReady = false;
            break;
        }else
        senderObject[key] = value;
    }

    const recipientForm = document.querySelector('#recipientForm');
    const recipientData = new FormData(recipientForm);

    const recipientObject = {};

    for (const [key, value] of recipientData.entries()) {
        if(value == ""){
            recipientReady = false;
            alert("Please fill out all the fields. Detected missing value for recipient " + key);
            break;
            
        }else
        recipientObject[key] = value;
    }

    extraInfo = document.querySelector('#textBoks').value;
        
    if(senderReady && recipientReady){

        let orderInfo = {"packages": packages, "senderInfo": senderObject, "recipientInfo": recipientObject, "extraInfo": extraInfo};
        localStorage.setItem("orderInfo", JSON.stringify(orderInfo));
        location.replace("selectDay.html");
    }
}