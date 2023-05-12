function collectData2(){
    packages = localStorage.getItem("packages");
    console.log(packages);

    const senderData = new FormData(document.querySelector('senderForm'));

    const senderObject = {};
    for (const [key, value] of senderData.entries()) {
    senderObject[key] = value;
    }

    console.log(senderObject);
}