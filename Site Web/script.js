let gameData; 
let currentTurnIndex = 0; 
let scores = [0, 0]; 
let bonuses = [0, 0]; 

const DesImg = document.querySelectorAll(".des");
const theme = localStorage.getItem("theme");
const audio = new Audio('./Images/lofi.mp3');

const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a', 'Enter'];
let currentInput = []; 

let overlay;


function VerifEntrer(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        afficherGif('./Images/lanceDes.gif', 2500, 'ChargerDonneeJeu'); 
    }
}
async function ChargerDonneeJeu() {
    const fileName = document.getElementById("nomFichier").value || "exemple.json";
    ResetJeu()
    try {
        const response = await fetch(`bdd_yams/${fileName}`);
        gameData = await response.json();
        const boutonvue = document.querySelectorAll('#boutonsVue button');
        boutonvue[0].classList.remove("invisible"); 
        boutonvue[2].classList.remove("invisible");
    } catch (error) {
        console.error("Erreur de chargement des données JSON :", error);
        alert("Erreur de chargement des données JSON. Vérifiez le nom du fichier et réessayez."); 
    }
}


function AfficherVueGlobale() {
    document.getElementById("vueGlobale").style.display = "flex";
    document.getElementById("vueTour").style.display = "none";
    const globalSummary = document.getElementById("resumeGlobal");

    const gameParameters = gameData.parameters;
    const parametersDisplay = `
        <p><strong>Code de Jeu:</strong> ${gameParameters.code}</p>
        <p><strong>Date:</strong> ${gameParameters.date}</p>
    `;
    
    const joueur1 = gameData.players[0];
    const joueur2 = gameData.players[1];
    const score1 = gameData.final_result.find(res => res.id_player === joueur1.id).score;
    const score2 = gameData.final_result.find(res => res.id_player === joueur2.id).score;

    globalSummary.innerHTML = `
        ${parametersDisplay}
        <p>${joueur1.pseudo} - Score Final : ${score1}</p>
        <p>${joueur2.pseudo} - Score Final : ${score2}</p>
    `;
}
function AfficherVueParTour() {
    document.getElementById("vueGlobale").style.display = "none";
    document.getElementById("vueTour").style.display = "flex"; 
    AfficherTourActuel();
}
function updateDiceImages(joueur1Result, joueur2Result, joueur1, joueur2, currentTurnIndex) {
    const theme = localStorage.getItem("theme");
    const turnDisplay = document.getElementById("tourActuel");
    let html1 = "";
    for (let i = 0; i < joueur1Result.dice.length; i++) {
        html1 += `<img src="./Images/Dés_${theme}/${joueur1Result.dice[i]}.png" height="30rem" width="30rem">`;
    }

    let html2 = "";
    for (let i = 0; i < joueur2Result.dice.length; i++) {
        html2 += `<img src="./Images/Dés_${theme}/${joueur2Result.dice[i]}.png" height="30rem" width="30rem">`;
    }

    turnDisplay.innerHTML = `
        <h3>Tour ${currentTurnIndex + 1}</h3>
        <div class="players">
            <div class="player">
                <h4>${joueur1.pseudo} :</h4>
                <div class="des"> ${html1} </div>
                <p> - Challenge : ${joueur1Result.challenge}</p>
                <p> - Points : ${joueur1Result.score}</p>
            </div>
            <div class="player">
                <h4>${joueur2.pseudo} :</h4>
                <div class="des"> ${html2} </div>
                <p> - Challenge : ${joueur2Result.challenge}</p>
                <p> - Points : ${joueur2Result.score}</p>
            </div>
        </div>
    `;
}


function AfficherTourPrecedent() {
    if (currentTurnIndex > 0) {
        currentTurnIndex--; 
        AfficherTourActuel();
    }
}
function AfficherTourActuel() {
    const navigationButtons = document.querySelectorAll('.navigation button'); 

    navigationButtons[0].classList.toggle('disabled', currentTurnIndex === 0); 
    navigationButtons[1].classList.toggle('disabled', currentTurnIndex === gameData.rounds.length - 1);

    const joueur1 = gameData.players[0];
    const joueur2 = gameData.players[1];

    scores = [0, 0];

    for (let i = 0; i <= currentTurnIndex; i++) {
        const turn = gameData.rounds[i];
        const joueur1Result = turn.results.find(result => result.id_player === joueur1.id);
        const joueur2Result = turn.results.find(result => result.id_player === joueur2.id);

        scores[0] += joueur1Result.score;
        scores[1] += joueur2Result.score;
    }

    const currentTurn = gameData.rounds[currentTurnIndex];
    const joueur1Result = currentTurn.results.find(result => result.id_player === joueur1.id); 
    const joueur2Result = currentTurn.results.find(result => result.id_player === joueur2.id);

    const turnDisplay = document.getElementById("tourActuel");
    updateDiceImages(joueur1Result, joueur2Result, joueur1, joueur2, currentTurnIndex);

    document.getElementById("scoreJoueur1").innerHTML = `${joueur1.pseudo} : ${scores[0]}`;
    document.getElementById("scoreJoueur2").innerHTML = `${joueur2.pseudo} : ${scores[1]}`;
    
    if (currentTurnIndex === gameData.rounds.length - 1) {
        const finalScore1 = scores[0] + gameData.final_result.find(res => res.id_player === joueur1.id).bonus;
        const finalScore2 = scores[1] + gameData.final_result.find(res => res.id_player === joueur2.id).bonus;
        
        document.getElementById("scoreJoueur1").innerHTML = `${joueur1.pseudo} : ${finalScore1} pts (dont ${gameData.final_result.find(res => res.id_player === joueur1.id).bonus} pts bonus)`;
        document.getElementById("scoreJoueur2").innerHTML = `${joueur2.pseudo} : ${finalScore2} pts (dont ${gameData.final_result.find(res => res.id_player === joueur2.id).bonus} pts bonus)`;
    }
}
function AfficherTourSuivant() {
    if (currentTurnIndex < gameData.rounds.length - 1) {
        currentTurnIndex++;
        AfficherTourActuel();
    }
}


function ResetJeu() {
    gameData = null; 
    currentTurnIndex = 0; 
    scores = [0, 0];
    bonuses = [0, 0];

    document.getElementById("resumeGlobal").innerHTML = ""; 
    document.getElementById("tourActuel").innerHTML = ""; 
    document.getElementById("scoreJoueur1").innerHTML = "";
    document.getElementById("scoreJoueur2").innerHTML = "";

    document.getElementById("vueGlobale").style.display = "none";
    document.getElementById("vueTour").style.display = "none";
    document.querySelectorAll('#boutonsVue button')[0].classList.add("invisible");
    document.querySelectorAll('#boutonsVue button')[2].classList.add("invisible");

    document.getElementById("nomFichier").value = "";
}


function ChangerTheme() {
    const body = document.body;
    const themeToggleButton = document.getElementById("toggleTheme");

    if (body.classList.contains("god-mod")) {
        if  (confirm('Vous êtes sur le point de quitter notre espace VIP. Êtes-vous certain de vouloir mettre fin à cette expérience exclusive ?')) {
            body.classList.remove("god-mod");
            audio.pause()
            audio.currentTime = 0;
            body.classList.add("theme-sombre");
            localStorage.setItem("theme", "sombre");
            themeToggleButton.innerText = "☀️";
            const DesImg = document.querySelectorAll(".des");
            const theme = localStorage.getItem("theme");
            DesImg.forEach((element, index) => {
                let html1 = "";
                for (let i = 1; i < 6; i++) {
                    html1 += `<img src="./Images/Dés_${theme}/${i}.png" height="30rem" width="30rem">`;
                }
                element.innerHTML  = html1;
                let html2 = "";
                for (let i = 1; i < 6; i++) {
                    html2 += `<img src="./Images/Dés_${theme}/${i}.png" height="30rem" width="30rem">`;
                }
                element.innerHTML  = html2;
            }); 
        } 
        else {
            return;
        }
    } else {

        body.classList.toggle("theme-sombre");

        if (body.classList.contains("theme-sombre")) {
            localStorage.setItem("theme", "sombre");
            
            themeToggleButton.innerText = "☀️";
        } else {
            localStorage.setItem("theme", "clair");
            themeToggleButton.innerText = "🌙";
        }
        const DesImg = document.querySelectorAll(".des");
        const theme = localStorage.getItem("theme");
        DesImg.forEach((element, index) => {
            let html1 = "";
            for (let i = 1; i < 6; i++) {
                html1 += `<img alt="${i}src="./Images/Dés_${theme}/${i}.png" height="30rem" width="30rem">`;
            }
            element.innerHTML  = html1;
            let html2 = "";
            for (let i = 1; i < 6; i++) {
                html2 += `<img src="./Images/Dés_${theme}/${i}.png" height="30rem" width="30rem">`;
            }
            element.innerHTML  = html2;
        
        }); 
    }
}
document.addEventListener("DOMContentLoaded", () => {
    VerifVarPersist();
    checkCookieConsent();

}
)
function VerifVarPersist() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
        if (savedTheme === "sombre") {
            document.body.classList.add("theme-sombre"); 
            document.getElementById("toggleTheme").innerText = "☀️";
        } else if (savedTheme === "clair") {
            document.body.classList.remove("theme-sombre");
            document.getElementById("toggleTheme").innerText = "🌙";
        } else if (savedTheme === "god-mod") {
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                document.body.classList.add("theme-sombre"); 
                localStorage.setItem("theme", "sombre");
            } else {
                document.body.classList.remove("theme-sombre");
                localStorage.setItem("theme", "clair");
            }
        }
    } else {
        const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (prefersDarkScheme) {
            document.body.classList.add("theme-sombre");
            document.getElementById("toggleTheme").innerText = "☀️";
            localStorage.setItem("theme", "sombre");
        } else {
            document.body.classList.remove("theme-sombre");
            document.getElementById("toggleTheme").innerText = "🌙";
            localStorage.setItem("theme", "clair");
        }
    }
}

function checkSequence() {
    if (currentInput.join(',') === sequence.join(',')) {
        audio.play();
        afficherGif('./Images/code.gif', 2500, 'godmode');
        currentInput = [];
    } else if (currentInput.length >= sequence.length) {
        currentInput.shift();
    }
}
document.addEventListener('keydown', function(event) {
    currentInput.push(event.key);
    console.debug(event.key)
    checkSequence();
}
)
async function godmode() {
    const themeToggleButton = document.getElementById("toggleTheme");
    const body = document.body;
    themeToggleButton.innerText = '👑' 
    currentTurnIndex = 0
    sleep(3500)
    showCustomAlert('Bienvenue dans notre espace VIP. Nous vous invitons à vous installer confortablement et à vous laisser emporter par une ambiance pensée pour votre bien-être et votre plaisir. Pour une immersion complète, n\'hésitez pas à mettre votre casque et à savourer chaque note de la musique qui vous accompagne.');
    body.classList.toggle("god-mod")
    localStorage.setItem("theme", "god-mod")
    document.querySelectorAll(".des").forEach((element, index) => {
        let html1 = "";
        for (let i = 1; i < 6; i++) {
            html1 += `<img src="./Images/Dés_god-mod/${i}.png" height="30rem" width="30rem">`;
        }
        element.innerHTML  = html1;
        let html2 = "";
        for (let i = 1; i < 6; i++) {
            html2 += `<img src="./Images/Dés_god-mod/${i}.png" height="30rem" width="30rem">`;
        }
        element.innerHTML  = html2;
        
    }); 
}

function showCustomAlert(message) {
    overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "999";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
                
    const alertBox = document.getElementById("customAlert");
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    const alertMessage = document.getElementById("alertMessage");
    alertMessage.textContent = message;
    alertBox.style.display = "flex"; 
} 
function closeCustomAlert() {
    document.body.removeChild(overlay);
    const alertBox = document.getElementById("customAlert");
    alertBox.style.display = "none";
}


function checkCookieConsent() {
    const consentTimestamp = localStorage.getItem("cookieConsentTimestamp");
    const consentGiven = localStorage.getItem("cookieConsent");

    if (!consentTimestamp || Date.now() - consentTimestamp > 24 * 60 * 60 * 1000) {
        
        const overlay = document.createElement("div");
        overlay.id = "cookies";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.zIndex = "999";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";

        const cookieBanner = document.getElementById("cookieBanner");
        cookieBanner.style.display = "block";
        overlay.appendChild(cookieBanner);
        document.body.appendChild(overlay);

    } else if (consentGiven === "true") {
        console.log("Consentement aux cookies accepté.");
    } else {
        console.log("Consentement aux cookies refusé.");
    }
}

function setCookieConsent(consent) {
    localStorage.setItem("cookieConsent", consent);
    localStorage.setItem("cookieConsentTimestamp", Date.now());

    if (consent) {
        let overlay = document.getElementById('cookies')
        if (overlay) {
            overlay.remove()
        }
        console.log("Cookies supplémentaires activés.");
    } else {
        let overlay = document.getElementById('cookies')
        if (overlay) {
            overlay.remove()
        }
        console.log("Cookies supplémentaires désactivés.");
    }
    document.getElementById("cookieBanner").style.display = "none";
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function afficherGif(path, duree, foncname){
    const existingContainer = document.getElementById("gifContainer");
    if (existingContainer) {
        document.body.removeChild(existingContainer);
    }
    const gifContainer = document.createElement("div");
    gifContainer.id = "gifContainer";

    const gifImage = document.createElement("img");

    gifImage.src = path;
    gifImage.alt = "GIF au Centre";

    gifContainer.appendChild(gifImage);

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "999";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";

    overlay.appendChild(gifContainer);

    document.body.appendChild(overlay);

    gifContainer.style.zIndex = "1000"; 
    gifContainer.style.display = "flex";
    gifContainer.style.justifyContent = "center";
    gifContainer.style.alignItems = "center";
    gifContainer.style.position = "absolute"; 
    gifContainer.style.top = "50%";
    gifContainer.style.left = "50%";
    gifContainer.style.transform = "translate(-50%, -50%)";

    setTimeout(() => {document.body.removeChild(overlay); }, duree);
    await sleep(duree + 500);
    window[foncname]();
}