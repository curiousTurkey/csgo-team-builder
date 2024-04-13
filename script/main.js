//api links
const AGENT_URL = "https://bymykel.github.io/CSGO-API/api/en/agents.json";
const WEAPONS_URL = "https://bymykel.github.io/CSGO-API/api/en/skins.json";

//array to store api data
let agentArray = [];
// let weaponsArray = [];
let counterTerroristWeapons = [];
let terroristsWeapons = [];
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
                            if(tempArray[i].category.name === 'Pistols'){
                                min = 200;
                                max = 700;
                                tempArray[i].price = getRandomNumber(min, max);
                            }
                            if(tempArray[i].category.name === 'Rifles'){
                                min = 1500;
                                max = 3500;
                                tempArray[i].price = getRandomNumber(min,max);
                            }
                            if(tempArray[i].category.name === 'Heavy'){
                                min = 2500;
                                max = 4500;
                                tempArray[i].price = getRandomNumber(min,max);
                            }
                            if(tempArray[i].category.name === 'SMGs'){
                                min = 1000;
                                max = 1500;
                                tempArray[i].price = getRandomNumber(min,max);
                            }
                            if(tempArray[i].category.name === 'Knives'){
                                min = 100;
                                max = 500;
                                tempArray[i].price = getRandomNumber(min,max);
                            }
                            if(tempArray[i].category.name === 'Gloves'){
                                min = 100;
                                max = 500;
                                tempArray[i].price = getRandomNumber(min,max);
                            }
                            if (tempArray[i].team.id === 'both') {
                                counterTerroristWeapons.push(tempArray[i]);
                                terroristsWeapons.push(tempArray[i]);
                            }
                            else if (tempArray[i].team.id === 'counter-terrorists') {
                                counterTerroristWeapons.push(tempArray[i]);
                            } else if (tempArray[i].team.id === 'terrorists') {
                                terroristsWeapons.push(tempArray[i]);
                            }

                        } else {
                            continue;
                        }
    }
    tempArray = [];
    console.log(terroristsWeapons);
    console.log(counterTerroristWeapons);
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
                let selectedAgent = agents[i].innerText;
                localStorage.setItem('selected-agent', selectedAgent);
            } else if (isActive == true) {
                for (let j = 0; j < agents.length; j++) {
                    agents[j].classList.remove("active");
                }
                agents[i].classList.add("active");
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

//display weapons to respective category
function showWeaponsToCategory() {

}




