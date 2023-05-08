let orders = {};
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
    '<h1 id="list-item-'+packageNumber+'">Package '+packageNumber+'</h1>'

    packages.innerHTML += newPackageInfo;

    if(packageNumber == 1){
        let image = document.getElementById("addPackageImage");
        image.parentNode.removeChild(image);
    }

};
