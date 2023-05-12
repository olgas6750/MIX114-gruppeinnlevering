

let packageNumber = 0;


function addPackage(){
    packageNumber++;
    //defines a couple variables that are used in the function
    let packageList = document.getElementById("sideBarPackageList");

    // creates a new button in the list with the corresponding number
    let newButton =
    '<a '+
    'class="list-group-item list-group-item-action"'+
    'href="#list-item-'+packageNumber+'"'+
    '>Package '+packageNumber+'</a'+
    '>';

    packageList.innerHTML += newButton;

    let packages = document.getElementById("mainContainerPackageList");
    
    let newPackageInfo = 
    '<form id="packageForm'+packageNumber+'">' +
    '<h1 id="list-item-'+packageNumber+'">Package '+packageNumber+'</h1>' +
    '<div class="dropdown">' +
    '<button ' +
    'class="btn btn-secondary dropdown-toggle" ' +
    'type="button" ' +
    'id="dropdownMenuButton" ' +
    'data-toggle="dropdown" ' +
    'aria-haspopup="true" ' +
    'aria-expanded="false"> ' +
    'Category' +
    '</button>' +
    '<div ' +
    'class="dropdown-menu" ' +
    'aria-labelledby="dropdownMenuButton"> ' +
    '<div class="dropdown-item">' +
    '<input ' +
    'type="radio" ' +
    'id="clothes" ' +
    'name="category" ' +
    'value="Clothes" />' +
    '<label for="clothes">Clothes</label>' +
    '</div>' +
    '<div class="dropdown-item">' +
    '<input ' +
    'type="radio" ' +
    'id="food" ' +
    'name="category" ' +
    'value="Food" />' +
    '<label for="food">Food</label>' +
    '</div>' +
    '<div class="dropdown-item">' +
    '<input ' +
    'type="radio" ' +
    'id="electronics" ' +
    'name="category" ' +
    'value="Electronics" />' +
    '<label for="electronics">Electronics</label>' +
    '</div>' +
    '<div class="dropdown-item">' +
    '<input ' +
    'type="radio" ' +
    'id="other" ' +
    'name="category" ' +
    'value="Other" />' +
    '<label for="other">Other</label>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<br />' +
    '<table>' +
    ' <tr>' +
    ' <td><label for="weight">Weight (in grams)</label></td>' +
    ' <td><input type="number" placeholder="Weight" name="weight"/></td>' +
    ' </tr>' +
    ' <tr>' +
    ' <td><label for="length">Length (in cm)</label></td>' +
    ' <td><input type="number" placeholder="Length" name="length"/></td>' +
    ' </tr>' +
    ' <tr>' +
    ' <td><label for="height">Height (in cm)</label></td>' +
    ' <td><input type="number" placeholder="Height" name="height"/></td>' +
    ' </tr>' +
    ' <tr>' +
    ' <td><label for="width">Width (in cm)</label></td>' +
    ' <td><input type="number" placeholder="Width" name="width"/></td>' +
    ' </tr>' +
    '</table>'+
    '</form>'+
    '<br />';

    packages.innerHTML += newPackageInfo;

    if(packageNumber == 1){
        let image = document.getElementById("addPackageImage");
        image.parentNode.removeChild(image);
    }

};

function collectData(){
    let packageObject = {};
    for(let i = 0; i<packageNumber; i++){
        let formName = "#packageForm"+(i+1);

        let currentForm = document.querySelector(formName);
        console.log(formName);
        console.log(currentForm);
        let formData = new FormData(currentForm);
        let currentPackage = {};
        
        formData.forEach((value, key) =>{
            currentPackage[key] = value;
        });

        console.log(currentPackage);

       packageObject[i] = currentPackage;
    }
   console.log(packageObject);
   localStorage.setItem("packages", JSON.stringify(packageObject));
   location.replace("sendOrder2.html");
}