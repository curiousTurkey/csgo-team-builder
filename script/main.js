//api links
const AGENT_URL = "https://bymykel.github.io/CSGO-API/api/en/agents.json";
const WEAPONS_URL = "https://bymykel.github.io/CSGO-API/api/en/skins.json";
const RANDOM_NAME_URL = "https://randomuser.me//api?results=20";
//array to store api data
let balance = 9000;
let agentArray = [];
let namesArray = [];
let pistolsArray = [];
let riflesArray = [];
let heavyArray = [];
let smgArray = [];
let knivesArray = [];
let glovesArray = [];
//function to fetch api to call api and set data.
function apiFetch(url, callbackfunction) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.onload = () => {
        callbackfunction(xhr.responseText);
    }
    xhr.send();
}
//call to do api fetch
apiFetch(AGENT_URL, (response) => {
    agentArray = JSON.parse(response);
    console.log(agentArray); //for debugging purpose
});
apiFetch(RANDOM_NAME_URL, (response) => {
    let randomNamesArray = JSON.parse(response);
    for(i = 0; i<randomNamesArray.results.length; i++){
    namesArray.push(randomNamesArray.results[i].name.first + " " + randomNamesArray.results[i].name.last);
    }
});
//function to get random number
function getRandomNumber(min, max) {
    // Adjust min and max to ensure they're multiples of 50
    min = Math.ceil(min / 50) * 50;
    max = Math.floor(max / 50) * 50;

    // Calculate the number of possible values within the range
    var numPossibleValues = (max - min) / 50 + 1;

    // Generate a random index within the range of possible values
    var randomIndex = Math.floor(Math.random() * numPossibleValues);

    // Calculate and return the random number
    return min + randomIndex * 50;
}
function returnWeaponObject(weapon) {

    let weaponObject = {
        weaponId: weapon.id,
        weaponName: weapon.name,
        weaponSkinName: weapon.weapon.name,
        patternName: weapon.pattern.name,
        categoryName: weapon.category.name,
        teamId: weapon.team.id,
        teamName: weapon.team.name,
        weaponImage: weapon.image,
        weaponPrice: weapon.price,
    }
    return weaponObject;
}
//call to do api fetch 
apiFetch(WEAPONS_URL, (response) => {
    let min;
    let max;
    let tempArray = JSON.parse(response);
    for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i].category.name !== null)
            if (tempArray[i].image !== null)
                if (tempArray[i].pattern !== null)
                    if (tempArray[i].team.id !== null)
                        if (tempArray[i].weapon.name !== null) {
                            if (tempArray[i].category.name === 'Pistols') {
                                min = 200;
                                max = 700;
                                tempArray[i].price = getRandomNumber(min, max)
                                pistolsArray.push(returnWeaponObject(tempArray[i]));

                            }
                            if (tempArray[i].category.name === 'Rifles') {
                                min = 1500;
                                max = 3500;
                                tempArray[i].price = getRandomNumber(min, max);
                                riflesArray.push(returnWeaponObject(tempArray[i]));
                            }
                            if (tempArray[i].category.name === 'Heavy') {
                                min = 2500;
                                max = 4500;
                                tempArray[i].price = getRandomNumber(min, max);
                                heavyArray.push(returnWeaponObject(tempArray[i]));
                            }
                            if (tempArray[i].category.name === 'SMGs') {
                                min = 1000;
                                max = 1500;
                                tempArray[i].price = getRandomNumber(min, max);
                                smgArray.push(returnWeaponObject(tempArray[i]));
                            }
                            if (tempArray[i].category.name === 'Knives') {
                                min = 100;
                                max = 500;
                                tempArray[i].price = getRandomNumber(min, max);
                                knivesArray.push(returnWeaponObject(tempArray[i]));
                            }
                            if (tempArray[i].category.name === 'Gloves') {
                                min = 100;
                                max = 500;
                                tempArray[i].price = getRandomNumber(min, max);
                                glovesArray.push(returnWeaponObject(tempArray[i]));
                            }
                        } else {
                            continue;
                        }
    }
    tempArray = [];
});
//function to call selected team
function selectedTeam(teamName) {
    localStorage.setItem("selected-team", teamName);
    window.location.href = "agent-select.html";
}
//assign random team
function randomTeam() {
    let randomNumber = Math.round(Math.random()); // rounding the random number returned.
    if (randomNumber === 1) {
        localStorage.setItem('selected-team', 'terrorists');
        window.location.href = "agent-select.html";
    } else {
        localStorage.setItem('selected-team', 'counter-terrorists');
        window.location.href = "agent-select.html";
    }
}

//function to display all selected agents
function displaySelectedAgents() {
    let selectedTeam = localStorage.getItem("selected-team");
    let heading = document.getElementById("agentSelectHeading");
    heading.innerText = "Choose an agent: " + selectedTeam;
    let agentListContainer = document.getElementById("agentListContainer");
    console.log(selectedTeam)
    //to loop all agents and display the agents into the webpage
    for (let i = 0; i < agentArray.length; i++) {
        if (agentArray[i].team.id === selectedTeam) {
            let agentContainer = document.createElement("div");
            agentContainer.classList = "agent-container";
            let img = document.createElement("img");
            img.classList = "agent-image";
            img.src = agentArray[i].image;
            agentContainer.appendChild(img);
            let agentName = document.createElement("p");
            agentName.classList = "agent-name";
            agentName.innerText = agentArray[i].name;
            agentContainer.appendChild(agentName);
            agentListContainer.appendChild(agentContainer);
        }
    }
    agentSelect(".agent-container");
}
//to select and active agent tiles.
let isActive = false;
function agentSelect(classname) {
    let agents = document.querySelectorAll(classname);

    for (let i = 0; i < agents.length; i++) {
        agents[i].addEventListener("click", function () {
            playClickAudio();
            if (agents[i].classList.contains("active")) {
                agents[i].classList.remove("active");
                isActive = false;
            } else if (isActive == false) {
                for (let j = 0; j < agents.length; j++) {
                    agents[j].classList.remove("active");
                }
                agents[i].classList.add("active");
                isActive = true;
                let selectedAgentImage = document.querySelector(".active img").src;
                localStorage.setItem("selected-agent-image",selectedAgentImage);
                let selectedAgent = agents[i].innerText;
                localStorage.setItem('selected-agent', selectedAgent);
            } else if (isActive == true) {
                for (let j = 0; j < agents.length; j++) {
                    agents[j].classList.remove("active");
                }
                agents[i].classList.add("active");
                let selectedAgentImage = document.querySelector(".active img").src;
                localStorage.setItem("selected-agent-image",selectedAgentImage);
                let selectedAgent = agents[i].innerText;
                localStorage.setItem('selected-agent', selectedAgent);
            }
        });
    }
}
//funtion to display error message
function errorDisplay(message) {
    let textSpan = document.getElementById("errorMessage");
    textSpan.innerText = message;
    textSpan.style.padding = ".5em";
}
//to go to weapon section 
function goToWeaponSelection() {
    console.log("here");
    let inputBox = document.getElementById("input-name");
    let value = inputBox.value.trim();
    let wordCount = value.split(/\s+/).length;
    let characterCount = value.length;
    let flagAgent = false;
    let flagName = false;
    console.log(isActive)
    if (isActive == false) {
        flagAgent = false;
        console.log(isActive + "in")
        errorDisplay("Choose your agent!");
        return;
    } else {
        flagAgent = true;
    }

    if (value === "") {
        flagName = false;
        errorDisplay("Username can't be empty!");
    } else if (characterCount > 20) {
        flagName = false;
        errorDisplay("Invalid character length. No more than 20!");
    } else if (wordCount > 2) {
        flagName = false;
        errorDisplay("Invalid word count. No more than 2 words!");
    }
    else {
        flagName = true;
        errorDisplay("");
        localStorage.setItem("username", value);
    }
    if (flagAgent === true && flagName === true) {
        window.location.href = "weapon-select.html";
    }
}
//to sort and display weapons
//heavy,rifle,smg,pistols,knife,gloves
//category.name, 
//add event listeners to all categories
document.querySelectorAll(".weapon-category").forEach((item) => {
    let selectedTeam = localStorage.getItem("selected-team");
    let filteredWeaponsArray = [];
    item.addEventListener("click", () => {
        playClickAudio();
        if (item.innerText === "Gloves") {
            document.getElementById("weaponContainer").innerHTML = "";
            for (let i = 0; i < glovesArray.length; i++) {
                if (glovesArray[i].teamId === selectedTeam || glovesArray[i].teamId === 'both') {
                    filteredWeaponsArray.push(glovesArray[i]);
                }
            }
            insertWeaponCategories(filteredWeaponsArray, item.innerText);
        } else if (item.innerText === "Knives") {
            document.getElementById("weaponContainer").innerHTML = "";
            for (let i = 0; i < knivesArray.length; i++) {
                if (knivesArray[i].teamId === selectedTeam || knivesArray[i].teamId === 'both') {
                    filteredWeaponsArray.push(knivesArray[i]);
                }
            }
            insertWeaponCategories(filteredWeaponsArray, item.innerText);
        } else if (item.innerText === "Pistols") {
            document.getElementById("weaponContainer").innerHTML = "";
            for (let i = 0; i < pistolsArray.length; i++) {
                if (pistolsArray[i].teamId === selectedTeam || pistolsArray[i].teamId === 'both') {
                    filteredWeaponsArray.push(pistolsArray[i]);
                }
            }
            insertWeaponCategories(filteredWeaponsArray, item.innerText);
        } else if (item.innerText === "SMGs") {
            document.getElementById("weaponContainer").innerHTML = "";
            for (let i = 0; i < smgArray.length; i++) {
                if (smgArray[i].teamId === selectedTeam || smgArray[i].teamId === 'both') {
                    filteredWeaponsArray.push(smgArray[i]);
                }
            }
            insertWeaponCategories(filteredWeaponsArray, item.innerText);
        } else if (item.innerText === "Rifles") {
            document.getElementById("weaponContainer").innerHTML = "";
            for (let i = 0; i < riflesArray.length; i++) {
                if (riflesArray[i].teamId === selectedTeam || riflesArray[i].teamId === 'both') {
                    filteredWeaponsArray.push(riflesArray[i]);
                }
            }
            insertWeaponCategories(filteredWeaponsArray, item.innerText);
        } else if (item.innerText === "Heavy") {
            document.getElementById("weaponContainer").innerHTML = "";
            for (let i = 0; i < heavyArray.length; i++) {
                if (heavyArray[i].teamId === selectedTeam || heavyArray[i].teamId === 'both') {
                    filteredWeaponsArray.push(heavyArray[i]);
                }
            }
            insertWeaponCategories(filteredWeaponsArray, item.innerText);
        }
    })
});

//function to get unique array
function removeduplicates(arr) {
    let outputArray = Array.from(new Set(arr))
    return outputArray;
}
//function to get unique category array
function getCategory(weaponTypeArray) {
    let tempArray = [];
    for (let i = 0; i < weaponTypeArray.length; i++) {
        tempArray.push(weaponTypeArray[i].weaponSkinName);
    }
    uniqueArray = removeduplicates(tempArray);
    console.log(uniqueArray);
    return uniqueArray;
}
//function to display weapon categories
function onloadWeaponSelection(){
    let selectedTeam = localStorage.getItem("selected-team");
    document.getElementById("heading").innerText = `Choose Weapons: ${selectedTeam}`;
}
function insertWeaponCategories(weaponTypeArray, weaponCategory) {
    let categoryContainer = document.getElementById("weaponClass");

    categoryContainer.innerHTML = "";
    let uniqueArray = getCategory(weaponTypeArray);
    for (let i = 0; i < uniqueArray.length; i++) {
        let categoryTile = document.createElement("div");
        categoryTile.classList = "category-tile";
        let categoryName = document.createElement("p");
        categoryName.classList = "category-name";
        categoryName.innerText = uniqueArray[i];
        categoryTile.appendChild(categoryName);
        categoryContainer.appendChild(categoryTile);
    }
    //event listener to play audio and call functions
    document.querySelectorAll(".category-tile").forEach((item) => {
        item.addEventListener("click", () => {
            document.getElementById("weaponContainer").innerHTML = "";
            playClickAudio();
            displayWeapons(weaponTypeArray, weaponCategory, item.innerText);
        });
    });

}



//function to display weapons according to category
function displayWeapons(weaponTypeArray, weaponCategory, weaponSkinName) {
    let weaponContainer = document.getElementById("weaponContainer");
    for (let i = 0; i < weaponTypeArray.length; i++) {
        if (weaponSkinName === weaponTypeArray[i].weaponSkinName) {
            let weaponTile = document.createElement("div");
            weaponTile.classList = "weapons";
            let weaponImage = document.createElement("img");
            weaponImage.src = weaponTypeArray[i].weaponImage;
            weaponImage.classList = "weapon-image";
            weaponTile.appendChild(weaponImage);
            let weaponName = document.createElement("p");
            weaponName.classList = "weapon-name";
            weaponName.innerText = weaponTypeArray[i].weaponSkinName;
            weaponTile.appendChild(weaponName);
            weaponCost = document.createElement("p");
            weaponCost.classList = "weapon-price";
            weaponCost.innerText = "" + weaponTypeArray[i].weaponPrice;
            weaponTile.appendChild(weaponCost);
            let hiddenSpan = document.createElement("span");
            hiddenSpan.style.opacity = "0";
            hiddenSpan.innerText = weaponTypeArray[i].weaponId;
            weaponTile.appendChild(hiddenSpan);
            weaponContainer.appendChild(weaponTile);
        }
    }
    setWeaponActive(weaponCategory);
}

//function to set active status to selected weapons
let isWeaponActive = false;
let activeWeapon;


function setWeaponActive(weaponCategory) {
    let allWeapons = document.querySelectorAll(".weapons");
    for (let i = 0; i < allWeapons.length; i++) {
        allWeapons[i].addEventListener("click", function () {
            playClickAudio();
            if (allWeapons[i].classList.contains("active")) {
                allWeapons[i].classList.remove("active");
                isWeaponActive = false;
            } else if (isWeaponActive == false) {
                for (let j = 0; j < allWeapons.length; j++) {
                    allWeapons[j].classList.remove("active");
                }
                allWeapons[i].classList.add("active");
                isWeaponActive = true;
                activeWeapon = document.querySelector(".active span").innerHTML;
                saveWeapon(weaponCategory, activeWeapon);
            } else if (isWeaponActive == true) {
                console.log(allWeapons[i])
                for (let j = 0; j < allWeapons.length; j++) {
                    allWeapons[j].classList.remove("active");
                }
                allWeapons[i].classList.add("active");
                activeWeapon = document.querySelector(".active span").innerHTML;
                saveWeapon(weaponCategory, activeWeapon);
            }
        });
    }
}

//function to save selected weapon
let savedWeapon = new Array(5);
let balanceContainer = document.getElementById("balance");
if(balanceContainer){
    balanceContainer.innerText = "Balance: $" + balance;
}
function saveWeapon(category, weapon) {
    let balanceDiv = document.getElementById("balance");
    switch (category) {
        case 'Pistols':
            pistolsArray.forEach((item) => {
                if (item.weaponId === weapon) {
                    if(savedWeapon[0] === undefined){
                    savedWeapon[0] = item;
                    balance = balance - savedWeapon[0].weaponPrice;
                    balanceDiv.innerText = "Balance: $" + balance;
                    console.log(savedWeapon[2]);
                    console.log(balance);
                    }
                    else{
                        balance = balance + savedWeapon[0].weaponPrice;
                        savedWeapon[0] = item;
                        balance = balance - savedWeapon[0].weaponPrice;
                        balanceDiv.innerText = "Balance: $" + balance;
                        console.log(balance)
                    }
                }
            });
            console.log(savedWeapon[0]);
            break;
        case 'Rifles':
            riflesArray.forEach((item) => {
                if (item.weaponId === weapon) {
                    if(savedWeapon[1] === undefined){
                    savedWeapon[1] = item;
                    balance = balance - savedWeapon[1].weaponPrice;
                    balanceDiv.innerText = "Balance: $" + balance;
                    console.log(savedWeapon)
                }else{
                    balance = balance + savedWeapon[1].weaponPrice;
                    savedWeapon[1] = item;
                    balance = balance - savedWeapon[1].weaponPrice;
                    balanceDiv.innerText = "Balance: $" + balance;
                }
            }
            });
            break;
        case 'Heavy':
            heavyArray.forEach((item) => {
                if (item.weaponId === weapon) {
                    if(savedWeapon[2] === undefined){
                        savedWeapon[2] = item;
                        balance = balance - savedWeapon[2].weaponPrice;
                        balanceDiv.innerText = "Balance: $" + balance;
                        console.log(savedWeapon)
                    }else{
                        balance = balance + savedWeapon[2].weaponPrice;
                        savedWeapon[2] = item;
                        balance = balance - savedWeapon[2].weaponPrice;
                        balanceDiv.innerText = "Balance: $" + balance;
                    }
                }
            });
            break;
        case 'SMGs':
            smgArray.forEach((item) => {
                if (item.weaponId === weapon) {
                    if(savedWeapon[3] === undefined){
                        savedWeapon[3] = item;
                        balance = balance - savedWeapon[3].weaponPrice;
                        balanceDiv.innerText = "Balance: $" + balance;
                        console.log(savedWeapon)
                    }else{
                        balance = balance + savedWeapon[3].weaponPrice;
                        savedWeapon[3] = item;
                        balance = balance - savedWeapon[3].weaponPrice;
                        balanceDiv.innerText = "Balance: $" + balance;
                    }
                }
            });
            break;
        case 'Knives':
            knivesArray.forEach((item) => {
                if (item.weaponId === weapon) {
                    if(savedWeapon[4] === undefined){
                        savedWeapon[4] = item;
                        balance = balance - savedWeapon[4].weaponPrice;
                        balanceDiv.innerText = "Balance: $" + balance;
                        console.log(savedWeapon)
                    }else{
                        balance = balance + savedWeapon[4].weaponPrice;
                        savedWeapon[4] = item;
                        balance = balance - savedWeapon[4].weaponPrice;
                        balanceDiv.innerText = "Balance: $" + balance;
                    }
                }
            });
            break;
        case 'Gloves':
            glovesArray.forEach((item) => {
                if (item.weaponId === weapon) {
                    if(savedWeapon[5] === undefined){
                        savedWeapon[5] = item;
                        balance = balance - savedWeapon[5].weaponPrice;
                        balanceDiv.innerText = "Balance: $" + balance;
                        console.log(savedWeapon)
                    }else{
                        balance = balance + savedWeapon[5].weaponPrice;
                        savedWeapon[5] = item;
                        balance = balance - savedWeapon[5].weaponPrice;
                        balanceDiv.innerText = "Balance: $" + balance;
                    }
                }
            });
            break;
    }
}
//function to validate weapon selection
function validateWeaponSelection(){
    let errorElement = document.getElementById("errorMessage");
    if(savedWeapon[0] === undefined){
        errorElement.innerText = "select a pistol to continue!";
    } else if(savedWeapon[1] === undefined){
        errorElement.innerText = "select a Rifle to continue!"
    } else if(savedWeapon[2] === undefined){
       errorElement.innerText = "select a Heavy weapon to continue!";
    } else if(savedWeapon[3] === undefined){
        errorElement.innerText = "select an SMG to continue!";
    } else if(savedWeapon[4] === undefined){
       errorElement.innerText = "select a Knife to continue!";
    } else if(savedWeapon[5] === undefined){
       errorElement.innerText = "select a glove to continue!";
    } else if(balance < 0){
        errorElement.innerText = "Can't proceed , choose a new loadout within $9000!";
    } else{
        localStorage.setItem("user-info",JSON.stringify(savedWeapon));
        console.log("Succedded");
        window.location.href = "team-name-selection.html";
    }
}
function displayPlayerLoadout(){
    let userWeaponInfo = JSON.parse(localStorage.getItem('user-info'));
    console.log(userWeaponInfo);
    let username = localStorage.getItem("username");
    console.log(username);
    let selectedAgent = localStorage.getItem("selected-agent");
    console.log(selectedAgent);
    let selectedTeam = localStorage.getItem("selected-team");
    console.log(selectedTeam);
    let selectedAgentImage = localStorage.getItem("selected-agent-image");
    document.getElementById("userName").innerText = username;
    document.querySelector(".character-image").style = `background-image: url(${selectedAgentImage})`;
    for(let i = 0; i<6; i++){
        document.querySelectorAll(".weapon-image img")[i].src = userWeaponInfo[i].weaponImage;
        document.querySelectorAll(".weapon-image")[i].id = userWeaponInfo[i].weaponId;
    }
    let weaponContainer = document.querySelectorAll(".weapon-image");
    weaponContainer.forEach((item)=>{
        item.addEventListener("mouseenter",()=>{
        let containerID = item.getAttribute("id");
        for(let i=0;i<6;i++){
            if(containerID === userWeaponInfo[i].weaponId){
                let weaponName = userWeaponInfo[i].weaponSkinName;
                let weaponSkin = userWeaponInfo[i].patternName;
                let weaponCategory = userWeaponInfo[i].categoryName;
                let weaponPrice = userWeaponInfo[i].weaponPrice;
                document.getElementById("detailsBox").style.opacity = "1";
                document.getElementById("weaponCategory").innerText = `Weapon Category:\n${weaponCategory}`;
                document.getElementById("weaponSkinName").innerText = `Weapon Skin Pattern:\n${weaponSkin}`;
                document.getElementById("weaponName").innerText = `Weapon Name:\n${weaponName}`;
                document.getElementById("weaponPrice").innerText = `Weapon Price:\n$${weaponPrice}`;
            }
        }
        })
    });
    weaponContainer.forEach((item)=>{
        item.addEventListener("mouseleave",()=>{           
            document.getElementById("detailsBox").style.opacity = "0";
            document.getElementById("weaponCategory").innerText = ``;
                document.getElementById("weaponSkinName").innerText = ``;
                document.getElementById("weaponName").innerText = ``;
                document.getElementById("weaponPrice").innerText = ``;
        })
    })
}
function validateTeamName(){
    let inputTextName = document.getElementById("teamNameinput").value.trim();
    let regex = /^[a-zA-Z]+$/;
    var singleWordRegex = /^\w+$/;
    let isValid = regex.test(inputTextName);
    let isValidWord = singleWordRegex.test(inputTextName);
    console.log(isValidWord)
    console.log(isValid);
    let errorElement = document.getElementById("errorMessage");
    if(inputTextName === undefined || inputTextName === ""){
    errorElement.innerText = "Assign team name!"
    return;
    }
    if(isValid === false)
    errorElement.innerText = "Only alphabets are supported! No other characters!";
    else if(isValidWord === false)
    errorElement.innerText = "No more than one word is permitted!";
    else
    window.location.href = "final-screen.html";
}
//function to display final team
let userTeamAgents = [];
let teamMembers = [];
function displayTeam(){
    let selectedTeam = localStorage.getItem("selected-team");
    let selectedAgent = localStorage.getItem("selected-agent");
    console.log(selectedAgent);
    for(let i = 0; i < agentArray.length; i++){
        if(agentArray[i].team.id === selectedTeam){
            if(agentArray[i].name === selectedAgent){
                localStorage.setItem("user-selected-agent",JSON.stringify(agentArray[i]));
            }
            else{
                userTeamAgents.push(agentArray[i]);
            }
        }
    }
    let userSelectedAgent = JSON.parse(localStorage.getItem("user-selected-agent"));
    max = userTeamAgents.length;
    teamMembers.push(userSelectedAgent);
    console.log(teamMembers.length);
    while(teamMembers.length < 4){
        let random = getRandom(max);
        console.log("in while");
        console.log(random);
        teamMembers.push(userTeamAgents[random]);
    }
    console.log(userTeamAgents);
    console.log(teamMembers);
    addAgentsDetails(teamMembers,4);
}
//get random number for agent Selection
function getRandom(max){
    let min = 0;
    let randomNumber = Math.round(Math.random() * (max - min) + min);
    return randomNumber;
}
//function to append agent details
//line 553
function addAgentsDetails(teamMembers,length){
    let userName = localStorage.getItem("username");
    let userWeaponLoadout = JSON.parse(localStorage.getItem("user-info"));
    console.log("yy")
    console.log(teamMembers);
    console.log(userWeaponLoadout)
    document.getElementsByClassName("character-name")[0].innerText = userName;
    document.getElementsByClassName("character-image")[0].src = teamMembers[0].image;
    for(let i=0;i<6;i++){
    document.getElementsByClassName("weapon-image")[i].src = userWeaponLoadout[i].weaponImage;
    }
    for(let i = 1; i<length; i++){
    let characters = document.getElementsByClassName("character-name");
    let randomUserName = getRandom(namesArray.length);
    characters[i].innerText = namesArray[randomUserName];
        for(let j = 0; j<6; j++){
            let weaponsImage = document.querySelectorAll(".weapon-boxes img");
            weaponsImage[j].setAttribute("src",userWeaponLoadout[j].weaponImage);
        }
    }
    console.log("tt")
    console.log(teamMembers)
    for(let i = 1; i<4; i++){
        let characterImages = document.querySelectorAll(".character img");
        characterImages[i].src = teamMembers[i].image;
    }
    for(let i = 6; i<24; i++){
        let weaponsImage = document.querySelectorAll(".weapon-boxes img");
        if(i === 6 || i === 12 || i === 18){
            weaponsImage[i].setAttribute("src",pistolsArray[Math.floor(Math.random() * 15)].weaponImage);
        }else if(i === 7 || i === 13 || i === 19){
            weaponsImage[i].setAttribute("src", riflesArray[Math.floor(Math.random() * 15)].weaponImage);
        }else if(i === 8 || i === 14 || i === 20){
            weaponsImage[i].setAttribute("src", heavyArray[Math.floor(Math.random() * 15)].weaponImage);
        }else if(i === 9 || i === 15 || i === 21){
            weaponsImage[i].setAttribute("src", smgArray[Math.floor(Math.random() * 15)].weaponImage);
        }else if(i === 10 || i === 16 || i === 22){
            weaponsImage[i].setAttribute("src", knivesArray[Math.floor(Math.random() * 15)].weaponImage);
        }else if(i === 11 || i === 17 || i === 23){
            weaponsImage[i].setAttribute("src", glovesArray[Math.floor(Math.random() * 15)].weaponImage);
        }
    }
}
//loadout selector
