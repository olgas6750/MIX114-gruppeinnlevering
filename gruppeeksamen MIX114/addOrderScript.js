let packages = {};

function addPackage(){
    //defines a couple variables that are used in the function
    let packageList = document.getElementById("sideBarPackageList");
    let listLength = packageList.getElementsByTagName("li").length;
    let packageNumber = listLength;

    packages

    let newButton =
    '<li>'+
    '<button class="viewPackageButton" onclick="viewPackage('+packageNumber+')">'+
    'New package' + packageNumber +
    '</button>'+
    '</li>';

    packageList.innerHTML = newButton + packageList.innerHTML;
};