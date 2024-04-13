//api links
const AGENT_URL = "https://bymykel.github.io/CSGO-API/api/en/agents.json";
const WEAPONS_URL = "https://bymykel.github.io/CSGO-API/api/en/skins.json";

//array to store api data
let agentArray = [];
let weaponsArray = [];

//function to fetch api to call api and set data.
function apiFetch(url, callbackfunction){
   let xhr = new XMLHttpRequest();
    xhr.open("GET",url,false);
    xhr.onload = () =>{
        callbackfunction(xhr.responseText);
    }
    xhr.send();
}
//call to do api fetch
apiFetch(AGENT_URL,(response) => {
    agentArray = JSON.parse(response);
    console.log(agentArray); //for debugging purpose
});
//call to do api fetch 
apiFetch(WEAPONS_URL,(response) => {
    weaponsArray = JSON.parse(response);
    console.log(weaponsArray); //for debugging purpose
});
//function to call selected team
function selectedTeam(teamName){
    localStorage.setItem("selected-team", teamName);
    window.location.href = "agent-select.html";
}
//assign random team
function randomTeam(){
    let randomNumber = Math.round(Math.random()); // rounding the random number returned.
    if(randomNumber === 1){
        localStorage.setItem('selected-team', 'terrorists');
        window.location.href = "agent-select.html";
    }else {
        localStorage.setItem('selected-team','counter-terrorists');
        window.location.href = "agent-select.html";
    }
}

//function to display all selected agents
function displaySelectedAgents(){
    let selectedTeam = localStorage.getItem("selected-team");
    let heading = document.getElementById("agentSelectHeading");
    heading.innerText = "Choose an agent: "+selectedTeam;
    let agentListContainer = document.getElementById("agentListContainer");
    console.log(selectedTeam)
    //to loop all agents and display the agents into the webpage
    for(let i = 0; i < agentArray.length; i++){
        if(agentArray[i].team.id === selectedTeam){
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
function agentSelect(classname){
    let agent = document.querySelectorAll(classname);
    agent.forEach(function(item){
        item.addEventListener("click", ()=>{
            agent.forEach(function(item2){
                item2.classList.remove('active')
            });
            item.classList.toggle("active");
        })
    });
}
